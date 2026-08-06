import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Practitioner from "@/models/Practitioner";
import { sendApprovalEmail, sendChangeRequestEmail } from "@/lib/email";

/**
 * Practitioner-facing endpoint for the private preview page.
 *   action "confirm"         → publish the listing (goes live).
 *   action "request-changes" → keep it hidden and notify the admin.
 * Authorisation is the one-time `reviewToken` carried in the preview link.
 */
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { token, action = "confirm", message } = await req.json();

    if (!token) {
      return NextResponse.json({ error: "Missing preview token." }, { status: 400 });
    }

    // Token must match and not be expired. `select` is needed because the token
    // fields are hidden by default on the model.
    const practitioner = await Practitioner.findOne({
      reviewToken: token,
      reviewTokenExpiresAt: { $gt: new Date() },
    }).select("+reviewToken +reviewTokenExpiresAt");

    if (!practitioner) {
      return NextResponse.json(
        { error: "This preview link is invalid or has expired. Please contact us for a new one." },
        { status: 404 }
      );
    }

    if (action === "request-changes") {
      // Leave it hidden; just let the admin know what the practitioner wants changed.
      try {
        await sendChangeRequestEmail(practitioner, typeof message === "string" ? message.trim() : "");
      } catch (emailErr) {
        console.error("Change request email failed:", emailErr);
      }
      return NextResponse.json({ success: true, action: "request-changes" });
    }

    // Confirm & publish — consume the token so the link can't be reused.
    practitioner.status = "approved";
    practitioner.approvedAt = new Date();
    practitioner.confirmedAt = new Date();
    practitioner.reviewToken = undefined;
    practitioner.reviewTokenExpiresAt = undefined;
    await practitioner.save();

    try {
      await sendApprovalEmail(practitioner);
    } catch (emailErr) {
      console.error("Approval email failed:", emailErr);
    }

    return NextResponse.json({ success: true, action: "confirm", slug: practitioner.slug });
  } catch (err) {
    console.error("[confirm]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
