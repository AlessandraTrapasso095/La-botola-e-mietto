-- Storage security hardening:
-- il bucket product-images resta pubblico in lettura per lo storefront,
-- ma applica nativamente gli stessi vincoli già imposti dal backend.

update storage.buckets
set
  file_size_limit = 5 * 1024 * 1024,
  allowed_mime_types = array[
    'image/jpeg',
    'image/png',
    'image/webp'
  ]::text[]
where id = 'product-images';
