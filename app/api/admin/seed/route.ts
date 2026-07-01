import { NextResponse }   from "next/server";
import { connectDB }      from "@/lib/mongodb";
import { ProductModel }   from "@/lib/models/Product";
import { CategoryModel }  from "@/lib/models/Category";
import { products }       from "@/lib/products";
import { getAdminSession } from "@/lib/adminAuth";

export async function POST() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();

  let seeded = 0;
  for (const p of products) {
    const exists = await ProductModel.findOne({ slug: p.slug });
    if (!exists) {
      await ProductModel.create(p);
      seeded++;
    }
  }

  const categories = ["Hand Care", "Sun Care", "Body Care", "Hair Care"];
  let catSeeded = 0;
  for (const name of categories) {
    const slug = name.toLowerCase().replace(/\s+/g, "-");
    const exists = await CategoryModel.findOne({ slug });
    if (!exists) {
      await CategoryModel.create({ name, slug, active: true, order: catSeeded });
      catSeeded++;
    }
  }

  return NextResponse.json({ ok: true, productsSeeded: seeded, categoriesSeeded: catSeeded });
}
