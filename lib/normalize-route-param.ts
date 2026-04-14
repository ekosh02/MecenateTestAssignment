export const normalizeRouteParam = (
  raw: string | string[] | undefined,
): string | undefined =>
  typeof raw === "string"
    ? raw
    : Array.isArray(raw) && raw.length > 0
      ? raw[0]
      : undefined;
