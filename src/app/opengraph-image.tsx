import { ImageResponse } from "next/og";
import { serviceAreas, siteConfig } from "@/config/site";

const counties = serviceAreas.map((area) => area.shortName);
const HEADLINE = "24/7 water, fire & mold restoration";

export const alt = `${siteConfig.name} - ${HEADLINE} - ${counties.join(", ")}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const MIDNIGHT = "#0f0a28";
const MIDNIGHT_800 = "#171040";
const CYAN = "#67e8f9";
const VIOLET = "#8b5cf6";

const CREDENTIAL_KEYS = ["iicrc", "nys-mold"];
const credentialLines = siteConfig.credentials
  .filter((credential) => CREDENTIAL_KEYS.includes(credential.key))
  .map((credential) => credential.label);

/**
 * Site-wide social card. Only the font bundled with next/og is used, so the
 * image builds without any network access.
 */
export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          position: "relative",
          overflow: "hidden",
          padding: "60px 72px",
          backgroundColor: MIDNIGHT,
          color: "#ffffff",
        }}
      >
        {/* Glows: drawn as SVG so the radial fades rasterise cleanly */}
        <svg
          width={size.width}
          height={size.height}
          viewBox={`0 0 ${size.width} ${size.height}`}
          style={{ position: "absolute", top: 0, left: 0 }}
        >
          <defs>
            <radialGradient id="violet">
              <stop offset="0" stopColor="#5b21d6" stopOpacity="0.62" />
              <stop offset="1" stopColor="#5b21d6" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="cyan">
              <stop offset="0" stopColor="#22d3ee" stopOpacity="0.3" />
              <stop offset="1" stopColor="#22d3ee" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx="1040" cy="20" r="560" fill="url(#violet)" />
          <circle cx="100" cy="660" r="520" fill="url(#cyan)" />
        </svg>

        {/* Mark + wordmark */}
        <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
          <svg width="76" height="76" viewBox="0 0 64 64">
            <defs>
              <linearGradient id="g" gradientUnits="userSpaceOnUse" x1="8" y1="8" x2="56" y2="56">
                <stop offset="0" stopColor={CYAN} />
                <stop offset="0.5" stopColor="#22d3ee" />
                <stop offset="1" stopColor={VIOLET} />
              </linearGradient>
            </defs>
            <rect width="64" height="64" rx="14" fill={MIDNIGHT_800} stroke="rgba(255,255,255,0.14)" strokeWidth="1" />
            <circle cx="29" cy="29" r="15" fill="none" stroke="url(#g)" strokeWidth="8" />
            <path d="M31.7 37.9 L54 54 L37.9 31.7 A4.4 4.4 0 1 0 31.7 37.9 Z" fill="url(#g)" />
          </svg>
          <div style={{ display: "flex", fontSize: 38, fontWeight: 700, letterSpacing: -1.2 }}>{siteConfig.name}</div>
        </div>

        {/* Headline */}
        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <div
            style={{
              display: "flex",
              fontSize: 20,
              fontWeight: 700,
              letterSpacing: 5,
              textTransform: "uppercase",
              color: CYAN,
            }}
          >
            Long Island emergency response
          </div>
          <div
            style={{
              display: "flex",
              maxWidth: 1000,
              fontSize: 74,
              fontWeight: 700,
              lineHeight: 1.04,
              letterSpacing: -2.5,
            }}
          >
            {HEADLINE}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 18, fontSize: 30, color: "rgba(255,255,255,0.72)" }}>
            {counties.map((county, index) => (
              <div key={county} style={{ display: "flex", alignItems: "center", gap: 18 }}>
                {index > 0 && <div style={{ width: 8, height: 8, borderRadius: 999, backgroundColor: CYAN }} />}
                <div style={{ display: "flex" }}>{county}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Credentials */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 14 }}>
          {credentialLines.map((line) => (
            <div
              key={line}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "12px 22px",
                borderRadius: 999,
                border: "1px solid rgba(255,255,255,0.16)",
                backgroundColor: "rgba(255,255,255,0.06)",
                fontSize: 22,
                color: "rgba(255,255,255,0.92)",
              }}
            >
              <div style={{ width: 10, height: 10, borderRadius: 999, backgroundColor: CYAN }} />
              <div style={{ display: "flex" }}>{line}</div>
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size },
  );
}
