import type { MetadataRoute } from "next";
import { serviceAreas, services } from "@/config/site";
import { absoluteUrl } from "@/lib/seo";

type ChangeFrequency = MetadataRoute.Sitemap[number]["changeFrequency"];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const entry = (path: string, changeFrequency: ChangeFrequency, priority: number) => ({
    url: absoluteUrl(path),
    lastModified,
    changeFrequency,
    priority,
  });

  return [
    entry("/", "weekly", 1),
    entry("/services", "monthly", 0.9),
    ...services.map((service) => entry(`/services/${service.slug}`, "monthly", 0.9)),
    entry("/service-areas", "monthly", 0.8),
    ...serviceAreas.map((area) => entry(`/service-areas/${area.slug}`, "monthly", 0.8)),
    entry("/about", "monthly", 0.5),
    entry("/contact", "monthly", 0.5),
    entry("/privacy", "yearly", 0.5),
    entry("/terms", "yearly", 0.5),
  ];
}
