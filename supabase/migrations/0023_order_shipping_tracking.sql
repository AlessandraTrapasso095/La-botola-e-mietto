-- La Botola e Mietto
-- Shipping & tracking data for customer/admin order management.
--
-- Tutti i campi sono nullable per mantenere compatibilità con:
-- - ordini già esistenti
-- - ritiro in negozio
-- - ordini non ancora spediti

alter table public.orders
  add column if not exists shipping_carrier text,
  add column if not exists tracking_code text,
  add column if not exists tracking_url text,
  add column if not exists shipped_at timestamptz,
  add column if not exists delivered_at timestamptz;

comment on column public.orders.shipping_carrier is
  'Nome del corriere utilizzato per la spedizione, ad esempio TNT/FedEx.';

comment on column public.orders.tracking_code is
  'Codice tracking comunicato dal corriere.';

comment on column public.orders.tracking_url is
  'URL pubblico per seguire la spedizione.';

comment on column public.orders.shipped_at is
  'Data e ora in cui l ordine è stato segnato come spedito.';

comment on column public.orders.delivered_at is
  'Data e ora in cui l ordine è stato segnato come consegnato.';
