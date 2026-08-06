import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import crypto from "crypto";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Practitioner from "@/models/Practitioner";
import { sendReviewLinkEmail } from "@/lib/email";

// Preview links stay valid for one month so the practitioner has time to confirm.
const REVIEW_TOKEN_TTL_MS = 30 * 24 * 60 * 60 * 1000;

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await connectDB();
    // Never trust client-supplied status/token fields — publish behaviour is
    // driven solely by `publishMode`.
    const { publishMode, status: _status, reviewToken: _rt, reviewTokenExpiresAt: _rte, ...body } = await req.json();

    const slug = `${body.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${body.address?.city?.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "canada"}-${Date.now()}`;

    // "review" → create hidden and send the practitioner a preview link to confirm.
    // Anything else → publish immediately (the default, existing behaviour).
    if (publishMode === "review") {
      const reviewToken = crypto.randomUUID();
      const practitioner = await Practitioner.create({
        ...body,
        slug,
        status: "awaiting_confirmation",
        reviewToken,
        reviewTokenExpiresAt: new Date(Date.now() + REVIEW_TOKEN_TTL_MS),
      });

      const previewUrl = `${req.nextUrl.origin}/practitioners/${slug}?token=${reviewToken}`;

      // Graceful fail — the listing is created even if the email can't be sent.
      let emailSent = true;
      try {
        await sendReviewLinkEmail(practitioner, previewUrl);
      } catch (emailErr) {
        emailSent = false;
        console.error("Review link email failed:", emailErr);
      }

      // Strip token fields from the response payload.
      const safe = practitioner.toObject();
      delete safe.reviewToken;
      delete safe.reviewTokenExpiresAt;

      return NextResponse.json(
        { success: true, practitioner: safe, previewUrl, emailSent, mode: "review" },
        { status: 201 }
      );
    }

    const practitioner = await Practitioner.create({
      ...body,
      slug,
      status: "approved",
      approvedAt: new Date(),
    });

    return NextResponse.json({ success: true, practitioner, mode: "direct" }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to create practitioner" }, { status: 500 });
  }
}
