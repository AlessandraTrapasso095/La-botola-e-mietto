import path from "node:path";

import { readCatalogSource } from "@/server/catalog-import/catalog-source";
import { importCatalogToDatabase } from "@/server/catalog-import/catalog-database";
import { writeCatalogImportReports } from "@/server/catalog-import/catalog-report";
import { getLocalSupabaseEnvironment } from "@/server/catalog-import/local-supabase";

const rootDirectory = process.cwd();
const runId =
  process.argv.find((argument) => argument.startsWith("--run="))?.slice(6) ??
  new Date().toISOString().replaceAll(":", "-");

async function main() {
  const environment = getLocalSupabaseEnvironment();
  const source = await readCatalogSource({
    workbookPath: path.join(
      rootDirectory,
      "reference-private/catalog/listino_completo_la_botola.xlsx",
    ),
    sourceImageDirectory: path.join(
      rootDirectory,
      "reference-private/product-images/immagini_prodotti",
    ),
    publicDirectory: path.join(rootDirectory, "public"),
  });
  const summary = await importCatalogToDatabase(source, {
    databaseUrl: environment.DB_URL,
    runId,
  });
  await writeCatalogImportReports(
    path.join(rootDirectory, "reference-private/import-reports"),
    summary,
  );

  process.stdout.write(
    `${JSON.stringify(
      {
        runId: summary.runId,
        rowsRead: summary.rowsRead,
        uniqueProductCodes: summary.uniqueProductCodes,
        products: summary.products,
        prices: summary.prices,
        inventories: summary.inventories,
        images: summary.images,
        offers: summary.offers,
        conflicts: summary.conflicts,
        databaseCounts: summary.databaseCounts,
      },
      null,
      2,
    )}\n`,
  );
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : "Import fallito.";
  process.stderr.write(`${message}\n`);
  process.exitCode = 1;
});
