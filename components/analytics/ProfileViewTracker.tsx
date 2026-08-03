"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";

interface Props {
  slug: string;
  category: string;
}

/**
 * Fires the `practitioner_profile_viewed` conversion event once when a
 * practitioner profile mounts. Rendered from the (server) profile page so the
 * page itself can stay a server component.
 */
export function ProfileViewTracker({ slug, category }: Props) {
  useEffect(() => {
    trackEvent("practitioner_profile_viewed", {
      practitioner_slug: slug,
      category,
    });
  }, [slug, category]);

  return null;
}
