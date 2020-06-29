import { ImgType } from "./record";

const delimiter = "/";

export function keyPath(...args: (string | null)[]): string {
  let acc = args.shift();
  for (const tag of args) {
    acc += delimiter;
    if (tag !== null) {
      acc += tag;
    }
  }
  return acc;
}
