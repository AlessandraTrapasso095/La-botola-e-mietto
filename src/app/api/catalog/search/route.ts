import { NextResponse } from "next/server";
import { z } from "zod";

import { getCatalogRepository } from "@/server/catalog/get-catalog-repository";

const searchQuerySchema = z.string().trim().min(2).max(120);

export async function GET(request: Request) {
  const url = new URL(request.url);
  const query = searchQuerySchema.safeParse(url.searchParams.get("q"));

  if (!query.success) {
    return NextResponse.json(
      { message: "Inserisci almeno due caratteri." },
      { status: 400 },
    );
  }

  const results = await getCatalogRepository().search(query.data, {
    productLimit: 7,
    brandLimit: 4,
    categoryLimit: 4,
  });
  return NextResponse.json(results);
}
