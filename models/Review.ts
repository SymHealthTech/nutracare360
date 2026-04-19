import mongoose, { Schema, Document } from "mongoose";

export interface IReview extends Document {
  practitionerId: mongoose.Types.ObjectId;
  name: string;
  rating: number;
  comment: string;
  isApproved: boolean;
  createdAt: Date;
}

const ReviewSchema = new Schema<IReview>(
  {
    practitionerId: { type: Schema.Types.ObjectId, ref: "Practitioner", required: true, index: true },
    name: { type: String, required: true, maxlength: 100 },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true, maxlength: 1000 },
    isApproved: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.Review || mongoose.model<IReview>("Review", ReviewSchema);
