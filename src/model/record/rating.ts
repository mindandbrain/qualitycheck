export const ratings = ["none", "good", "uncertain", "bad"] as const;
export type Rating = typeof ratings[number];

export function isRating(s: string): s is Rating {
  return ((ratings as any) as string[]).includes(s);
}

export const ratingDisplayNames: { [key in Rating]: string } = {
  none: "No rating",
  good: "Good",
  uncertain: "Uncertain",
  bad: "Bad",
} as const;

export const ratingColors: { [key in Rating]: string } = {
  none: "grey",
  good: "green",
  uncertain: "yellow",
  bad: "red",
} as const;

export const ratingIndices: { [key in Rating]: number } = {
  none: -1,
  good: 0,
  uncertain: 1,
  bad: 2,
} as const;
