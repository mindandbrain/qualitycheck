export const viewTypes = ["charts", "explore", "zoom"] as const;
export type ViewType = typeof viewTypes[number];

export function isViewType(s: string): s is ViewType {
  return ((viewTypes as any) as string[]).includes(s);
}

export const viewTypeDisplayNames: { [key in ViewType]: string } = {
  charts: "Charts",
  explore: "Explore reports",
  zoom: "Report detail view",
} as const;
