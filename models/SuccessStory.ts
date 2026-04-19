import mongoose, { Schema, Document } from "mongoose";

export interface ISuccessStory extends Document {
  patientName: string;
  patientAvatar: string;
  patientCity: string;
  therapyType: string;
  practitionerName: string;
  practitionerSlug: string;
  story: string;
  beforeAfter: string;
  rating: number;
  isPublished: boolean;
  createdAt: Date;
}

const SuccessStorySchema = new Schema<ISuccessStory>(
  {
    patientName: { type: String, required: true },
    patientAvatar: String,
    patientCity: String,
    therapyType: String,
    practitionerName: String,
    practitionerSlug: String,
    story: String,
    beforeAfter: String,
    rating: { type: Number, min: 1, max: 5, default: 5 },
    isPublished: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

export default mongoose.models.SuccessStory ||
  mongoose.model<ISuccessStory>("SuccessStory", SuccessStorySchema);
