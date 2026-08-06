alter table public.addresses
drop constraint if exists addresses_country_code_check;

drop index if exists public.addresses_default_type_uidx;

alter table public.addresses
rename column line1 to street;

alter table public.addresses
add column label text not null default 'Indirizzo',
add column first_name text,
add column last_name text not null default '',
add column company text,
add column street_number text not null default '',
add column phone text not null default '',
add column is_default_shipping boolean not null default false,
add column is_default_billing boolean not null default false;

update public.addresses
set
  first_name = split_part(trim(recipient_name), ' ', 1),
  last_name = coalesce(
    nullif(regexp_replace(trim(recipient_name), '^\S+\s*', ''), ''),
    trim(recipient_name)
  ),
  street_number = coalesce(
    nullif(substring(trim(street) from '([0-9]+[[:alnum:]/-]*)$'), ''),
    'SNC'
  ),
  street = coalesce(
    nullif(trim(regexp_replace(trim(street), '\s+[0-9]+[[:alnum:]/-]*$', '')), ''),
    trim(street)
  ),
  is_default_shipping = is_default and type = 'shipping',
  is_default_billing = is_default and type = 'billing';

alter table public.addresses
alter column first_name set not null,
drop column recipient_name,
drop column is_default,
add constraint addresses_first_name_present check (trim(first_name) <> ''),
add constraint addresses_last_name_present check (trim(last_name) <> ''),
add constraint addresses_street_present check (trim(street) <> ''),
add constraint addresses_street_number_present check (trim(street_number) <> ''),
add constraint addresses_country_code_format check (
  country_code = upper(country_code) and country_code ~ '^[A-Z]{2}$'
),
add constraint addresses_italian_postal_code check (
  country_code <> 'IT' or postal_code ~ '^[0-9]{5}$'
),
add constraint addresses_italian_province check (
  country_code <> 'IT' or (
    province is not null and province ~ '^[A-Z]{2}$'
  )
);

create unique index addresses_default_shipping_uidx
on public.addresses (profile_id)
where is_default_shipping and deleted_at is null;

create unique index addresses_default_billing_uidx
on public.addresses (profile_id)
where is_default_billing and deleted_at is null;

create function public.upsert_account_address(
  label_value text,
  first_name_value text,
  last_name_value text,
  company_value text,
  street_value text,
  street_number_value text,
  line2_value text,
  postal_code_value text,
  city_value text,
  province_value text,
  country_code_value text,
  phone_value text,
  type_value public.address_type,
  is_default_shipping_value boolean,
  is_default_billing_value boolean,
  address_id_value uuid default null
)
returns public.addresses
language plpgsql
security invoker
set search_path = ''
as $$
declare
  current_user_id uuid := auth.uid();
  saved_address public.addresses;
begin
  if current_user_id is null then
    raise exception 'Authentication required';
  end if;

  if is_default_shipping_value then
    update public.addresses
    set is_default_shipping = false
    where profile_id = current_user_id
      and deleted_at is null
      and is_default_shipping
      and id is distinct from address_id_value;
  end if;

  if is_default_billing_value then
    update public.addresses
    set is_default_billing = false
    where profile_id = current_user_id
      and deleted_at is null
      and is_default_billing
      and id is distinct from address_id_value;
  end if;

  if address_id_value is null then
    insert into public.addresses (
      profile_id,
      label,
      first_name,
      last_name,
      company,
      street,
      street_number,
      line2,
      postal_code,
      city,
      province,
      country_code,
      phone,
      type,
      is_default_shipping,
      is_default_billing
    ) values (
      current_user_id,
      trim(label_value),
      trim(first_name_value),
      trim(last_name_value),
      nullif(trim(company_value), ''),
      trim(street_value),
      trim(street_number_value),
      nullif(trim(line2_value), ''),
      trim(postal_code_value),
      trim(city_value),
      nullif(upper(trim(province_value)), ''),
      upper(trim(country_code_value)),
      trim(phone_value),
      type_value,
      is_default_shipping_value,
      is_default_billing_value
    )
    returning * into saved_address;
  else
    update public.addresses
    set
      label = trim(label_value),
      first_name = trim(first_name_value),
      last_name = trim(last_name_value),
      company = nullif(trim(company_value), ''),
      street = trim(street_value),
      street_number = trim(street_number_value),
      line2 = nullif(trim(line2_value), ''),
      postal_code = trim(postal_code_value),
      city = trim(city_value),
      province = nullif(upper(trim(province_value)), ''),
      country_code = upper(trim(country_code_value)),
      phone = trim(phone_value),
      type = type_value,
      is_default_shipping = is_default_shipping_value,
      is_default_billing = is_default_billing_value
    where id = address_id_value
      and profile_id = current_user_id
      and deleted_at is null
    returning * into saved_address;

    if saved_address.id is null then
      raise exception 'Address not available';
    end if;
  end if;

  return saved_address;
end;
$$;

create function public.delete_account_address(address_id_value uuid)
returns boolean
language plpgsql
security invoker
set search_path = ''
as $$
declare
  deleted_count integer;
begin
  if auth.uid() is null then
    raise exception 'Authentication required';
  end if;

  update public.addresses
  set
    deleted_at = now(),
    is_default_shipping = false,
    is_default_billing = false
  where id = address_id_value
    and profile_id = auth.uid()
    and deleted_at is null;

  get diagnostics deleted_count = row_count;
  return deleted_count = 1;
end;
$$;

revoke all on function public.upsert_account_address(
  text,
  text,
  text,
  text,
  text,
  text,
  text,
  text,
  text,
  text,
  text,
  text,
  public.address_type,
  boolean,
  boolean,
  uuid
) from public, anon;
grant execute on function public.upsert_account_address(
  text,
  text,
  text,
  text,
  text,
  text,
  text,
  text,
  text,
  text,
  text,
  text,
  public.address_type,
  boolean,
  boolean,
  uuid
) to authenticated;

revoke all on function public.delete_account_address(uuid) from public, anon;
grant execute on function public.delete_account_address(uuid) to authenticated;
