import { Eye } from "lucide-react";

/**
 * View-only banner shown at the top of a listing opened via its private preview
 * link. The listing is not public yet — publishing is done manually by the admin
 * once the practitioner confirms by email, so there are no actions here.
 */
export function PreviewBanner() {
  return (
    <div className="fixed top-16 left-0 right-0 z-40 bg-[#1A1A2E] text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-2.5">
        <span className="flex-shrink-0 bg-white/10 rounded-lg p-1.5">
          <Eye className="w-4 h-4" />
        </span>
        <div className="min-w-0">
          <p className="text-sm font-semibold leading-tight">Preview — not yet public</p>
          <p className="text-xs text-white/60">
            This is a private preview of your listing. Reply to our email to confirm and we&apos;ll publish it for you.
          </p>
        </div>
      </div>
    </div>
  );
}
