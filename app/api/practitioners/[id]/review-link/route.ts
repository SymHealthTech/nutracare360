import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import crypto from "crypto";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Practitioner from "@/models/Practitioner";

// Preview links stay valid for one month.
const REVIEW_TOKEN_TTL_MS = 30 * 24 * 60 * 60 * 1000;

/**
 * Admin: (re)generate a private preview link for a listing and return it so the
 * admin can copy and send it manually. No email is sent from here. Works for a
 * fresh draft or to move an existing pending listing into the review flow.
 * Refreshes the token each time so any previously shared link stops working.
 */
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await connectDB();

    const reviewToken = crypto.randomUUID();
    const practitioner = await Practitioner.findByIdAndUpdate(
      params.id,
      {
        status: "awaiting_confirmation",
        reviewToken,
        reviewTokenExpiresAt: new Date(Date.now() + REVIEW_TOKEN_TTL_MS),
      },
      { new: true }
    ).select("+reviewToken");

    if (!practitioner) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const previewUrl = `${req.nextUrl.origin}/practitioners/${practitioner.slug}?token=${reviewToken}`;

    return NextResponse.json({ success: true, previewUrl });
  } catch (err) {
    console.error("[review-link]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
