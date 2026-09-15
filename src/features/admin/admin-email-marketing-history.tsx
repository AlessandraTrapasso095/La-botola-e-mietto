import type { AdminMarketingCampaignHistoryItem } from "@/server/admin/admin-email-marketing";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("it-IT", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}

function statusLabel(status: AdminMarketingCampaignHistoryItem["status"]) {
  if (status === "completed") {
    return "Completata";
  }

  if (status === "completed_with_errors") {
    return "Completata con errori";
  }

  if (status === "failed") {
    return "Fallita";
  }

  if (status === "sending") {
    return "In invio";
  }

  return "Bozza";
}

function statusClass(status: AdminMarketingCampaignHistoryItem["status"]) {
  if (status === "completed") {
    return "border-emerald-400/20 bg-emerald-400/10 text-emerald-300";
  }

  if (status === "completed_with_errors") {
    return "border-amber-400/20 bg-amber-400/10 text-amber-300";
  }

  if (status === "failed") {
    return "border-red-400/20 bg-red-400/10 text-red-300";
  }

  return "border-white/10 bg-white/[0.04] text-white/50";
}

export function AdminEmailMarketingHistory({
  campaigns,
}: {
  campaigns: AdminMarketingCampaignHistoryItem[];
}) {
  return (
    <section className="rounded-lg border border-white/10 bg-[#171717]">
      <div className="border-b border-white/10 p-5 sm:p-6">
        <p className="text-xs font-semibold tracking-[0.16em] text-orange-400 uppercase">
          Storico
        </p>

        <h2 className="mt-2 text-xl font-semibold text-white">
          Campagne email
        </h2>

        <p className="mt-2 text-sm leading-6 text-white/45">
          Ultime campagne promozionali elaborate dal pannello amministrativo.
        </p>
      </div>

      {campaigns.length === 0 ? (
        <div className="p-6">
          <div className="rounded-md border border-dashed border-white/10 bg-[#111111] p-6 text-center">
            <p className="text-sm font-semibold text-white/70">
              Nessuna campagna presente
            </p>

            <p className="mt-2 text-sm text-white/35">
              Le campagne inviate compariranno qui con il relativo esito.
            </p>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-white/10 text-xs text-white/35">
              <tr>
                <th className="px-5 py-4 font-medium">Data</th>
                <th className="px-5 py-4 font-medium">Oggetto</th>
                <th className="px-5 py-4 font-medium">Pubblico</th>
                <th className="px-5 py-4 font-medium">Stato</th>
                <th className="px-5 py-4 text-right font-medium">Idonei</th>
                <th className="px-5 py-4 text-right font-medium">Inviate</th>
                <th className="px-5 py-4 text-right font-medium">Duplicate</th>
                <th className="px-5 py-4 text-right font-medium">Fallite</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/10">
              {campaigns.map((campaign) => (
                <tr key={campaign.id} className="align-top">
                  <td className="px-5 py-4 whitespace-nowrap text-white/45">
                    {formatDate(campaign.createdAt)}
                  </td>

                  <td className="max-w-sm px-5 py-4">
                    <p className="font-medium text-white/80">
                      {campaign.subject}
                    </p>

                    <p className="mt-1 truncate text-xs text-white/25">
                      {campaign.campaignId}
                    </p>
                  </td>

                  <td className="px-5 py-4 whitespace-nowrap text-white/55">
                    {campaign.audienceMode === "all"
                      ? "Tutti gli idonei"
                      : "Selezione manuale"}
                  </td>

                  <td className="px-5 py-4 whitespace-nowrap">
                    <span
                      className={[
                        "inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold",
                        statusClass(campaign.status),
                      ].join(" ")}
                    >
                      {statusLabel(campaign.status)}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-right text-white/60">
                    {campaign.eligibleCount}
                  </td>

                  <td className="px-5 py-4 text-right font-semibold text-emerald-300">
                    {campaign.sentCount}
                  </td>

                  <td className="px-5 py-4 text-right text-white/45">
                    {campaign.duplicateCount}
                  </td>

                  <td className="px-5 py-4 text-right text-red-300">
                    {campaign.failedCount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
