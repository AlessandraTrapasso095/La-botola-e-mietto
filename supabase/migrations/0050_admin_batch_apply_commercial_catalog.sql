create or replace function public.admin_batch_apply_commercial_catalog(
  p_brand_plan jsonb,
  p_category_plan jsonb,
  p_changes jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_item jsonb;
  v_product public.products%rowtype;
  v_brand public.brands%rowtype;
  v_category public.categories%rowtype;

  v_id uuid;
  v_existing_id uuid;

  v_code text;
  v_action text;
  v_target_name text;
  v_target_slug text;
  v_target_key text;

  v_brand_ids jsonb := '{}'::jsonb;
  v_category_ids jsonb := '{}'::jsonb;

  v_brand_created integer := 0;
  v_brand_renamed integer := 0;
  v_brand_reused integer := 0;

  v_category_created integer := 0;
  v_category_renamed integer := 0;
  v_category_reused integer := 0;

  v_updated_count integer := 0;

  v_product_id uuid;
  v_target_brand_id uuid;
  v_target_category_id uuid;

  v_target_product_name text;
  v_target_product_slug text;

  v_before_name text;
  v_before_slug text;
  v_before_brand_id uuid;
  v_before_category_id uuid;
  v_before_subcategory_id uuid;
  v_before_capacity_ml integer;
  v_before_capacity_label text;

  v_target_capacity_ml integer;
  v_target_capacity_label text;
  v_preserve_capacity boolean;
begin
  /*
   * ============================================================
   * VALIDAZIONE PAYLOAD
   * ============================================================
   */

  if p_brand_plan is null
    or jsonb_typeof(p_brand_plan) <> 'array'
  then
    raise exception 'COMMERCIAL_BATCH_BRAND_PLAN_INVALID';
  end if;

  if p_category_plan is null
    or jsonb_typeof(p_category_plan) <> 'array'
  then
    raise exception 'COMMERCIAL_BATCH_CATEGORY_PLAN_INVALID';
  end if;

  if p_changes is null
    or jsonb_typeof(p_changes) <> 'array'
  then
    raise exception 'COMMERCIAL_BATCH_CHANGES_INVALID';
  end if;

  if jsonb_array_length(p_changes) = 0 then
    raise exception 'COMMERCIAL_BATCH_CHANGES_EMPTY';
  end if;

  if jsonb_array_length(p_changes) > 5000 then
    raise exception 'COMMERCIAL_BATCH_TOO_LARGE';
  end if;

  /*
   * Il catalogo definitivo deve contenere esattamente
   * le otto macrocategorie concordate.
   */
  if jsonb_array_length(p_category_plan) <> 8 then
    raise exception 'COMMERCIAL_BATCH_CATEGORY_COUNT_INVALID';
  end if;

  /*
   * Nessun prodotto duplicato per ID.
   */
  if exists (
    select 1
    from (
      select
        item ->> 'productId' as product_id,
        count(*) as occurrences
      from jsonb_array_elements(p_changes) as item
      group by item ->> 'productId'
      having count(*) > 1
    ) as duplicates
  ) then
    raise exception 'COMMERCIAL_BATCH_DUPLICATE_PRODUCT_ID';
  end if;

  /*
   * Nessun prodotto duplicato per codice.
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
    raise exception 'COMMERCIAL_BATCH_DUPLICATE_CODE';
  end if;

  /*
   * Nessun nome target brand duplicato case-insensitive.
   */
  if exists (
    select 1
    from (
      select
        lower(trim(item ->> 'targetName')) as target_name,
        count(*) as occurrences
      from jsonb_array_elements(p_brand_plan) as item
      group by lower(trim(item ->> 'targetName'))
      having count(*) > 1
    ) as duplicates
  ) then
    raise exception 'COMMERCIAL_BATCH_DUPLICATE_BRAND_NAME';
  end if;

  /*
   * Nessuno slug target brand duplicato.
   */
  if exists (
    select 1
    from (
      select
        trim(item ->> 'targetSlug') as target_slug,
        count(*) as occurrences
      from jsonb_array_elements(p_brand_plan) as item
      group by trim(item ->> 'targetSlug')
      having count(*) > 1
    ) as duplicates
  ) then
    raise exception 'COMMERCIAL_BATCH_DUPLICATE_BRAND_SLUG';
  end if;

  /*
   * Nessun nome target categoria duplicato case-insensitive.
   */
  if exists (
    select 1
    from (
      select
        lower(trim(item ->> 'targetName')) as target_name,
        count(*) as occurrences
      from jsonb_array_elements(p_category_plan) as item
      group by lower(trim(item ->> 'targetName'))
      having count(*) > 1
    ) as duplicates
  ) then
    raise exception 'COMMERCIAL_BATCH_DUPLICATE_CATEGORY_NAME';
  end if;

  /*
   * Nessuno slug target categoria duplicato.
   */
  if exists (
    select 1
    from (
      select
        trim(item ->> 'targetSlug') as target_slug,
        count(*) as occurrences
      from jsonb_array_elements(p_category_plan) as item
      group by trim(item ->> 'targetSlug')
      having count(*) > 1
    ) as duplicates
  ) then
    raise exception 'COMMERCIAL_BATCH_DUPLICATE_CATEGORY_SLUG';
  end if;

  /*
   * ============================================================
   * PREFLIGHT BRAND PLAN
   * ============================================================
   */

  for v_item in
    select value
    from jsonb_array_elements(p_brand_plan)
  loop
    v_action :=
      trim(coalesce(v_item ->> 'action', ''));

    v_target_name :=
      trim(coalesce(v_item ->> 'targetName', ''));

    v_target_slug :=
      trim(coalesce(v_item ->> 'targetSlug', ''));

    if v_target_name = '' then
      raise exception 'COMMERCIAL_BATCH_BRAND_NAME_REQUIRED';
    end if;

    if v_target_slug = '' then
      raise exception
        'COMMERCIAL_BATCH_BRAND_SLUG_REQUIRED: %',
        v_target_name;
    end if;

    if v_action not in (
      'reuse',
      'rename_existing',
      'create'
    ) then
      raise exception
        'COMMERCIAL_BATCH_BRAND_ACTION_INVALID: %',
        v_target_name;
    end if;

    if v_action = 'create' then
      if nullif(trim(v_item ->> 'existingId'), '') is not null then
        raise exception
          'COMMERCIAL_BATCH_BRAND_CREATE_WITH_ID: %',
          v_target_name;
      end if;

      if exists (
        select 1
        from public.brands
        where deleted_at is null
          and (
            lower(name) = lower(v_target_name)
            or slug = v_target_slug
          )
      ) then
        raise exception
          'COMMERCIAL_BATCH_BRAND_CREATE_COLLISION: %',
          v_target_name;
      end if;
    else
      begin
        v_existing_id :=
          nullif(
            trim(v_item ->> 'existingId'),
            ''
          )::uuid;
      exception
        when others then
          raise exception
            'COMMERCIAL_BATCH_BRAND_ID_INVALID: %',
            v_target_name;
      end;

      if v_existing_id is null then
        raise exception
          'COMMERCIAL_BATCH_BRAND_ID_REQUIRED: %',
          v_target_name;
      end if;

      select *
      into v_brand
      from public.brands
      where id = v_existing_id
        and deleted_at is null
      for update;

      if not found then
        raise exception
          'COMMERCIAL_BATCH_BRAND_NOT_FOUND: %',
          v_target_name;
      end if;

      if v_action = 'reuse' then
        if lower(v_brand.name) <> lower(v_target_name) then
          raise exception
            'COMMERCIAL_BATCH_BRAND_REUSE_NAME_MISMATCH: %',
            v_target_name;
        end if;

        if v_brand.slug <> v_target_slug then
          raise exception
            'COMMERCIAL_BATCH_BRAND_REUSE_SLUG_MISMATCH: %',
            v_target_name;
        end if;
      else
        if trim(coalesce(v_item ->> 'beforeName', '')) = '' then
          raise exception
            'COMMERCIAL_BATCH_BRAND_BEFORE_NAME_REQUIRED: %',
            v_target_name;
        end if;

        if v_brand.name <> trim(v_item ->> 'beforeName') then
          raise exception
            'COMMERCIAL_BATCH_BRAND_BEFORE_NAME_MISMATCH: %',
            v_target_name;
        end if;

        if trim(coalesce(v_item ->> 'beforeSlug', '')) <> ''
          and v_brand.slug <> trim(v_item ->> 'beforeSlug')
        then
          raise exception
            'COMMERCIAL_BATCH_BRAND_BEFORE_SLUG_MISMATCH: %',
            v_target_name;
        end if;

        if exists (
          select 1
          from public.brands
          where deleted_at is null
            and id <> v_existing_id
            and (
              lower(name) = lower(v_target_name)
              or slug = v_target_slug
            )
        ) then
          raise exception
            'COMMERCIAL_BATCH_BRAND_RENAME_COLLISION: %',
            v_target_name;
        end if;
      end if;
    end if;
  end loop;

  /*
   * ============================================================
   * PREFLIGHT CATEGORY PLAN
   * ============================================================
   */

  for v_item in
    select value
    from jsonb_array_elements(p_category_plan)
  loop
    v_action :=
      trim(coalesce(v_item ->> 'action', ''));

    v_target_name :=
      trim(coalesce(v_item ->> 'targetName', ''));

    v_target_slug :=
      trim(coalesce(v_item ->> 'targetSlug', ''));

    if v_target_name = '' then
      raise exception 'COMMERCIAL_BATCH_CATEGORY_NAME_REQUIRED';
    end if;

    if v_target_slug = '' then
      raise exception
        'COMMERCIAL_BATCH_CATEGORY_SLUG_REQUIRED: %',
        v_target_name;
    end if;

    if v_action not in (
      'reuse',
      'rename_existing',
      'create'
    ) then
      raise exception
        'COMMERCIAL_BATCH_CATEGORY_ACTION_INVALID: %',
        v_target_name;
    end if;

    if v_action = 'create' then
      if nullif(trim(v_item ->> 'existingId'), '') is not null then
        raise exception
          'COMMERCIAL_BATCH_CATEGORY_CREATE_WITH_ID: %',
          v_target_name;
      end if;

      if exists (
        select 1
        from public.categories
        where deleted_at is null
          and (
            lower(name) = lower(v_target_name)
            or slug = v_target_slug
          )
      ) then
        raise exception
          'COMMERCIAL_BATCH_CATEGORY_CREATE_COLLISION: %',
          v_target_name;
      end if;
    else
      begin
        v_existing_id :=
          nullif(
            trim(v_item ->> 'existingId'),
            ''
          )::uuid;
      exception
        when others then
          raise exception
            'COMMERCIAL_BATCH_CATEGORY_ID_INVALID: %',
            v_target_name;
      end;

      if v_existing_id is null then
        raise exception
          'COMMERCIAL_BATCH_CATEGORY_ID_REQUIRED: %',
          v_target_name;
      end if;

      select *
      into v_category
      from public.categories
      where id = v_existing_id
        and deleted_at is null
        and parent_id is null
      for update;

      if not found then
        raise exception
          'COMMERCIAL_BATCH_ROOT_CATEGORY_NOT_FOUND: %',
          v_target_name;
      end if;

      if v_action = 'reuse' then
        if lower(v_category.name) <> lower(v_target_name) then
          raise exception
            'COMMERCIAL_BATCH_CATEGORY_REUSE_NAME_MISMATCH: %',
            v_target_name;
        end if;

        if v_category.slug <> v_target_slug then
          raise exception
            'COMMERCIAL_BATCH_CATEGORY_REUSE_SLUG_MISMATCH: %',
            v_target_name;
        end if;
      else
        if trim(coalesce(v_item ->> 'beforeName', '')) = '' then
          raise exception
            'COMMERCIAL_BATCH_CATEGORY_BEFORE_NAME_REQUIRED: %',
            v_target_name;
        end if;

        if v_category.name <> trim(v_item ->> 'beforeName') then
          raise exception
            'COMMERCIAL_BATCH_CATEGORY_BEFORE_NAME_MISMATCH: %',
            v_target_name;
        end if;

        if trim(coalesce(v_item ->> 'beforeSlug', '')) <> ''
          and v_category.slug <> trim(v_item ->> 'beforeSlug')
        then
          raise exception
            'COMMERCIAL_BATCH_CATEGORY_BEFORE_SLUG_MISMATCH: %',
            v_target_name;
        end if;

        if exists (
          select 1
          from public.categories
          where deleted_at is null
            and id <> v_existing_id
            and (
              lower(name) = lower(v_target_name)
              or slug = v_target_slug
            )
        ) then
          raise exception
            'COMMERCIAL_BATCH_CATEGORY_RENAME_COLLISION: %',
            v_target_name;
        end if;
      end if;
    end if;
  end loop;

  /*
   * ============================================================
   * PREFLIGHT PRODOTTI
   * ============================================================
   *
   * Nessuna scrittura è ancora avvenuta.
   */

  for v_item in
    select value
    from jsonb_array_elements(p_changes)
  loop
    begin
      v_product_id :=
        nullif(
          trim(v_item ->> 'productId'),
          ''
        )::uuid;
    exception
      when others then
        raise exception 'COMMERCIAL_BATCH_PRODUCT_ID_INVALID';
    end;

    v_code :=
      trim(coalesce(v_item ->> 'code', ''));

    if v_product_id is null then
      raise exception 'COMMERCIAL_BATCH_PRODUCT_ID_REQUIRED';
    end if;

    if v_code = '' then
      raise exception 'COMMERCIAL_BATCH_CODE_REQUIRED';
    end if;

    /*
     * Protezione assoluta Makarov.
     */
    if v_code = 'AB5137' then
      raise exception 'COMMERCIAL_BATCH_MAKAROV_FORBIDDEN';
    end if;

    select *
    into v_product
    from public.products
    where id = v_product_id
      and deleted_at is null
    for update;

    if not found then
      raise exception
        'COMMERCIAL_BATCH_PRODUCT_NOT_FOUND: %',
        v_code;
    end if;

    if v_product.code <> v_code then
      raise exception
        'COMMERCIAL_BATCH_CODE_MISMATCH: expected %, found %',
        v_code,
        v_product.code;
    end if;

    if v_product.status <> 'active' then
      raise exception
        'COMMERCIAL_BATCH_PRODUCT_NOT_ACTIVE: %',
        v_code;
    end if;

    /*
     * Snapshot "before" obbligatorio.
     */
    v_before_name :=
      coalesce(v_item #>> '{before,name}', '');

    v_before_slug :=
      coalesce(v_item #>> '{before,slug}', '');

    begin
      v_before_brand_id :=
        nullif(
          trim(
            coalesce(
              v_item #>> '{before,brandId}',
              ''
            )
          ),
          ''
        )::uuid;
    exception
      when others then
        raise exception
          'COMMERCIAL_BATCH_BEFORE_BRAND_ID_INVALID: %',
          v_code;
    end;

    begin
      v_before_category_id :=
        nullif(
          trim(
            coalesce(
              v_item #>> '{before,categoryId}',
              ''
            )
          ),
          ''
        )::uuid;
    exception
      when others then
        raise exception
          'COMMERCIAL_BATCH_BEFORE_CATEGORY_ID_INVALID: %',
          v_code;
    end;

    begin
      v_before_subcategory_id :=
        nullif(
          trim(
            coalesce(
              v_item #>> '{before,subcategoryId}',
              ''
            )
          ),
          ''
        )::uuid;
    exception
      when others then
        raise exception
          'COMMERCIAL_BATCH_BEFORE_SUBCATEGORY_ID_INVALID: %',
          v_code;
    end;

    begin
      v_before_capacity_ml :=
        nullif(
          trim(
            coalesce(
              v_item #>> '{before,capacityMl}',
              ''
            )
          ),
          ''
        )::integer;
    exception
      when others then
        raise exception
          'COMMERCIAL_BATCH_BEFORE_CAPACITY_INVALID: %',
          v_code;
    end;

    v_before_capacity_label :=
      coalesce(
        v_item #>> '{before,capacityLabel}',
        ''
      );

    if v_product.name <> v_before_name then
      raise exception
        'COMMERCIAL_BATCH_BEFORE_NAME_MISMATCH: %',
        v_code;
    end if;

    if v_product.slug <> v_before_slug then
      raise exception
        'COMMERCIAL_BATCH_BEFORE_SLUG_MISMATCH: %',
        v_code;
    end if;

    if v_product.brand_id is distinct from v_before_brand_id then
      raise exception
        'COMMERCIAL_BATCH_BEFORE_BRAND_MISMATCH: %',
        v_code;
    end if;

    if v_product.category_id is distinct from v_before_category_id then
      raise exception
        'COMMERCIAL_BATCH_BEFORE_CATEGORY_MISMATCH: %',
        v_code;
    end if;

    if v_product.subcategory_id is distinct from v_before_subcategory_id then
      raise exception
        'COMMERCIAL_BATCH_BEFORE_SUBCATEGORY_MISMATCH: %',
        v_code;
    end if;

    if v_product.capacity_ml is distinct from v_before_capacity_ml then
      raise exception
        'COMMERCIAL_BATCH_BEFORE_CAPACITY_ML_MISMATCH: %',
        v_code;
    end if;

    if v_product.capacity_label <> v_before_capacity_label then
      raise exception
        'COMMERCIAL_BATCH_BEFORE_CAPACITY_LABEL_MISMATCH: %',
        v_code;
    end if;

    /*
     * Target prodotto.
     */
    v_target_product_name :=
      trim(
        coalesce(
          v_item #>> '{target,name}',
          ''
        )
      );

    v_target_product_slug :=
      trim(
        coalesce(
          v_item #>> '{target,slug}',
          ''
        )
      );

    if v_target_product_name = '' then
      raise exception
        'COMMERCIAL_BATCH_TARGET_NAME_REQUIRED: %',
        v_code;
    end if;

    if v_target_product_slug = '' then
      raise exception
        'COMMERCIAL_BATCH_TARGET_SLUG_REQUIRED: %',
        v_code;
    end if;

    if exists (
      select 1
      from public.products
      where deleted_at is null
        and id <> v_product_id
        and slug = v_target_product_slug
    ) then
      raise exception
        'COMMERCIAL_BATCH_TARGET_SLUG_COLLISION: %',
        v_code;
    end if;

    v_target_key :=
      nullif(
        trim(
          coalesce(
            v_item #>> '{target,brandTargetKey}',
            ''
          )
        ),
        ''
      );

    if v_target_key is null
      and nullif(
        trim(
          coalesce(
            v_item #>> '{target,brand}',
            ''
          )
        ),
        ''
      ) is not null
    then
      raise exception
        'COMMERCIAL_BATCH_BRAND_TARGET_KEY_REQUIRED: %',
        v_code;
    end if;

    v_target_key :=
      trim(
        coalesce(
          v_item #>> '{target,categoryTargetKey}',
          ''
        )
      );

    if v_target_key = '' then
      raise exception
        'COMMERCIAL_BATCH_CATEGORY_TARGET_KEY_REQUIRED: %',
        v_code;
    end if;

    if (
      v_item #>> '{target,subcategoryId}'
    ) is not null then
      raise exception
        'COMMERCIAL_BATCH_SUBCATEGORY_MUST_BE_NULL: %',
        v_code;
    end if;

    v_preserve_capacity :=
      coalesce(
        (
          v_item #>>
          '{target,capacity,preserve}'
        )::boolean,
        false
      );

    /*
     * AB6368 deve SEMPRE preservare capacità.
     */
    if v_code = 'AB6368'
      and not v_preserve_capacity
    then
      raise exception 'COMMERCIAL_BATCH_AB6368_CAPACITY_FORBIDDEN';
    end if;

    if not v_preserve_capacity then
      begin
        v_target_capacity_ml :=
          nullif(
            trim(
              coalesce(
                v_item #>> '{target,capacity,ml}',
                ''
              )
            ),
            ''
          )::integer;
      exception
        when others then
          raise exception
            'COMMERCIAL_BATCH_TARGET_CAPACITY_INVALID: %',
            v_code;
      end;

      v_target_capacity_label :=
        trim(
          coalesce(
            v_item #>> '{target,capacity,label}',
            ''
          )
        );

      if v_target_capacity_ml is not null
        and v_target_capacity_ml <= 0
      then
        raise exception
          'COMMERCIAL_BATCH_TARGET_CAPACITY_INVALID: %',
          v_code;
      end if;

      if v_target_capacity_label = '' then
        raise exception
          'COMMERCIAL_BATCH_TARGET_CAPACITY_LABEL_REQUIRED: %',
          v_code;
      end if;
    end if;
  end loop;

  /*
   * ============================================================
   * APPLICAZIONE BRAND PLAN
   * ============================================================
   */

  for v_item in
    select value
    from jsonb_array_elements(p_brand_plan)
  loop
    v_action :=
      trim(v_item ->> 'action');

    v_target_name :=
      trim(v_item ->> 'targetName');

    v_target_slug :=
      trim(v_item ->> 'targetSlug');

    if v_action = 'create' then
      insert into public.brands (
        name,
        slug,
        country,
        description,
        status
      )
      values (
        v_target_name,
        v_target_slug,
        null,
        null,
        'active'
      )
      returning id
      into v_id;

      v_target_key :=
        'create:' || v_target_name;

      v_brand_created :=
        v_brand_created + 1;
    else
      v_existing_id :=
        trim(
          v_item ->> 'existingId'
        )::uuid;

      if v_action = 'rename_existing' then
        update public.brands
        set
          name = v_target_name,
          slug = v_target_slug,
          updated_at = now()
        where id = v_existing_id
          and deleted_at is null
        returning id
        into v_id;

        if v_id is null then
          raise exception
            'COMMERCIAL_BATCH_BRAND_UPDATE_FAILED: %',
            v_target_name;
        end if;

        v_brand_renamed :=
          v_brand_renamed + 1;
      else
        v_id :=
          v_existing_id;

        v_brand_reused :=
          v_brand_reused + 1;
      end if;

      v_target_key :=
        'existing:' ||
        v_existing_id::text;
    end if;

    v_brand_ids :=
      jsonb_set(
        v_brand_ids,
        array[v_target_key],
        to_jsonb(v_id::text),
        true
      );
  end loop;

  /*
   * ============================================================
   * APPLICAZIONE CATEGORY PLAN
   * ============================================================
   */

  for v_item in
    select value
    from jsonb_array_elements(p_category_plan)
  loop
    v_action :=
      trim(v_item ->> 'action');

    v_target_name :=
      trim(v_item ->> 'targetName');

    v_target_slug :=
      trim(v_item ->> 'targetSlug');

    if v_action = 'create' then
      insert into public.categories (
        parent_id,
        name,
        slug,
        description,
        sort_order,
        status
      )
      values (
        null,
        v_target_name,
        v_target_slug,
        null,
        coalesce(
          (v_item ->> 'sortOrder')::integer,
          0
        ),
        'active'
      )
      returning id
      into v_id;

      v_target_key :=
        'create:' || v_target_name;

      v_category_created :=
        v_category_created + 1;
    else
      v_existing_id :=
        trim(
          v_item ->> 'existingId'
        )::uuid;

      if v_action = 'rename_existing' then
        update public.categories
        set
          name = v_target_name,
          slug = v_target_slug,
          sort_order = coalesce(
            (v_item ->> 'sortOrder')::integer,
            sort_order
          ),
          updated_at = now()
        where id = v_existing_id
          and deleted_at is null
          and parent_id is null
        returning id
        into v_id;

        if v_id is null then
          raise exception
            'COMMERCIAL_BATCH_CATEGORY_UPDATE_FAILED: %',
            v_target_name;
        end if;

        v_category_renamed :=
          v_category_renamed + 1;
      else
        v_id :=
          v_existing_id;

        v_category_reused :=
          v_category_reused + 1;
      end if;

      v_target_key :=
        'existing:' ||
        v_existing_id::text;
    end if;

    v_category_ids :=
      jsonb_set(
        v_category_ids,
        array[v_target_key],
        to_jsonb(v_id::text),
        true
      );
  end loop;

  /*
   * ============================================================
   * UPDATE PRODOTTI
   * ============================================================
   */

  for v_item in
    select value
    from jsonb_array_elements(p_changes)
  loop
    v_product_id :=
      trim(
        v_item ->> 'productId'
      )::uuid;

    v_code :=
      trim(v_item ->> 'code');

    v_target_product_name :=
      trim(
        v_item #>> '{target,name}'
      );

    v_target_product_slug :=
      trim(
        v_item #>> '{target,slug}'
      );

    v_target_key :=
      nullif(
        trim(
          coalesce(
            v_item #>> '{target,brandTargetKey}',
            ''
          )
        ),
        ''
      );

    if v_target_key is null then
      v_target_brand_id := null;
    else
      begin
        v_target_brand_id :=
          nullif(
            v_brand_ids ->> v_target_key,
            ''
          )::uuid;
      exception
        when others then
          raise exception
            'COMMERCIAL_BATCH_RESOLVED_BRAND_ID_INVALID: %',
            v_code;
      end;

      if v_target_brand_id is null then
        raise exception
          'COMMERCIAL_BATCH_BRAND_TARGET_UNRESOLVED: %',
          v_code;
      end if;
    end if;

    v_target_key :=
      trim(
        v_item #>>
        '{target,categoryTargetKey}'
      );

    begin
      v_target_category_id :=
        nullif(
          v_category_ids ->> v_target_key,
          ''
        )::uuid;
    exception
      when others then
        raise exception
          'COMMERCIAL_BATCH_RESOLVED_CATEGORY_ID_INVALID: %',
          v_code;
    end;

    if v_target_category_id is null then
      raise exception
        'COMMERCIAL_BATCH_CATEGORY_TARGET_UNRESOLVED: %',
        v_code;
    end if;

    v_preserve_capacity :=
      coalesce(
        (
          v_item #>>
          '{target,capacity,preserve}'
        )::boolean,
        false
      );

    if v_preserve_capacity then
      select
        capacity_ml,
        capacity_label
      into
        v_target_capacity_ml,
        v_target_capacity_label
      from public.products
      where id = v_product_id
        and deleted_at is null;
    else
      v_target_capacity_ml :=
        nullif(
          trim(
            coalesce(
              v_item #>>
              '{target,capacity,ml}',
              ''
            )
          ),
          ''
        )::integer;

      v_target_capacity_label :=
        trim(
          v_item #>>
          '{target,capacity,label}'
        );
    end if;

    update public.products
    set
      name = v_target_product_name,
      slug = v_target_product_slug,
      brand_id = v_target_brand_id,
      category_id = v_target_category_id,
      subcategory_id = null,
      capacity_ml = v_target_capacity_ml,
      capacity_label = v_target_capacity_label,
      updated_at = now()
    where id = v_product_id
      and code = v_code
      and status = 'active'
      and deleted_at is null;

    if not found then
      raise exception
        'COMMERCIAL_BATCH_PRODUCT_UPDATE_FAILED: %',
        v_code;
    end if;

    v_updated_count :=
      v_updated_count + 1;
  end loop;

  /*
   * Un solo refresh al termine dell'intero batch.
   */
  refresh materialized view public.catalog_products_projection;

  return jsonb_build_object(
    'productsUpdated',
    v_updated_count,
    'brands',
    jsonb_build_object(
      'created',
      v_brand_created,
      'renamed',
      v_brand_renamed,
      'reused',
      v_brand_reused
    ),
    'categories',
    jsonb_build_object(
      'created',
      v_category_created,
      'renamed',
      v_category_renamed,
      'reused',
      v_category_reused
    )
  );
end;
$$;

revoke all on function public.admin_batch_apply_commercial_catalog(
  jsonb,
  jsonb,
  jsonb
) from public, anon, authenticated;

grant execute on function public.admin_batch_apply_commercial_catalog(
  jsonb,
  jsonb,
  jsonb
) to service_role;
