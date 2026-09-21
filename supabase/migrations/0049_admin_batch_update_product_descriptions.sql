create or replace function public.admin_batch_update_product_descriptions(
  p_changes jsonb
)
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_item jsonb;
  v_product public.products%rowtype;

  v_product_id uuid;
  v_code text;
  v_before text;
  v_after text;

  v_updated_count integer := 0;
begin
  /*
   * ============================================================
   * VALIDAZIONE PAYLOAD
   * ============================================================
   */

  if p_changes is null then
    raise exception 'DESCRIPTION_BATCH_REQUIRED';
  end if;

  if jsonb_typeof(p_changes) <> 'array' then
    raise exception 'DESCRIPTION_BATCH_INVALID';
  end if;

  if jsonb_array_length(p_changes) = 0 then
    raise exception 'DESCRIPTION_BATCH_EMPTY';
  end if;

  if jsonb_array_length(p_changes) > 5000 then
    raise exception 'DESCRIPTION_BATCH_TOO_LARGE';
  end if;

  /*
   * Non devono esistere ID duplicati.
   */
  if exists (
    select 1
    from (
      select
        item ->> 'id' as id,
        count(*) as occurrences
      from jsonb_array_elements(p_changes) as item
      group by item ->> 'id'
      having count(*) > 1
    ) as duplicates
  ) then
    raise exception 'DESCRIPTION_BATCH_DUPLICATE_PRODUCT_ID';
  end if;

  /*
   * Non devono esistere codici duplicati.
   */
  if exists (
    select 1
    from (
      select
        item ->> 'code' as code,
        count(*) as occurrences
      from jsonb_array_elements(p_changes) as item
      group by item ->> 'code'
      having count(*) > 1
    ) as duplicates
  ) then
    raise exception 'DESCRIPTION_BATCH_DUPLICATE_CODE';
  end if;

  /*
   * ============================================================
   * PREFLIGHT + UPDATE
   * ============================================================
   *
   * La funzione viene eseguita in una singola transazione.
   * Qualsiasi eccezione annulla tutte le modifiche della chiamata.
   */

  for v_item in
    select value
    from jsonb_array_elements(p_changes)
  loop
    begin
      v_product_id :=
        nullif(trim(v_item ->> 'id'), '')::uuid;
    exception
      when others then
        raise exception 'DESCRIPTION_BATCH_PRODUCT_ID_INVALID';
    end;

    v_code :=
      trim(coalesce(v_item ->> 'code', ''));

    v_before :=
      coalesce(v_item ->> 'before', '');

    v_after :=
      trim(coalesce(v_item ->> 'after', ''));

    if v_product_id is null then
      raise exception 'DESCRIPTION_BATCH_PRODUCT_ID_REQUIRED';
    end if;

    if v_code = '' then
      raise exception 'DESCRIPTION_BATCH_CODE_REQUIRED';
    end if;

    if v_after = '' then
      raise exception
        'DESCRIPTION_BATCH_DESCRIPTION_REQUIRED: %',
        v_code;
    end if;

    if length(v_after) > 10000 then
      raise exception
        'DESCRIPTION_BATCH_DESCRIPTION_TOO_LONG: %',
        v_code;
    end if;

    /*
     * Protezione esplicita della referenza archiviata.
     */
    if v_code = 'AB5137' then
      raise exception 'DESCRIPTION_BATCH_MAKAROV_FORBIDDEN';
    end if;

    select *
    into v_product
    from public.products
    where id = v_product_id
      and deleted_at is null
    for update;

    if not found then
      raise exception
        'DESCRIPTION_BATCH_PRODUCT_NOT_FOUND: %',
        v_code;
    end if;

    if v_product.code <> v_code then
      raise exception
        'DESCRIPTION_BATCH_CODE_MISMATCH: expected %, found %',
        v_code,
        v_product.code;
    end if;

    if v_product.status <> 'active' then
      raise exception
        'DESCRIPTION_BATCH_PRODUCT_NOT_ACTIVE: %',
        v_code;
    end if;

    /*
     * Optimistic concurrency:
     * il DB deve essere ancora nello stato fotografato
     * nel change-set.
     */
    if coalesce(v_product.description, '') <> v_before then
      raise exception
        'DESCRIPTION_BATCH_BEFORE_MISMATCH: %',
        v_code;
    end if;

    update public.products
    set
      description = v_after
    where id = v_product_id
      and deleted_at is null;

    if not found then
      raise exception
        'DESCRIPTION_BATCH_UPDATE_FAILED: %',
        v_code;
    end if;

    v_updated_count :=
      v_updated_count + 1;
  end loop;

  /*
   * Un solo refresh dopo l'intero batch.
   */
  refresh materialized view public.catalog_products_projection;

  return v_updated_count;
end;
$$;

revoke all on function public.admin_batch_update_product_descriptions(
  jsonb
) from public, anon, authenticated;

grant execute on function public.admin_batch_update_product_descriptions(
  jsonb
) to service_role;
