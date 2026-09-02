import { getServiceArea, type ServiceArea } from "@/config/site";
import type { ServiceCountyKey } from "@/data/long-island-map";

export type AreaSlug = ServiceArea["slug"];

/** Config slug → map geometry key. */
export const AREA_SLUG_TO_COUNTY: Record<AreaSlug, ServiceCountyKey> = {
  "nassau-county": "nassau",
  "suffolk-county": "suffolk",
  queens: "queens",
};

/** Map geometry key → config slug. */
export const COUNTY_TO_AREA_SLUG: Record<ServiceCountyKey, AreaSlug> = {
  nassau: "nassau-county",
  suffolk: "suffolk-county",
  queens: "queens",
};

export interface CountyMeta {
  slug: AreaSlug;
  name: string;
  shortName: string;
  href: string;
}

function metaFor(slug: AreaSlug): CountyMeta {
  const area = getServiceArea(slug);
  if (!area) throw new Error(`Missing service area config for "${slug}"`);
  return { slug, name: area.name, shortName: area.shortName, href: `/service-areas/${slug}` };
}

/** Display data for each highlighted county, sourced from siteConfig. */
export const COUNTY_META: Record<ServiceCountyKey, CountyMeta> = {
  suffolk: metaFor("suffolk-county"),
  nassau: metaFor("nassau-county"),
  queens: metaFor("queens"),
};

export function countyKeyFor(area: Pick<ServiceArea, "slug">): ServiceCountyKey {
  return AREA_SLUG_TO_COUNTY[area.slug];
}

/** "Nassau County" / "Suffolk County" / "Queens, NYC" for eyebrows. */
export function countyEyebrow(area: Pick<ServiceArea, "county">): string {
  return area.county === "Queens" ? "Queens, NYC" : `${area.county} County`;
}

export function areaHref(area: Pick<ServiceArea, "slug">): string {
  return `/service-areas/${area.slug}`;
}
