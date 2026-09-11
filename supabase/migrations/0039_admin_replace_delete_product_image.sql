create or replace function public.admin_replace_product_image(
  p_product_id uuid,
  p_storage_path text,
  p_alt_text text,
  p_width integer,
  p_height integer
)
returns table (
  image_id uuid,
  previous_storage_path text,
  previous_thumbnail_path text
)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_product_name text;
  v_current_image public.product_images%rowtype;
  v_image_id uuid;
begin
  select name
  into v_product_name
  from public.products
  where id = p_product_id
    and deleted_at is null;

  if v_product_name is null then
    raise exception 'PRODUCT_NOT_FOUND';
  end if;

  if p_storage_path is null
    or p_storage_path !~ (
      '^products/'
      || p_product_id::text
      || '/[0-9a-f-]+[.](jpg|png|webp)$'
    ) then
    raise exception 'PRODUCT_IMAGE_PATH_INVALID';
  end if;

  if p_width is null or p_width <= 0 then
    raise exception 'PRODUCT_IMAGE_WIDTH_INVALID';
  end if;

  if p_height is null or p_height <= 0 then
    raise exception 'PRODUCT_IMAGE_HEIGHT_INVALID';
  end if;

  if length(trim(coalesce(p_alt_text, ''))) > 500 then
    raise exception 'PRODUCT_IMAGE_ALT_TEXT_INVALID';
  end if;

  if not exists (
    select 1
    from storage.objects
    where bucket_id = 'product-images'
      and name = p_storage_path
  ) then
    raise exception 'PRODUCT_IMAGE_OBJECT_MISSING';
  end if;

  select product_images.*
  into v_current_image
  from public.product_images
  where product_id = p_product_id
    and is_primary
  for update;

  if v_current_image.id is null then
    insert into public.product_images (
      product_id,
      storage_path,
      thumbnail_path,
      alt_text,
      width,
      height,
      sort_order,
      is_primary
    )
    values (
      p_product_id,
      p_storage_path,
      null,
      coalesce(nullif(trim(p_alt_text), ''), 'Immagine di ' || v_product_name),
      p_width,
      p_height,
      0,
      true
    )
    returning id into v_image_id;
  else
    update public.product_images
    set
      storage_path = p_storage_path,
      thumbnail_path = null,
      alt_text = coalesce(
        nullif(trim(p_alt_text), ''),
        'Immagine di ' || v_product_name
      ),
      width = p_width,
      height = p_height,
      sort_order = 0,
      is_primary = true
    where id = v_current_image.id
    returning id into v_image_id;
  end if;

  refresh materialized view public.catalog_products_projection;

  return query
  select
    v_image_id,
    v_current_image.storage_path,
    v_current_image.thumbnail_path;
end;
$$;

create or replace function public.admin_delete_product_image(
  p_product_id uuid
)
returns table (
  image_id uuid,
  storage_path text,
  thumbnail_path text
)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_image_id uuid;
  v_storage_path text;
  v_thumbnail_path text;
begin
  if not exists (
    select 1
    from public.products
    where id = p_product_id
      and deleted_at is null
  ) then
    raise exception 'PRODUCT_NOT_FOUND';
  end if;

  select
    product_images.id,
    product_images.storage_path,
    product_images.thumbnail_path
  into
    v_image_id,
    v_storage_path,
    v_thumbnail_path
  from public.product_images
  where product_id = p_product_id
    and is_primary
  for update;

  if v_image_id is null then
    raise exception 'PRODUCT_IMAGE_NOT_FOUND';
  end if;

  delete from public.product_images
  where id = v_image_id;

  refresh materialized view public.catalog_products_projection;

  return query
  select
    v_image_id,
    v_storage_path,
    v_thumbnail_path;
end;
$$;

revoke all on function public.admin_replace_product_image(
  uuid,
  text,
  text,
  integer,
  integer
) from public, anon, authenticated;

grant execute on function public.admin_replace_product_image(
  uuid,
  text,
  text,
  integer,
  integer
) to service_role;

revoke all on function public.admin_delete_product_image(
  uuid
) from public, anon, authenticated;

grant execute on function public.admin_delete_product_image(
  uuid
) to service_role;
