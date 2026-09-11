import { AdminTaxonomyManager } from "@/features/admin/admin-taxonomy-manager";
import { getAdminTaxonomyData } from "@/server/admin/admin-products";

export default async function AdminCatalogPage() {
  const data = await getAdminTaxonomyData();

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-semibold tracking-[0.18em] text-orange-400 uppercase">
          Catalogo
        </p>

        <h1 className="mt-2 text-3xl font-semibold text-white">
          Marchi e categorie
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-white/50">
          Gestisci marchi, categorie e sottocategorie utilizzate dai prodotti.
        </p>
      </div>

      <AdminTaxonomyManager data={data} />
    </div>
  );
}
