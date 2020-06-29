export const entities = [
  "subject",
  "suffix",
  "task",
  "session",
  "run",
  "direction",
  "type",
] as const;
export type Entity = typeof entities[number];

export function isEntity(s: string): s is Entity {
  return ((entities as any) as string[]).includes(s);
}

export const entityDisplayNames: { [key in Entity]: string } = {
  subject: "Subject",
  suffix: "Suffix",
  task: "Task",
  session: "Session",
  run: "Run",
  direction: "Direction",
  type: "Image type",
} as const;

export const entityColors: { [key in Entity]: string } = {
  subject: "red",
  suffix: "grey",
  task: "green",
  session: "magenta",
  run: "cyan",
  direction: "yellow",
  type: "blue",
} as const;
