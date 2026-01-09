export function inferTemplate(domain: string) {
  if (domain === "react") return "react";
  if (domain === "react-ts") return "react-ts";
  return "vanilla";
}
