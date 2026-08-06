create extension if not exists "pgcrypto";

create type public.product_status as enum ('draft', 'active', 'archived');
create type public.address_type as enum ('shipping', 'billing');
create type public.cart_status as enum ('active', 'converted', 'abandoned');
create type public.order_status as enum (
  'received',
  'preparing',
  'shipped',
  'delivered',
  'cancelled'
);
create type public.payment_status as enum (
  'pending',
  'authorized',
  'paid',
  'failed',
  'refunded'
);
create type public.consent_type as enum (
  'age_confirmation',
  'privacy',
  'marketing',
  'cookie_preferences',
  'terms_of_sale'
);

create function public.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  first_name text not null default '',
  last_name text not null default '',
  email text not null,
  phone text,
  birth_date date,
  marketing_consent boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  constraint profiles_email_normalized check (email = lower(trim(email)))
);

create unique index profiles_email_active_uidx
on public.profiles (email)
where deleted_at is null;

create table public.addresses (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  type public.address_type not null,
  recipient_name text not null,
  line1 text not null,
  line2 text,
  postal_code text not null,
  city text not null,
  province text,
  country_code char(2) not null default 'IT',
  is_default boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create index addresses_profile_idx on public.addresses (profile_id);
create unique index addresses_default_type_uidx
on public.addresses (profile_id, type)
where is_default and deleted_at is null;

create table public.brands (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  country text,
  description text,
  status public.product_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create unique index brands_name_active_uidx
on public.brands (lower(name))
where deleted_at is null;

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid references public.categories(id) on delete restrict,
  name text not null,
  slug text not null unique,
  description text,
  sort_order integer not null default 0,
  status public.product_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  constraint categories_no_self_parent check (parent_id is null or parent_id <> id)
);

create index categories_parent_sort_idx
on public.categories (parent_id, sort_order);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  slug text not null unique,
  brand_id uuid references public.brands(id) on delete restrict,
  category_id uuid not null references public.categories(id) on delete restrict,
  subcategory_id uuid references public.categories(id) on delete restrict,
  description text,
  tasting_notes text,
  service_notes text,
  origin text,
  producer text,
  country text,
  capacity_ml integer check (capacity_ml is null or capacity_ml > 0),
  capacity_label text not null,
  pack_quantity integer check (pack_quantity is null or pack_quantity > 0),
  alcohol_percentage numeric(5, 2) check (
    alcohol_percentage is null or alcohol_percentage between 0 and 100
  ),
  is_new boolean not null default false,
  is_limited boolean not null default false,
  status public.product_status not null default 'draft',
  search_document tsvector generated always as (
    to_tsvector(
      'simple',
      coalesce(code, '') || ' ' || coalesce(name, '') || ' ' ||
      coalesce(producer, '') || ' ' || coalesce(country, '') || ' ' ||
      coalesce(capacity_label, '')
    )
  ) stored,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create index products_catalog_idx
on public.products (status, category_id, brand_id)
where deleted_at is null;
create index products_search_idx on public.products using gin (search_document);
create index products_new_idx on public.products (created_at desc)
where is_new and status = 'active' and deleted_at is null;

create table public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  storage_path text not null unique,
  thumbnail_path text,
  alt_text text not null default '',
  width integer not null check (width > 0),
  height integer not null check (height > 0),
  sort_order integer not null default 0,
  is_primary boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index product_images_product_sort_idx
on public.product_images (product_id, sort_order);
create unique index product_images_primary_uidx
on public.product_images (product_id)
where is_primary;

create table public.inventory (
  product_id uuid primary key references public.products(id) on delete cascade,
  stock_quantity integer not null default 0 check (stock_quantity >= 0),
  reserved_quantity integer not null default 0 check (reserved_quantity >= 0),
  available_quantity integer generated always as (
    greatest(stock_quantity - reserved_quantity, 0)
  ) stored,
  updated_at timestamptz not null default now(),
  constraint inventory_reservation_valid check (reserved_quantity <= stock_quantity)
);

create index inventory_available_idx
on public.inventory (available_quantity)
where available_quantity > 0;

create table public.prices (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  net_amount_minor bigint not null check (net_amount_minor >= 0),
  vat_rate_basis_points integer not null check (
    vat_rate_basis_points between 0 and 10000
  ),
  currency char(3) not null default 'EUR' check (currency = 'EUR'),
  valid_from timestamptz not null default now(),
  valid_to timestamptz,
  created_at timestamptz not null default now(),
  constraint prices_valid_period check (valid_to is null or valid_to > valid_from)
);

create index prices_product_period_idx
on public.prices (product_id, valid_from desc);
create unique index prices_current_product_uidx
on public.prices (product_id)
where valid_to is null;

create table public.offers (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  promotional_net_amount_minor bigint check (promotional_net_amount_minor >= 0),
  starts_at timestamptz,
  ends_at timestamptz,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint offers_valid_period check (
    ends_at is null or starts_at is null or ends_at > starts_at
  )
);

create index offers_active_period_idx
on public.offers (product_id, starts_at, ends_at)
where is_active;
create unique index offers_active_product_uidx
on public.offers (product_id)
where is_active;

create table public.wishlists (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null unique references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.wishlist_items (
  wishlist_id uuid not null references public.wishlists(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (wishlist_id, product_id)
);

create index wishlist_items_product_idx
on public.wishlist_items (product_id);

create table public.carts (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles(id) on delete cascade,
  session_key uuid,
  status public.cart_status not null default 'active',
  currency char(3) not null default 'EUR' check (currency = 'EUR'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  expires_at timestamptz,
  constraint carts_owner_present check (
    profile_id is not null or session_key is not null
  )
);

create unique index carts_active_profile_uidx
on public.carts (profile_id)
where profile_id is not null and status = 'active';
create unique index carts_active_session_uidx
on public.carts (session_key)
where session_key is not null and status = 'active';

create table public.cart_items (
  cart_id uuid not null references public.carts(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete restrict,
  quantity integer not null check (quantity between 1 and 99),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (cart_id, product_id)
);

create index cart_items_product_idx on public.cart_items (product_id);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  profile_id uuid not null references public.profiles(id) on delete restrict,
  status public.order_status not null default 'received',
  payment_status public.payment_status not null default 'pending',
  currency char(3) not null default 'EUR' check (currency = 'EUR'),
  subtotal_net_amount_minor bigint not null check (subtotal_net_amount_minor >= 0),
  vat_amount_minor bigint not null check (vat_amount_minor >= 0),
  shipping_gross_amount_minor bigint not null check (shipping_gross_amount_minor >= 0),
  total_gross_amount_minor bigint not null check (total_gross_amount_minor >= 0),
  shipping_address jsonb not null,
  billing_address jsonb not null,
  payment_provider_reference text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  cancelled_at timestamptz
);

create index orders_profile_created_idx
on public.orders (profile_id, created_at desc);
create index orders_status_created_idx
on public.orders (status, created_at desc);

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete restrict,
  product_code text not null,
  product_name text not null,
  quantity integer not null check (quantity > 0),
  unit_net_amount_minor bigint not null check (unit_net_amount_minor >= 0),
  vat_rate_basis_points integer not null check (
    vat_rate_basis_points between 0 and 10000
  ),
  unit_gross_amount_minor bigint not null check (unit_gross_amount_minor >= 0),
  line_gross_amount_minor bigint not null check (line_gross_amount_minor >= 0),
  created_at timestamptz not null default now()
);

create index order_items_order_idx on public.order_items (order_id);
create index order_items_product_idx on public.order_items (product_id);

create table public.consent_records (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles(id) on delete set null,
  anonymous_id uuid,
  type public.consent_type not null,
  granted boolean not null,
  policy_version text not null,
  source text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  revoked_at timestamptz,
  constraint consent_subject_present check (
    profile_id is not null or anonymous_id is not null
  )
);

create index consent_records_profile_type_idx
on public.consent_records (profile_id, type, created_at desc);
create index consent_records_anonymous_type_idx
on public.consent_records (anonymous_id, type, created_at desc);

create trigger profiles_set_updated_at before update on public.profiles
for each row execute function public.set_updated_at();
create trigger addresses_set_updated_at before update on public.addresses
for each row execute function public.set_updated_at();
create trigger brands_set_updated_at before update on public.brands
for each row execute function public.set_updated_at();
create trigger categories_set_updated_at before update on public.categories
for each row execute function public.set_updated_at();
create trigger products_set_updated_at before update on public.products
for each row execute function public.set_updated_at();
create trigger product_images_set_updated_at before update on public.product_images
for each row execute function public.set_updated_at();
create trigger inventory_set_updated_at before update on public.inventory
for each row execute function public.set_updated_at();
create trigger offers_set_updated_at before update on public.offers
for each row execute function public.set_updated_at();
create trigger wishlists_set_updated_at before update on public.wishlists
for each row execute function public.set_updated_at();
create trigger carts_set_updated_at before update on public.carts
for each row execute function public.set_updated_at();
create trigger cart_items_set_updated_at before update on public.cart_items
for each row execute function public.set_updated_at();
create trigger orders_set_updated_at before update on public.orders
for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.addresses enable row level security;
alter table public.brands enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.inventory enable row level security;
alter table public.prices enable row level security;
alter table public.offers enable row level security;
alter table public.wishlists enable row level security;
alter table public.wishlist_items enable row level security;
alter table public.carts enable row level security;
alter table public.cart_items enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.consent_records enable row level security;

create policy "Catalog brands are public"
on public.brands for select to anon, authenticated
using (status = 'active' and deleted_at is null);

create policy "Catalog categories are public"
on public.categories for select to anon, authenticated
using (status = 'active' and deleted_at is null);

create policy "Active products are public"
on public.products for select to anon, authenticated
using (status = 'active' and deleted_at is null);

create policy "Product images are public"
on public.product_images for select to anon, authenticated
using (
  exists (
    select 1 from public.products
    where products.id = product_images.product_id
      and products.status = 'active'
      and products.deleted_at is null
  )
);

create policy "Inventory availability is public"
on public.inventory for select to anon, authenticated
using (
  exists (
    select 1 from public.products
    where products.id = inventory.product_id
      and products.status = 'active'
      and products.deleted_at is null
  )
);

create policy "Current prices are public"
on public.prices for select to anon, authenticated
using (
  valid_from <= now()
  and (valid_to is null or valid_to > now())
  and exists (
    select 1 from public.products
    where products.id = prices.product_id
      and products.status = 'active'
      and products.deleted_at is null
  )
);

create policy "Active offers are public"
on public.offers for select to anon, authenticated
using (
  is_active
  and (starts_at is null or starts_at <= now())
  and (ends_at is null or ends_at > now())
  and exists (
    select 1 from public.products
    where products.id = offers.product_id
      and products.status = 'active'
      and products.deleted_at is null
  )
);

create policy "Users read own profile"
on public.profiles for select to authenticated using (id = auth.uid());
create policy "Users update own profile"
on public.profiles for update to authenticated using (id = auth.uid())
with check (id = auth.uid());

create policy "Users manage own addresses"
on public.addresses for all to authenticated
using (profile_id = auth.uid()) with check (profile_id = auth.uid());

create policy "Users manage own wishlist"
on public.wishlists for all to authenticated
using (profile_id = auth.uid()) with check (profile_id = auth.uid());

create policy "Users manage own wishlist items"
on public.wishlist_items for all to authenticated
using (
  exists (
    select 1 from public.wishlists
    where wishlists.id = wishlist_items.wishlist_id
      and wishlists.profile_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.wishlists
    where wishlists.id = wishlist_items.wishlist_id
      and wishlists.profile_id = auth.uid()
  )
);

create policy "Users manage own carts"
on public.carts for all to authenticated
using (profile_id = auth.uid()) with check (profile_id = auth.uid());

create policy "Users manage own cart items"
on public.cart_items for all to authenticated
using (
  exists (
    select 1 from public.carts
    where carts.id = cart_items.cart_id and carts.profile_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.carts
    where carts.id = cart_items.cart_id and carts.profile_id = auth.uid()
  )
);

create policy "Users read own orders"
on public.orders for select to authenticated using (profile_id = auth.uid());

create policy "Users read own order items"
on public.order_items for select to authenticated
using (
  exists (
    select 1 from public.orders
    where orders.id = order_items.order_id and orders.profile_id = auth.uid()
  )
);

create policy "Users read own consent records"
on public.consent_records for select to authenticated
using (profile_id = auth.uid());

insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

create policy "Product storage is publicly readable"
on storage.objects for select to anon, authenticated
using (bucket_id = 'product-images');

grant usage on schema public to anon, authenticated, service_role;

grant select on public.brands to anon, authenticated;
grant select on public.categories to anon, authenticated;
grant select on public.products to anon, authenticated;
grant select on public.product_images to anon, authenticated;
grant select on public.inventory to anon, authenticated;
grant select on public.prices to anon, authenticated;
grant select on public.offers to anon, authenticated;

grant select, update on public.profiles to authenticated;
grant select, insert, update, delete on public.addresses to authenticated;
grant select, insert, update, delete on public.wishlists to authenticated;
grant select, insert, update, delete on public.wishlist_items to authenticated;
grant select, insert, update, delete on public.carts to authenticated;
grant select, insert, update, delete on public.cart_items to authenticated;
grant select on public.orders to authenticated;
grant select on public.order_items to authenticated;
grant select on public.consent_records to authenticated;

grant all privileges on all tables in schema public to service_role;
