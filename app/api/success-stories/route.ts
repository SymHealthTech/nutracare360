import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import SuccessStory from "@/models/SuccessStory";

export async function GET() {
  try {
    await connectDB();
    const stories = await SuccessStory.find({ isPublished: true }).sort({ createdAt: -1 });
    return NextResponse.json({ stories });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const story = await SuccessStory.create({ ...body, isPublished: false });
    return NextResponse.json({ success: true, story }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to create story" }, { status: 500 });
  }
}
