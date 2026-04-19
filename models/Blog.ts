import mongoose, { Schema, Document } from "mongoose";

export interface IBlog extends Document {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: string;
  tags: string[];
  author: { name: string; avatar: string; bio: string; practitionerSlug?: string };
  isAIGenerated: boolean;
  isPublished: boolean;
  publishedAt: Date;
  readTime: number;
  createdAt: Date;
}

const BlogSchema = new Schema<IBlog>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    excerpt: { type: String, maxlength: 300 },
    content: String,
    coverImage: String,
    category: { type: String, index: true },
    tags: [String],
    author: { name: String, avatar: String, bio: String, practitionerSlug: String },
    isAIGenerated: { type: Boolean, default: false },
    isPublished: { type: Boolean, default: false, index: true },
    publishedAt: Date,
    readTime: Number,
  },
  { timestamps: true }
);

export default mongoose.models.Blog || mongoose.model<IBlog>("Blog", BlogSchema);
