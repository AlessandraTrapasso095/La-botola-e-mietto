import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default function AdminDashboardPage() {
  return (
    <div>
      <div className="mb-8">
        <p className="text-sm font-medium text-orange-400">Panoramica</p>

        <h1 className="mt-2 text-3xl font-semibold">Dashboard</h1>

        <p className="mt-2 text-sm text-white/50">
          Controlla ordini, pagamenti, clienti e richieste da un unico pannello.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-lg border border-white/10 bg-[#171717] p-5">
          <p className="text-sm text-white/50">Ordini da gestire</p>

          <p className="mt-3 text-3xl font-semibold">—</p>
        </div>

        <div className="rounded-lg border border-white/10 bg-[#171717] p-5">
          <p className="text-sm text-white/50">Pagamenti in attesa</p>

          <p className="mt-3 text-3xl font-semibold">—</p>
        </div>

        <div className="rounded-lg border border-white/10 bg-[#171717] p-5">
          <p className="text-sm text-white/50">Annullamenti richiesti</p>

          <p className="mt-3 text-3xl font-semibold">—</p>
        </div>

        <div className="rounded-lg border border-white/10 bg-[#171717] p-5">
          <p className="text-sm text-white/50">Clienti</p>

          <p className="mt-3 text-3xl font-semibold">—</p>
        </div>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <Link
          href="/admin/ordini"
          className="rounded-lg border border-white/10 bg-[#171717] p-6 transition hover:border-orange-400/60"
        >
          <p className="text-lg font-semibold">Gestisci ordini</p>

          <p className="mt-2 text-sm text-white/50">
            Consulta gli ordini, aggiorna gli stati e controlla i pagamenti.
          </p>
        </Link>

        <Link
          href="/admin/richieste-annullamento"
          className="rounded-lg border border-white/10 bg-[#171717] p-6 transition hover:border-orange-400/60"
        >
          <p className="text-lg font-semibold">Richieste annullamento</p>

          <p className="mt-2 text-sm text-white/50">
            Approva o rifiuta le richieste inviate dai clienti.
          </p>
        </Link>

        <Link
          href="/admin/prodotti"
          className="rounded-lg border border-white/10 bg-[#171717] p-6 transition hover:border-orange-400/60"
        >
          <p className="text-lg font-semibold">Catalogo</p>

          <p className="mt-2 text-sm text-white/50">
            Gestisci prodotti, prezzi, stock e disponibilità.
          </p>
        </Link>
      </div>
    </div>
  );
}
