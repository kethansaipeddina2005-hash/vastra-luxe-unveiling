import { useEffect, useState } from "react";

function diff(target: Date) {
  const ms = Math.max(0, target.getTime() - Date.now());
  const s = Math.floor(ms / 1000);
  return {
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60,
  };
}

export function Countdown({ launchDate }: { launchDate: string }) {
  const target = new Date(launchDate);
  const [t, setT] = useState(() => diff(target));
  useEffect(() => {
    const i = setInterval(() => setT(diff(target)), 1000);
    return () => clearInterval(i);
  }, [launchDate]);

  const items = [
    { label: "Days", value: t.days },
    { label: "Hours", value: t.hours },
    { label: "Minutes", value: t.minutes },
    { label: "Seconds", value: t.seconds },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 max-w-3xl mx-auto">
      {items.map((it) => (
        <div key={it.label} className="luxe-card p-6 sm:p-8 text-center group">
          <div className="text-5xl sm:text-6xl font-display text-[var(--maroon)] tabular-nums tracking-tight">
            {String(it.value).padStart(2, "0")}
          </div>
          <div className="mt-3 gold-divider" />
          <div className="mt-3 text-[0.7rem] tracking-[0.3em] uppercase text-[var(--muted-foreground)]">
            {it.label}
          </div>
        </div>
      ))}
    </div>
  );
}
