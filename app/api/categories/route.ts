import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Practitioner from "@/models/Practitioner";
import { CATEGORIES } from "@/lib/constants";

export async function GET() {
  try {
    await connectDB();
    const counts = await Practitioner.aggregate([
      { $match: { status: "approved" } },
      { $unwind: "$categories" },
      { $group: { _id: "$categories", count: { $sum: 1 } } },
    ]);

    const countMap = Object.fromEntries(counts.map((c) => [c._id, c.count]));
    const categories = CATEGORIES.map((cat) => ({
      ...cat,
      count: countMap[cat.name] || 0,
    }));

    return NextResponse.json({ categories });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
