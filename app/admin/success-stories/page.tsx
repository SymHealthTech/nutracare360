import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import SuccessStory from "@/models/SuccessStory";
import { AdminShell } from "@/components/admin/AdminShell";
import { StarRating } from "@/components/ui/StarRating";
import { AdminSuccessStoryModal } from "@/components/admin/AdminSuccessStoryModal";
import { AdminStoryActions } from "@/components/admin/AdminStoryActions";
import { Plus, Link2, User } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminSuccessStoriesPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  await connectDB();
  const stories = await SuccessStory.find().sort({ createdAt: -1 }).lean();

  return (
    <AdminShell>
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-7">
          <div>
            <h1 className="font-playfair text-3xl font-bold text-[#1A1A2E]">Success Stories</h1>
            <p className="text-[#6B7280] mt-1">
              {stories.length} total · {stories.filter((s: any) => s.isPublished).length} published
            </p>
          </div>
          <AdminSuccessStoryModal
            trigger={
              <button className="inline-flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors">
                <Plus className="w-4 h-4" /> New Story
              </button>
            }
          />
        </div>

        {stories.length === 0 ? (
          <div className="text-center py-20 text-[#6B7280]">
            <p className="mb-4">No success stories yet.</p>
            <AdminSuccessStoryModal
              trigger={
                <button className="inline-flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors">
                  <Plus className="w-4 h-4" /> Create First Story
                </button>
              }
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {stories.map((s: any) => {
              const id = s._id?.toString();
              return (
                <div key={id} className="bg-white rounded-2xl border border-[#E5E7EB] p-6 flex flex-col gap-3">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <StarRating rating={s.rating} />
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                        s.isPublished ? "bg-accent-50 text-accent-700" : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {s.isPublished ? "Published" : "Draft"}
                    </span>
                  </div>

                  {/* Story excerpt */}
                  <p className="text-sm text-[#374151] italic line-clamp-3">
                    &ldquo;{s.story}&rdquo;
                  </p>

                  {/* Patient */}
                  <div className="flex items-center gap-1.5 text-xs text-[#6B7280]">
                    <User className="w-3.5 h-3.5 shrink-0" />
                    <span className="font-medium text-[#1A1A2E]">{s.patientName}</span>
                    {s.patientCity && <span>· {s.patientCity}</span>}
                  </div>

                  {/* Practitioner */}
                  {s.practitionerName && (
                    <div className="flex items-center gap-1.5 text-xs">
                      {s.practitionerSlug ? (
                        <Link
                          href={`/practitioners/${s.practitionerSlug}`}
                          target="_blank"
                          className="flex items-center gap-1 text-primary-600 hover:text-primary-700 font-medium"
                        >
                          <Link2 className="w-3.5 h-3.5" />
                          {s.practitionerName}
                        </Link>
                      ) : (
                        <span className="text-[#6B7280]">with {s.practitionerName}</span>
                      )}
                      {s.therapyType && (
                        <span className="ml-1 bg-primary-50 text-primary-600 px-2 py-0.5 rounded-full">
                          {typeof s.therapyType === "object" ? s.therapyType.name : s.therapyType}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-2 border-t border-[#F3F4F6]">
                    <AdminSuccessStoryModal
                      story={{ ...s, _id: id }}
                      trigger={
                        <button className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-lg font-medium hover:bg-gray-200 transition-colors">
                          Edit
                        </button>
                      }
                    />
                    <AdminStoryActions id={id} isPublished={s.isPublished} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AdminShell>
  );
}
