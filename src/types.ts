import type { SVGProps } from "react";

/** SVG attributes supported by every generated icon. */
export type IconProps = SVGProps<SVGSVGElement> & {
  title?: string;
  titleId?: string;
};
