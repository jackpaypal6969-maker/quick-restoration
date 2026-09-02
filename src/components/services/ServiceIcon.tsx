import {
  AirVent,
  Biohazard,
  CloudLightning,
  Droplets,
  Flame,
  Hammer,
  ShieldCheck,
  Wind,
  type LucideIcon,
} from "lucide-react";
import type { ServiceIconKey } from "@/config/site";

/** Icon key stored on each service in siteConfig → lucide component. */
export const SERVICE_ICONS: Record<ServiceIconKey, LucideIcon> = {
  droplets: Droplets,
  flame: Flame,
  "shield-check": ShieldCheck,
  wind: Wind,
  biohazard: Biohazard,
  "cloud-lightning": CloudLightning,
  "air-vent": AirVent,
  hammer: Hammer,
};

interface ServiceIconProps {
  icon: ServiceIconKey;
  className?: string;
  /** Pixel width and height. */
  size?: number;
  strokeWidth?: number;
  /** Accessible name. Omit for decorative icons (rendered aria-hidden). */
  label?: string;
}

/** Renders the lucide icon for a service. Decorative by default. */
export function ServiceIcon({ icon, className, size = 24, strokeWidth = 1.75, label }: ServiceIconProps) {
  const Icon = SERVICE_ICONS[icon];
  return (
    <Icon
      className={className}
      size={size}
      strokeWidth={strokeWidth}
      {...(label ? { role: "img", "aria-label": label } : { "aria-hidden": true })}
    />
  );
}
