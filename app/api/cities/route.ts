import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Practitioner from "@/models/Practitioner";
import { CITIES } from "@/lib/constants";

export async function GET() {
  try {
    await connectDB();
    const counts = await Practitioner.aggregate([
      { $match: { status: "approved" } },
      { $group: { _id: "$address.city", count: { $sum: 1 } } },
    ]);

    const countMap = Object.fromEntries(counts.map((c) => [c._id, c.count]));
    const cities = CITIES.map((city) => ({ name: city, count: countMap[city] || 0 }));

    return NextResponse.json({ cities });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
