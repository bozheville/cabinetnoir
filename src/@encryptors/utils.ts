export const rotate = (input: string, n: number): string =>
  `${input.slice(input.length - n)}${input.slice(0, input.length - n)}`;

