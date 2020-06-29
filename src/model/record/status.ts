export const statuses = ["unknown", "success", "pending", "running", "error"] as const;
export type Status = typeof statuses[number];

export const reportExecStrStatuses: { [key: string]: Status } = {
  "": "pending",
  RUNNING: "running",
  SUCCESS: "success",
  FAILED: "error",
} as const;

export const statusDisplayNames: { [key in Status]: string } = {
  unknown: "Unknown",
  pending: "Pending",
  running: "Running",
  success: "Success",
  error: "Error",
} as const;

export const statusColors: { [key in Status]: string } = {
  unknown: "grey",
  pending: "purple",
  running: "blue",
  success: "green",
  error: "red",
} as const;

export const statusIndices: { [key in Status]: number } = {
  unknown: -1,
  success: 0,
  pending: 1,
  running: 2,
  error: 3,
} as const;
