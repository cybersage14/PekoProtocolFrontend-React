import { ReactNode } from "react";

export interface IPropsOfComponent {
  className?: string;
  children?: ReactNode | string;
  [key: string]: any;
}

export interface IToken {
  id: number;
  name: string;
  symbol: string;
  imgSrc: string;
  depositedAmount: number;
  tokenAddress?: string;
}

export interface IChain {
  id: number;
  imgSrc: string;
  name: string;
}
