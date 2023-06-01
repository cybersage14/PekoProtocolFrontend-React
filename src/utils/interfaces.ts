import { ReactNode } from "react";

export interface IPropsOfComponent {
  className?: string;
  children?: ReactNode | string;
  [key: string]: any;
}
