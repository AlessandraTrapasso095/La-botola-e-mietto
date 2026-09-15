create table public.email_marketing_campaigns (
  id uuid primary key default gen_random_uuid(),

  campaign_key text not null,
  subject text not null,
  title text not null,
  intro text not null,
  content text not null,

  cta_label text,
  cta_href text,

  audience_mode text not null
    check (audience_mode in ('all', 'selected')),

  selected_profile_ids uuid[],

  eligible_count integer not null default 0
    check (eligible_count >= 0),

  sent_count integer not null default 0
    check (sent_count >= 0),

  duplicate_count integer not null default 0
    check (duplicate_count >= 0),

  failed_count integer not null default 0
    check (failed_count >= 0),

  status text not null default 'draft'
    check (
      status in (
        'draft',
        'sending',
        'completed',
        'completed_with_errors',
        'failed'
      )
    ),

  started_at timestamptz,
  completed_at timestamptz,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint email_marketing_campaigns_campaign_key_unique
    unique (campaign_key),

  constraint email_marketing_campaigns_selected_audience_valid
    check (
      (
        audience_mode = 'all'
        and selected_profile_ids is null
      )
      or
      (
        audience_mode = 'selected'
        and selected_profile_ids is not null
        and cardinality(selected_profile_ids) > 0
      )
    )
);

create index email_marketing_campaigns_created_at_idx
on public.email_marketing_campaigns(created_at desc);

create index email_marketing_campaigns_status_idx
on public.email_marketing_campaigns(status, created_at desc);

comment on table public.email_marketing_campaigns is
  'Storico delle campagne promozionali create e inviate dal pannello amministrativo.';

comment on column public.email_marketing_campaigns.campaign_key is
  'Identificativo stabile usato anche per l idempotenza delle email della campagna.';

comment on column public.email_marketing_campaigns.selected_profile_ids is
  'Profili selezionati manualmente quando audience_mode = selected.';

alter table public.email_marketing_campaigns
enable row level security;

revoke all
on table public.email_marketing_campaigns
from public, anon, authenticated;

grant select, insert, update
on table public.email_marketing_campaigns
to service_role;
