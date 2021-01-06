export const statuses = ["pending", "success", "error"] as const;
export type Status = typeof statuses[number];

export const reportExecStrStatuses: { [key: string]: Status } = {
  SUCCESS: "success",
  FAILED: "error",
} as const;

export const statusDisplayNames: { [key in Status]: string } = {
  pending: "Pending",
  success: "Success",
  error: "Error",
} as const;

export const statusColors: { [key in Status]: string } = {
  pending: "purple",
  success: "green",
  error: "red",
} as const;

export const statusIndices: { [key in Status]: number } = {
  success: 0,
  pending: 1,
  error: 3,
} as const;
