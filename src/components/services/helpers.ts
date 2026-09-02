import { serviceAreas } from "@/config/site";

/** Join for prose: ["Nassau", "Suffolk", "Queens"] → "Nassau, Suffolk and Queens". */
export function joinList(items: readonly string[], conjunction = "and"): string {
  if (items.length === 0) return "";
  if (items.length === 1) return items[0];
  return `${items.slice(0, -1).join(", ")} ${conjunction} ${items[items.length - 1]}`;
}

/** Short county names from config, ready for a sentence. */
export const countyList = joinList(serviceAreas.map((area) => area.shortName));

/** 0-based index → "01", "02", ... */
export function padIndex(index: number): string {
  return String(index + 1).padStart(2, "0");
}
