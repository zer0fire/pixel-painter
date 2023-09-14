export function transRGBTo16(color: string) {
  const list = color.split(",");
  return `#${parseInt(list[0]).toString(16)}${parseInt(list[1]).toString(
    16
  )}${parseInt(list[2]).toString(16)}`;
}
export function transColorToRGB() {}
