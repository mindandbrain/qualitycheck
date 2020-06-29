import { ImgType } from "./img-type";

export const valTypes = ["mean_fd", "fd_gt_0_5", "aroma_noise_frac", "mean_gm_tsnr"] as const;
export type ValType = typeof valTypes[number];

export function isValType(s: string): s is ValType {
  return ((valTypes as any) as string[]).includes(s);
}

export const valTypeDisplayNames: { [key in ValType]: string } = {
  mean_fd: "Mean framewise displacement",
  fd_gt_0_5: "% frames with framewise displacement > 0.5",
  aroma_noise_frac: "% ICs classified as noise",
  mean_gm_tsnr: "Mean gray matter tSNR",
} as const;

export const valTypeUnits: { [key in ValType]: string } = {
  mean_fd: "mm",
  fd_gt_0_5: "%",
  aroma_noise_frac: "%",
  mean_gm_tsnr: "AU",
} as const;

export const valTypeImgTypes: { [key in ValType]: ImgType } = {
  mean_fd: 3,
  fd_gt_0_5: 3,
  aroma_noise_frac: 4,
  mean_gm_tsnr: 2,
} as const;
