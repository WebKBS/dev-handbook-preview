/** import 파일들을 raw 텍스트로 불러옵니다. */
export const RAW = import.meta.glob(
  "../../previews/**/*.{html,css,js,jsx,ts,tsx,json,md}",
  { as: "raw", eager: true },
) as Record<string, string>;
