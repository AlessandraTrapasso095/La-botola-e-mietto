alter table public.profiles
add column email_updates boolean not null default true;

alter table public.consent_records
drop constraint consent_records_profile_id_fkey,
add constraint consent_records_profile_id_fkey
foreign key (profile_id) references public.profiles(id) on delete cascade;

create function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  metadata jsonb := coalesce(new.raw_user_meta_data, '{}'::jsonb);
  policy_version text := coalesce(
    nullif(metadata ->> 'policy_version', ''),
    'local-auth-v1'
  );
begin
  insert into public.profiles (
    id,
    first_name,
    last_name,
    email,
    marketing_consent,
    email_updates
  ) values (
    new.id,
    coalesce(metadata ->> 'first_name', ''),
    coalesce(metadata ->> 'last_name', ''),
    lower(trim(new.email)),
    coalesce((metadata ->> 'marketing_consent')::boolean, false),
    true
  );

  if metadata ? 'privacy_consent' then
    insert into public.consent_records (
      profile_id,
      type,
      granted,
      policy_version,
      source
    ) values (
      new.id,
      'privacy',
      coalesce((metadata ->> 'privacy_consent')::boolean, false),
      policy_version,
      'registration'
    );
  end if;

  if metadata ? 'adult_confirmation' then
    insert into public.consent_records (
      profile_id,
      type,
      granted,
      policy_version,
      source
    ) values (
      new.id,
      'age_confirmation',
      coalesce((metadata ->> 'adult_confirmation')::boolean, false),
      policy_version,
      'registration'
    );
  end if;

  if metadata ? 'marketing_consent' then
    insert into public.consent_records (
      profile_id,
      type,
      granted,
      policy_version,
      source,
      metadata
    ) values (
      new.id,
      'marketing',
      coalesce((metadata ->> 'marketing_consent')::boolean, false),
      policy_version,
      'registration',
      jsonb_build_object('email_updates', true)
    );
  end if;

  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_auth_user();

create policy "Users record own consents"
on public.consent_records for insert to authenticated
with check (
  profile_id = auth.uid()
  and anonymous_id is null
);

revoke update on public.profiles from authenticated;
grant update (
  first_name,
  last_name,
  phone,
  birth_date,
  marketing_consent,
  email_updates
) on public.profiles to authenticated;
grant insert on public.consent_records to authenticated;

create function public.update_account_preferences(
  marketing_consent_value boolean,
  email_updates_value boolean,
  policy_version_value text
)
returns public.profiles
language plpgsql
security invoker
set search_path = ''
as $$
declare
  updated_profile public.profiles;
begin
  if auth.uid() is null then
    raise exception 'Authentication required';
  end if;

  update public.profiles
  set
    marketing_consent = marketing_consent_value,
    email_updates = email_updates_value
  where id = auth.uid()
    and deleted_at is null
  returning * into updated_profile;

  if updated_profile.id is null then
    raise exception 'Profile not available';
  end if;

  insert into public.consent_records (
    profile_id,
    type,
    granted,
    policy_version,
    source,
    metadata
  ) values (
    auth.uid(),
    'marketing',
    marketing_consent_value,
    policy_version_value,
    'account_settings',
    jsonb_build_object('email_updates', email_updates_value)
  );

  return updated_profile;
end;
$$;

grant execute on function public.update_account_preferences(
  boolean,
  boolean,
  text
) to authenticated;
