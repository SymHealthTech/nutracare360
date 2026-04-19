"use client";

export function DemoBanner() {
  const msg = "⚠️  DEMO VERSION — This website contains sample data only. Real practitioners have not been listed yet. The full NutraCare360 directory will launch soon.     •     ";

  return (
    <div
      style={{
        position: "fixed",
        top: "50%",
        left: 0,
        right: 0,
        transform: "translateY(-50%)",
        zIndex: 9999,
        overflow: "hidden",
        background: "linear-gradient(90deg, rgba(120,53,15,0.55) 0%, rgba(180,83,9,0.55) 20%, rgba(217,119,6,0.55) 50%, rgba(180,83,9,0.55) 80%, rgba(120,53,15,0.55) 100%)",
        backdropFilter: "blur(4px)",
        WebkitBackdropFilter: "blur(4px)",
        borderTop: "1px solid rgba(251,191,36,0.6)",
        borderBottom: "1px solid rgba(251,191,36,0.6)",
        boxShadow: "0 0 24px rgba(251,191,36,0.2)",
        padding: "2px 0",
        pointerEvents: "none",
      }}
    >
      {/* Scrolling track */}
      <div
        style={{
          display: "inline-flex",
          whiteSpace: "nowrap",
          animation: "demoTicker 20s linear infinite",
          //willChange: "transform",
        }}
      >
        {/* Repeat the message 4 times so there are no gaps at any screen width */}
        {[0, 1].map((i) => (
          <span
            key={i}
            style={{
              display: "inline-block",
              paddingRight: "4rem",
              color: "#fef9c3",
              fontWeight: 600,
              fontSize: "0.75rem",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              textShadow: "0 1px 6px rgba(0,0,0,0.5)",
            }}
          >
            <span style={{ color: "#fbbf24", marginRight: "0.5rem" }}>●</span>
            {msg}
          </span>
        ))}
      </div>
    </div>
  );
}
