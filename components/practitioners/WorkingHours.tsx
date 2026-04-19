"use client";

const DAYS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
const DAY_LABELS: Record<string, string> = {
  monday: "Monday", tuesday: "Tuesday", wednesday: "Wednesday",
  thursday: "Thursday", friday: "Friday", saturday: "Saturday", sunday: "Sunday",
};

function isOpenNow(hours: Record<string, { open: string; close: string; isClosed: boolean }>) {
  const now = new Date();
  const dayName = DAYS[now.getDay() === 0 ? 6 : now.getDay() - 1];
  const todayHours = hours[dayName];
  if (!todayHours || todayHours.isClosed) return false;

  const parseTime = (t: string) => {
    const match = t.match(/(\d+):(\d+)\s*(AM|PM)/i);
    if (!match) return null;
    let h = parseInt(match[1]);
    const m = parseInt(match[2]);
    if (match[3].toUpperCase() === "PM" && h !== 12) h += 12;
    if (match[3].toUpperCase() === "AM" && h === 12) h = 0;
    return h * 60 + m;
  };

  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const openTime = parseTime(todayHours.open);
  const closeTime = parseTime(todayHours.close);
  if (openTime === null || closeTime === null) return false;
  return currentMinutes >= openTime && currentMinutes < closeTime;
}

export function WorkingHours({ hours }: { hours: Record<string, { open: string; close: string; isClosed: boolean }> }) {
  const open = isOpenNow(hours);
  const today = DAYS[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1];

  return (
    <div>
      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-4 ${open ? "bg-accent-50 text-accent-700" : "bg-red-50 text-red-600"}`}>
        <span className={`w-2 h-2 rounded-full ${open ? "bg-accent-500" : "bg-red-400"}`} />
        {open ? "Open Now" : "Closed Now"}
      </div>

      <div className="space-y-2">
        {DAYS.map((day) => {
          const h = hours[day];
          const isToday = day === today;
          return (
            <div key={day} className={`flex items-center justify-between py-2 px-3 rounded-lg ${isToday ? "bg-primary-50 border border-primary-100" : ""}`}>
              <span className={`text-sm ${isToday ? "font-semibold text-primary-700" : "text-[#374151]"} capitalize`}>
                {DAY_LABELS[day]}
              </span>
              {h?.isClosed ? (
                <span className="text-xs text-[#6B7280]">Closed</span>
              ) : (
                <span className={`text-sm ${isToday ? "font-medium text-primary-700" : "text-[#374151]"}`}>
                  {h?.open} – {h?.close}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
