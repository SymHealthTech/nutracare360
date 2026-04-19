import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Practitioner from "@/models/Practitioner";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const city = searchParams.get("city");
    const province = searchParams.get("province");
    const language = searchParams.get("language");
    const verified = searchParams.get("verified");
    const featured = searchParams.get("featured");
    const sort = searchParams.get("sort") || "rating";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");

    const name = searchParams.get("name");

    const query: Record<string, unknown> = { status: "approved" };
    if (category) query.categories = { $regex: new RegExp(category, "i") };
    if (city) query["address.city"] = { $regex: new RegExp(city, "i") };
    if (province) query["address.province"] = { $regex: new RegExp(province, "i") };
    if (language) query.languages = { $regex: new RegExp(language, "i") };
    if (verified === "true") query.isVerified = true;
    if (featured === "true") query.isFeatured = true;
    if (name) {
      const conditions: { name: RegExp }[] = [{ name: new RegExp(name, "i") }];
      // Also match by initials (e.g. "NC" matches "NutraCare Center")
      if (name.length <= 6 && /^[a-zA-Z]+$/.test(name)) {
        const initialsPattern = name.split("").map((c) => `\\b${c}`).join(".*");
        conditions.push({ name: new RegExp(initialsPattern, "i") });
      }
      query.$or = conditions;
    }

    const sortMap: Record<string, [string, 1 | -1][]> = {
      rating: [["rating", -1]],
      newest: [["createdAt", -1]],
      name: [["name", 1]],
    };
    const sortObj = sortMap[sort] || [["rating", -1]];

    const total = await Practitioner.countDocuments(query);
    const practitioners = await Practitioner.find(query)
      .sort(sortObj)
      .skip((page - 1) * limit)
      .limit(limit)
      .select("-__v");

    return NextResponse.json({ practitioners, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();

    const slug = `${body.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${body.address?.city?.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "canada"}`;

    const practitioner = await Practitioner.create({ ...body, slug, status: "pending" });

    // Send admin notification email (optional - graceful fail)
    try {
      const nodemailer = await import("nodemailer");
      const transporter = nodemailer.default.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || "587"),
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
      });
      await transporter.sendMail({
        from: process.env.SMTP_USER,
        to: process.env.ADMIN_EMAIL,
        subject: `New Practitioner Submission: ${body.name}`,
        text: `A new practitioner has submitted their listing:\n\nName: ${body.name}\nCity: ${body.address?.city}\nCategories: ${body.categories?.join(", ")}\n\nLog in to admin panel to review.`,
      });
    } catch (_emailErr) {
      // Email failure should not block the API response
    }

    return NextResponse.json({ success: true, practitioner }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to create practitioner" }, { status: 500 });
  }
}
