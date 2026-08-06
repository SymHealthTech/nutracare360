import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import crypto from "crypto";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Practitioner from "@/models/Practitioner";
import { sendReviewLinkEmail } from "@/lib/email";

// Preview links stay valid for one month so the practitioner has time to confirm.
const REVIEW_TOKEN_TTL_MS = 30 * 24 * 60 * 60 * 1000;

/**
 * Admin: (re)generate a preview/confirmation link for a listing and email it to
 * the practitioner. Works for a fresh draft or to move an existing pending
 * listing into the confirmation flow. Refreshes the token each time so old
 * links stop working.
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

    let emailSent = true;
    try {
      await sendReviewLinkEmail(practitioner, previewUrl);
    } catch (emailErr) {
      emailSent = false;
      console.error("Review link email failed:", emailErr);
    }

    return NextResponse.json({ success: true, previewUrl, emailSent });
  } catch (err) {
    console.error("[review-link]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
