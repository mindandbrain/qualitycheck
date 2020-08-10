export const entities = ["sub", "suffix", "task", "ses", "run", "dir", "type"] as const;
export type Entity = typeof entities[number];

export function isEntity(s: string): s is Entity {
  return ((entities as any) as string[]).includes(s);
}

export const entityDisplayNames: { [key in Entity]: string } = {
  sub: "Subject",
  suffix: "Suffix",
  task: "Task",
  ses: "Session",
  run: "Run",
  dir: "Phase encoding direction",
  type: "Image type",
} as const;

export const entityColors: { [key in Entity]: string } = {
  sub: "red",
  suffix: "grey",
  task: "green",
  ses: "magenta",
  run: "cyan",
  dir: "yellow",
  type: "blue",
} as const;
