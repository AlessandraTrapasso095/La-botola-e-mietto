import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import type {
  CatalogImportIssue,
  CatalogImportResult,
  CatalogImportSummary,
} from "@/server/catalog-import/types";

function csvCell(value: unknown) {
  const text = String(value ?? "");
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

function createCsv(headers: readonly string[], rows: readonly unknown[][]) {
  return [headers, ...rows]
    .map((row) => row.map(csvCell).join(","))
    .join("\n")
    .concat("\n");
}

function createResultsCsv(results: readonly CatalogImportResult[]) {
  return createCsv(
    [
      "product_code",
      "product_name",
      "product_action",
      "inventory_action",
      "price_action",
      "image_action",
      "offer_action",
      "details",
    ],
    results.map((result) => [
      result.code,
      result.productName,
      result.action,
      result.inventoryAction,
      result.priceAction,
      result.imageAction,
      result.offerAction,
      result.details,
    ]),
  );
}

function createIssuesCsv(issues: readonly CatalogImportIssue[]) {
  return createCsv(
    ["row_number", "product_code", "kind", "message"],
    issues.map((issue) => [
      issue.rowNumber,
      issue.code,
      issue.kind,
      issue.message,
    ]),
  );
}

function formatStats(stats: CatalogImportSummary["products"]) {
  return `created ${stats.created}, updated ${stats.updated}, unchanged ${stats.unchanged}, skipped ${stats.skipped}`;
}

async function readHistory(historyPath: string) {
  try {
    return JSON.parse(
      await readFile(historyPath, "utf8"),
    ) as CatalogImportSummary[];
  } catch {
    return [];
  }
}

function createSummaryMarkdown(
  summary: CatalogImportSummary,
  history: readonly CatalogImportSummary[],
) {
  return `# Importazione catalogo locale

## Esecuzione corrente

- Run: \`${summary.runId}\`
- Avvio: ${summary.startedAt}
- Completamento: ${summary.completedAt}
- Righe Excel lette: **${summary.rowsRead}**
- Codici prodotto unici validi: **${summary.uniqueProductCodes}**
- Prodotti: ${formatStats(summary.products)}
- Marchi: ${formatStats(summary.brands)}
- Categorie: ${formatStats(summary.categories)}
- Sottocategorie: ${formatStats(summary.subcategories)}
- Prezzi: ${formatStats(summary.prices)}
- Inventari: ${formatStats(summary.inventories)}
- Immagini: ${formatStats(summary.images)}
- Offerte importate: **${summary.offersImported}**
- Nuovi arrivi importati: **${summary.newArrivalsImported}**
- Immagini mancanti o escluse: **${summary.missingImages}**
- Righe non valide: **${summary.invalidRows}**
- Conflitti: **${summary.conflicts}**

## Conteggi database

${Object.entries(summary.databaseCounts)
  .map(([table, count]) => `- ${table}: **${count}**`)
  .join("\n")}

## Casi obbligatori

- AB1293: inventario non importato; quantità 41 e 65 da confermare con la cliente.
- AB6837: nessuna immagine prodotto importata; richiesto \`AB6837_AK47_Absolute_Standard.jpg\`.
- Descrizioni: non importate perché non approvate editorialmente.
- Prezzi: importati come centesimi interi; aliquota IVA separata a 2200 punti base.
- Offerte: nessun prezzo precedente o sconto percentuale inventato.

## Cronologia idempotenza

| Run | Prodotti creati | aggiornati | invariati | Prezzi creati | aggiornati | invariati |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
${history
  .map(
    (run) =>
      `| ${run.runId} | ${run.products.created} | ${run.products.updated} | ${run.products.unchanged} | ${run.prices.created} | ${run.prices.updated} | ${run.prices.unchanged} |`,
  )
  .join("\n")}
`;
}

export async function writeCatalogImportReports(
  reportDirectory: string,
  summary: CatalogImportSummary,
) {
  await mkdir(reportDirectory, { recursive: true });
  const historyPath = path.join(reportDirectory, "catalog-import-history.json");
  const history = [...(await readHistory(historyPath)), summary].slice(-20);

  await Promise.all([
    writeFile(
      path.join(reportDirectory, "catalog-import-summary.md"),
      createSummaryMarkdown(summary, history),
    ),
    writeFile(
      path.join(reportDirectory, "catalog-import-results.csv"),
      createResultsCsv(summary.results),
    ),
    writeFile(
      path.join(reportDirectory, "catalog-import-errors.csv"),
      createIssuesCsv(
        summary.issues.filter((issue) => issue.kind === "invalid"),
      ),
    ),
    writeFile(
      path.join(reportDirectory, "catalog-import-conflicts.csv"),
      createIssuesCsv(
        summary.issues.filter(
          (issue) =>
            issue.kind === "conflict" || issue.kind === "missing_image",
        ),
      ),
    ),
    writeFile(historyPath, `${JSON.stringify(history, null, 2)}\n`),
  ]);
}
