import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Review from "@/models/Review";
import Practitioner from "@/models/Practitioner";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const practitionerId = new URL(req.url).searchParams.get("practitionerId");
    if (!practitionerId) return NextResponse.json({ error: "practitionerId required" }, { status: 400 });

    const reviews = await Review.find({ practitionerId, isApproved: true })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    return NextResponse.json({ reviews });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { practitionerId, name, rating, comment } = await req.json();

    if (!practitionerId || !name?.trim() || !rating || !comment?.trim()) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }
    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Rating must be between 1 and 5." }, { status: 400 });
    }

    const review = await Review.create({
      practitionerId,
      name: name.trim().slice(0, 100),
      rating: Number(rating),
      comment: comment.trim().slice(0, 1000),
      isApproved: true,
    });

    // Recalculate and persist aggregate rating on the Practitioner document
    const allReviews = await Review.find({ practitionerId, isApproved: true }).lean();
    const avg = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
    await Practitioner.findByIdAndUpdate(practitionerId, {
      rating: Math.round(avg * 10) / 10,
      reviewCount: allReviews.length,
    });

    return NextResponse.json({ review }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
