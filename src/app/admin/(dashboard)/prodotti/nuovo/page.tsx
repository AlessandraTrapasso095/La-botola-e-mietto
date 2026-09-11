import Link from "next/link";

import { AdminProductCreateForm } from "@/features/admin/admin-product-create-form";
import { getAdminProductEditOptions } from "@/server/admin/admin-products";

export default async function AdminNewProductPage() {
  const options = await getAdminProductEditOptions();

  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/admin/prodotti"
          className="inline-flex items-center gap-2 text-sm font-medium text-white/50 transition hover:text-white"
        >
          ← Torna ai prodotti
        </Link>

        <p className="mt-6 text-xs font-semibold tracking-[0.18em] text-orange-400 uppercase">
          Catalogo
        </p>

        <h1 className="mt-2 text-3xl font-semibold text-white">
          Nuovo prodotto
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-white/50">
          Inserisci i dati e, se disponibile, l’immagine del nuovo prodotto.
          Verrà creato come Bozza prima di poter essere pubblicato.
        </p>
      </div>

      <AdminProductCreateForm options={options} />
    </div>
  );
}
