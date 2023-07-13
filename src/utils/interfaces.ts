import { ReactNode } from "react";
import { TAsset } from "./types";

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

export interface ILP {
  id: number;
  token: IToken;
  coin: IToken;
  powererBrandSrc: string;
}

export interface IOption {
  id: number;
  label: string;
  value: string;
}

export interface IAssetMetadata {
  id: number;
  name: string;
  symbol: TAsset;
  imgSrc: string;
}

export interface IMetadataOfAsset {
  [key: string]: IAssetMetadata;
}
