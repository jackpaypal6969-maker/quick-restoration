import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

const MIDNIGHT = "#0f0a28";

/**
 * 180x180 home-screen icon: the Q mark on midnight with the brand glows.
 * iOS applies its own corner mask, so the background runs full bleed.
 */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
          backgroundColor: MIDNIGHT,
        }}
      >
        <svg width="180" height="180" viewBox="0 0 180 180" style={{ position: "absolute", top: 0, left: 0 }}>
          <defs>
            <radialGradient id="violet">
              <stop offset="0" stopColor="#5b21d6" stopOpacity="0.7" />
              <stop offset="1" stopColor="#5b21d6" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="cyan">
              <stop offset="0" stopColor="#22d3ee" stopOpacity="0.32" />
              <stop offset="1" stopColor="#22d3ee" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx="160" cy="10" r="120" fill="url(#violet)" />
          <circle cx="20" cy="175" r="110" fill="url(#cyan)" />
        </svg>
        <svg width="148" height="148" viewBox="0 0 64 64">
          <defs>
            <linearGradient id="g" gradientUnits="userSpaceOnUse" x1="8" y1="8" x2="56" y2="56">
              <stop offset="0" stopColor="#67e8f9" />
              <stop offset="0.5" stopColor="#22d3ee" />
              <stop offset="1" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>
          <circle cx="29" cy="29" r="15" fill="none" stroke="url(#g)" strokeWidth="8" />
          <path d="M31.7 37.9 L54 54 L37.9 31.7 A4.4 4.4 0 1 0 31.7 37.9 Z" fill="url(#g)" />
        </svg>
      </div>
    ),
    { ...size },
  );
}
