export default function AccountAddressesLoading() {
  return (
    <div className="min-h-64 animate-pulse" role="status">
      <span className="sr-only">Caricamento indirizzi…</span>
      <div className="bg-surface h-8 w-40" />
      <div className="mt-10 grid gap-5 md:grid-cols-2">
        <div className="bg-surface h-56" />
        <div className="bg-surface h-56" />
      </div>
    </div>
  );
}
