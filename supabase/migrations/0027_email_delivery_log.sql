create table if not exists public.email_deliveries (
  id uuid primary key default gen_random_uuid(),

  event_key text not null,
  event_type text not null,
  template_key text not null,

  recipient_email text not null,

  status text not null default 'pending'
    check (
      status in (
        'pending',
        'sent',
        'failed',
        'skipped'
      )
    ),

  provider_message_id text,

  attempt_count integer not null default 0
    check (attempt_count >= 0),

  metadata jsonb not null default '{}'::jsonb,

  last_error text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  sent_at timestamptz,
  failed_at timestamptz
);

create unique index if not exists
  email_deliveries_event_key_unique
on public.email_deliveries(event_key);

create index if not exists
  email_deliveries_status_created_idx
on public.email_deliveries(status, created_at desc);

create index if not exists
  email_deliveries_recipient_idx
on public.email_deliveries(recipient_email, created_at desc);

comment on table public.email_deliveries is
  'Registro idempotente degli invii email applicativi.';

comment on column public.email_deliveries.event_key is
  'Chiave univoca dell evento email per prevenire invii duplicati.';

comment on column public.email_deliveries.template_key is
  'Template logico usato per generare il messaggio.';

comment on column public.email_deliveries.provider_message_id is
  'Identificativo restituito dal provider email.';

alter table public.email_deliveries
  enable row level security;

revoke all
on public.email_deliveries
from anon, authenticated;

grant select, insert, update
on public.email_deliveries
to service_role;
