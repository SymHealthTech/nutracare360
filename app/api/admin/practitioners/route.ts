import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Practitioner from "@/models/Practitioner";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await connectDB();
    const body = await req.json();

    const slug = `${body.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${body.address?.city?.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "canada"}-${Date.now()}`;

    const practitioner = await Practitioner.create({
      ...body,
      slug,
      status: body.status || "approved",
    });

    return NextResponse.json({ success: true, practitioner }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to create practitioner" }, { status: 500 });
  }
}
