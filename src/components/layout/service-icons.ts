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

/** Maps the icon key stored in siteConfig services to a lucide component. */
export const serviceIcons: Record<ServiceIconKey, LucideIcon> = {
  droplets: Droplets,
  flame: Flame,
  "shield-check": ShieldCheck,
  wind: Wind,
  biohazard: Biohazard,
  "cloud-lightning": CloudLightning,
  "air-vent": AirVent,
  hammer: Hammer,
};
