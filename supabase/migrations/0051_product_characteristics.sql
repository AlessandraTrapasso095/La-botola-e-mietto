alter table public.products
add column if not exists characteristics text;

comment on column public.products.characteristics is
'Caratteristiche editoriali/importate del prodotto, modificabili da admin.';

create or replace function public.admin_batch_update_product_characteristics(
  p_changes jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_expected integer;
  v_found integer;
  v_updated integer;
begin
  if p_changes is null
    or jsonb_typeof(p_changes) <> 'array'
  then
    raise exception 'CHANGES_INVALID';
  end if;

  v_expected := jsonb_array_length(p_changes);

  if v_expected = 0 then
    return jsonb_build_object(
      'productsUpdated',
      0
    );
  end if;

  if v_expected > 5000 then
    raise exception 'CHANGES_LIMIT_EXCEEDED';
  end if;

  if (
    select count(*)
    from (
      select
        item ->> 'id' as id
      from jsonb_array_elements(p_changes) item
      group by item ->> 'id'
      having count(*) > 1
    ) duplicates
  ) > 0 then
    raise exception 'DUPLICATE_PRODUCT_ID';
  end if;

  if (
    select count(*)
    from (
      select
        item ->> 'code' as code
      from jsonb_array_elements(p_changes) item
      group by item ->> 'code'
      having count(*) > 1
    ) duplicates
  ) > 0 then
    raise exception 'DUPLICATE_PRODUCT_CODE';
  end if;

  select count(*)
  into v_found
  from jsonb_array_elements(p_changes) item
  join public.products product
    on product.id = (item ->> 'id')::uuid
   and product.code = item ->> 'code'
   and product.deleted_at is null;

  if v_found <> v_expected then
    raise exception
      'PRODUCT_MATCH_MISMATCH expected=% found=%',
      v_expected,
      v_found;
  end if;

  with payload as (
    select
      (item ->> 'id')::uuid as id,
      nullif(
        trim(item ->> 'characteristics'),
        ''
      ) as characteristics
    from jsonb_array_elements(p_changes) item
  )
  update public.products product
  set
    characteristics = payload.characteristics,
    updated_at = now()
  from payload
  where product.id = payload.id
    and product.deleted_at is null;

  get diagnostics v_updated = row_count;

  return jsonb_build_object(
    'productsUpdated',
    v_updated
  );
end;
$$;

revoke all on function
  public.admin_batch_update_product_characteristics(jsonb)
from public, anon, authenticated;

grant execute on function
  public.admin_batch_update_product_characteristics(jsonb)
to service_role;
