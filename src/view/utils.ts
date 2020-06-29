export const range = (len) => [...Array(len).keys()];

export const percent = (x: number) => `${x}%`;
export const px = (x: number) => `${x}px`;

export const quantile = (
  arr: Array<number>, // sorted
  q: number
): number => {
  // taken from https://stackoverflow.com/a/55297611
  const position = (arr.length - 1) * q;
  const i = Math.floor(position);
  const remainder = position - i;
  if (arr[i + 1] !== undefined) {
    return arr[i] + remainder * (arr[i + 1] - arr[i]);
  } else {
    return arr[i];
  }
};
