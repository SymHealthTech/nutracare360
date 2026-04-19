"use client";
import Image from "next/image";
import { useState } from "react";

interface TeamCardProps {
  name: string;
  role: string;
  org: string;
  desc: string;
  img: string;
  initials: string;
}

export default function TeamCard({ name, role, org, desc, img, initials }: TeamCardProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="bg-white rounded-2xl p-7 border border-[#E5E7EB] text-center flex flex-col items-center">
      <div className="relative w-28 h-28 rounded-full overflow-hidden mb-5 ring-4 ring-primary-100 bg-primary-50 flex items-center justify-center">
        {!imgError ? (
          <Image
            src={img}
            alt={name}
            fill
            className="object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <span className="font-playfair text-2xl font-bold text-primary-500">{initials}</span>
        )}
      </div>
      <h3 className="font-playfair text-lg font-bold text-[#1A1A2E] leading-tight mb-1">{name}</h3>
      <p className="text-primary-600 font-semibold text-sm mb-0.5">{role}</p>
      {org && <p className="text-[#6B7280] text-xs mb-1">{org}</p>}
      {desc && <p className="text-[#9CA3AF] text-xs italic">{desc}</p>}
    </div>
  );
}
