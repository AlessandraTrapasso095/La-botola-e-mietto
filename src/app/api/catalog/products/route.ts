import { NextResponse } from "next/server";
import { z } from "zod";

import { getCatalogRepository } from "@/server/catalog/get-catalog-repository";

const productSlugsSchema = z
  .string()
  .transform((value) => value.split(",").map((slug) => slug.trim()))
  .pipe(z.array(z.string().min(1)).max(50));

export async function GET(request: Request) {
  const url = new URL(request.url);
  const parsed = productSlugsSchema.safeParse(url.searchParams.get("slugs"));

  if (!parsed.success) {
    return NextResponse.json(
      { message: "Elenco prodotti non valido." },
      { status: 400 },
    );
  }

  const products = await getCatalogRepository().getProductsBySlugs(parsed.data);
  return NextResponse.json({ products });
}
