import { parameterize, camelize, underscore } from "inflected";

export const cleaner = (s: string): string => {
  return s.replaceAll(/[^A-Za-z0-9]/g, "");
};

export const formatLikeBids = (s: string): string => {
  let fmt = s;

  fmt = fmt.replaceAll(/([A-Z])/g, " $1");

  fmt = fmt.replaceAll("<>", " vs ");
  fmt = fmt.replaceAll(">", " gt ");
  fmt = fmt.replaceAll("<", " lt ");

  fmt = fmt.replaceAll(/\s+/g, " ");

  fmt = camelize(underscore(parameterize(fmt)), false);

  return fmt;
};
