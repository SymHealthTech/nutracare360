"use client";

import type { ReactNode } from "react";
import { trackEvent } from "@/lib/analytics";

type ContactMethod = "phone" | "website" | "email";

interface Props {
  href: string;
  method: ContactMethod;
  practitionerSlug: string;
  category: string;
  className?: string;
  target?: string;
  rel?: string;
  children: ReactNode;
}

/**
 * Anchor that reports a `practitioner_contact_clicked` conversion event before
 * following through to the underlying tel:/mailto:/website destination. Used on
 * the (server) practitioner profile page for phone and website click-throughs.
 */
export function ContactLink({
  href,
  method,
  practitionerSlug,
  category,
  className,
  target,
  rel,
  children,
}: Props) {
  return (
    <a
      href={href}
      target={target}
      rel={rel}
      className={className}
      onClick={() =>
        trackEvent("practitioner_contact_clicked", {
          practitioner_slug: practitionerSlug,
          category,
          contact_method: method,
        })
      }
    >
      {children}
    </a>
  );
}
