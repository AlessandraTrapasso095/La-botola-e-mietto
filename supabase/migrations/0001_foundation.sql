create extension if not exists "pgcrypto";

create type public.product_status as enum ('draft', 'active', 'archived');

create table public.products (
  id uuid primary key default gen_random_uuid(),
  sku text not null unique,
  name text not null,
  slug text not null unique,
  description text,
  category text not null,
  subcategory text,
  net_price_cents bigint not null check (net_price_cents >= 0),
  vat_rate_basis_points integer not null default 2200 check (
    vat_rate_basis_points between 0 and 10000
  ),
  currency char(3) not null default 'EUR' check (currency = 'EUR'),
  stock_quantity integer not null default 0 check (stock_quantity >= 0),
  image_path text,
  status public.product_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.products enable row level security;

create policy "Catalogo attivo visibile pubblicamente"
on public.products
for select
to anon, authenticated
using (status = 'active');

create index products_status_category_idx
on public.products (status, category);

create index products_subcategory_idx
on public.products (subcategory)
where subcategory is not null;

insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

create policy "Immagini prodotto pubbliche in lettura"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'product-images');
