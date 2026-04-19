import mongoose, { Schema, Document } from "mongoose";

export interface ITeamMember {
  name: string;
  designation: string;
  photo: string;
  specialties: string[];
}

export interface IClinicDetails {
  clinicName: string;
  logo: string;
  establishedYear: number;
  totalPractitioners: number;
  teamMembers: ITeamMember[];
}

export interface IPractitioner extends Document {
  name: string;
  slug: string;
  profileImage: string;
  coverImage: string;
  practiceType: "individual" | "center" | "clinic";
  clinicDetails: IClinicDetails;
  googleBusinessProfileUrl: string;
  businessName: string;
  designation: string;
  categories: string[];
  address: {
    street: string;
    city: string;
    province: string;
    postalCode: string;
    country: string;
  };
  coordinates: { lat: number; lng: number };
  phone: string;
  email: string;
  website: string;
  social: {
    instagram: string;
    facebook: string;
    linkedin: string;
    youtube: string;
  };
  bio: string;
  shortBio: string;
  experience: number;
  education: Array<{ degree: string; institution: string; year: number }>;
  certifications: Array<{ name: string; issuedBy: string; year: number }>;
  languages: string[];
  services: Array<{ name: string; duration: string; price: string; description: string }>;
  workingHours: Record<string, { open: string; close: string; isClosed: boolean }>;
  gallery: string[];
  rating: number;
  reviewCount: number;
  status: "pending" | "approved" | "rejected" | "suspended";
  listingType: "free" | "premium";
  isFeatured: boolean;
  isVerified: boolean;
  metaTitle: string;
  metaDescription: string;
  createdAt: Date;
  updatedAt: Date;
  approvedAt: Date;
}

const WorkingHourSchema = new Schema(
  { open: String, close: String, isClosed: { type: Boolean, default: false } },
  { _id: false }
);

const TeamMemberSchema = new Schema<ITeamMember>(
  { name: String, designation: String, photo: String, specialties: [String] },
  { _id: false }
);

const ClinicDetailsSchema = new Schema<IClinicDetails>(
  {
    clinicName: String,
    logo: String,
    establishedYear: Number,
    totalPractitioners: Number,
    teamMembers: [TeamMemberSchema],
  },
  { _id: false }
);

const PractitionerSchema = new Schema<IPractitioner>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    profileImage: String,
    coverImage: String,
    practiceType: { type: String, enum: ["individual", "center", "clinic"], default: "individual" },
    clinicDetails: ClinicDetailsSchema,
    googleBusinessProfileUrl: String,
    businessName: String,
    designation: String,
    categories: { type: [String], index: true },
    address: {
      street: String,
      city: { type: String, index: true },
      province: { type: String, index: true },
      postalCode: String,
      country: { type: String, default: "Canada" },
    },
    coordinates: { lat: Number, lng: Number },
    phone: String,
    email: String,
    website: String,
    social: { instagram: String, facebook: String, linkedin: String, youtube: String },
    bio: { type: String, maxlength: 2000 },
    shortBio: { type: String, maxlength: 200 },
    experience: Number,
    education: [{ degree: String, institution: String, year: Number }],
    certifications: [{ name: String, issuedBy: String, year: Number }],
    languages: [String],
    services: [{ name: String, duration: String, price: String, description: String }],
    workingHours: {
      monday: WorkingHourSchema,
      tuesday: WorkingHourSchema,
      wednesday: WorkingHourSchema,
      thursday: WorkingHourSchema,
      friday: WorkingHourSchema,
      saturday: WorkingHourSchema,
      sunday: WorkingHourSchema,
    },
    gallery: [String],
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    status: { type: String, enum: ["pending", "approved", "rejected", "suspended"], default: "pending", index: true },
    listingType: { type: String, enum: ["free", "premium"], default: "free" },
    isFeatured: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    metaTitle: String,
    metaDescription: String,
    approvedAt: Date,
  },
  { timestamps: true }
);

export default mongoose.models.Practitioner ||
  mongoose.model<IPractitioner>("Practitioner", PractitionerSchema);
