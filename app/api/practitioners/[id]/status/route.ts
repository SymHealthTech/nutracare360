import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Practitioner from "@/models/Practitioner";
import { sendApprovalEmail, sendRejectionEmail } from "@/lib/email";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await connectDB();
    const { status, reason } = await req.json();

    const update: Record<string, unknown> = { status };
    if (status === "approved") {
      update.approvedAt = new Date();
      update.rejectionReason = "";
    }
    if (status === "rejected") {
      update.rejectionReason = typeof reason === "string" ? reason.trim() : "";
    }

    const practitioner = await Practitioner.findByIdAndUpdate(params.id, update, { new: true });
    if (!practitioner) return NextResponse.json({ error: "Not found" }, { status: 404 });

    // Notify the practitioner of the admin decision (graceful fail — never block the response)
    try {
      if (status === "approved") {
        await sendApprovalEmail(practitioner);
      } else if (status === "rejected") {
        await sendRejectionEmail(practitioner, practitioner.rejectionReason);
      }
    } catch (emailErr) {
      console.error("Status notification email failed:", emailErr);
    }

    return NextResponse.json({ success: true, practitioner });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
