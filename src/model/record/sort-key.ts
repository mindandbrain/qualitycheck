export const sortKeys = ["type", "sub"] as const;
export type SortKey = typeof sortKeys[number];

export function isSortKey(s: string): s is SortKey {
  return ((sortKeys as any) as string[]).includes(s);
}

export const sortKeyDisplayNames: { [key in SortKey]: string } = {
  type: "Image type",
  sub: "Subject",
} as const;
