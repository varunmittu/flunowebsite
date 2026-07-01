import { NextResponse }   from "next/server";
import { connectDB }      from "@/lib/mongodb";
import { Order }          from "@/lib/models/Order";
import { ProductModel }   from "@/lib/models/Product";
import { BlogModel }      from "@/lib/models/Blog";
import { CouponModel }    from "@/lib/models/Coupon";
import { getAdminSession } from "@/lib/adminAuth";

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();

  const [
    totalOrders,
    paidOrders,
    totalProducts,
    publishedBlogs,
    activeCoupons,
    recentOrders,
    revenue,
  ] = await Promise.all([
    Order.countDocuments(),
    Order.countDocuments({ status: { $in: ["paid", "processing", "shipped", "delivered"] } }),
    ProductModel.countDocuments({ active: true }),
    BlogModel.countDocuments({ published: true }),
    CouponModel.countDocuments({ active: true }),
    Order.find({ status: { $in: ["paid", "processing", "shipped", "delivered"] } })
      .sort({ createdAt: -1 }).limit(5).lean(),
    Order.aggregate([
      { $match: { status: { $in: ["paid", "processing", "shipped", "delivered"] } } },
      { $group: { _id: null, total: { $sum: "$total" } } },
    ]),
  ]);

  return NextResponse.json({
    totalOrders,
    paidOrders,
    totalProducts,
    publishedBlogs,
    activeCoupons,
    revenue: revenue[0]?.total ?? 0,
    recentOrders,
  });
}
