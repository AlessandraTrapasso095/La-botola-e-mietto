import type { Metadata } from "next";

import { AdminEmailMarketingHistory } from "@/features/admin/admin-email-marketing-history";
import { AdminEmailMarketingWorkspace } from "@/features/admin/admin-email-marketing-workspace";
import {
  getAdminMarketingCampaignHistory,
  getAdminMarketingRecipients,
} from "@/server/admin/admin-email-marketing";

export const metadata: Metadata = {
  title: "Email marketing",
};

export default async function AdminEmailMarketingPage() {
  const [result, campaigns] = await Promise.all([
    getAdminMarketingRecipients(),
    getAdminMarketingCampaignHistory(),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-semibold tracking-[0.18em] text-orange-400 uppercase">
          Comunicazioni
        </p>

        <h1 className="mt-2 text-3xl font-semibold text-white">
          Email marketing
        </h1>

        <p className="mt-2 max-w-3xl text-sm leading-6 text-white/50">
          Crea comunicazioni promozionali e scegli se inviarle a tutti i clienti
          che hanno fornito il consenso marketing oppure soltanto a utenti
          selezionati.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard label="Clienti totali" value={result.totalCustomers} />

        <SummaryCard
          label="Idonei al marketing"
          value={result.totalEligible}
          emphasis
        />

        <SummaryCard label="Consenso richiesto" value="Sì" />

        <SummaryCard label="Invio" value="Resend" />
      </div>

      <AdminEmailMarketingWorkspace recipients={result.recipients} />

      <AdminEmailMarketingHistory campaigns={campaigns} />
    </div>
  );
}

function SummaryCard({
  label,
  value,
  emphasis = false,
}: {
  label: string;
  value: number | string;
  emphasis?: boolean;
}) {
  return (
    <div className="rounded-lg border border-white/10 bg-[#171717] p-5">
      <p className="text-xs font-medium text-white/40">{label}</p>

      <p
        className={[
          "mt-2 text-2xl font-semibold",
          emphasis ? "text-orange-300" : "text-white",
        ].join(" ")}
      >
        {typeof value === "number" ? value.toLocaleString("it-IT") : value}
      </p>
    </div>
  );
}
