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

export interface IUserInfo {
  ethDepositAmount: bigint;
  usdtDepositAmount: bigint;
  ethBorrowAmount: bigint;
  usdtBorrowAmount: bigint;
  ethInterestAmount: bigint;
  usdtInterestAmount: bigint;
  ethRewardAmount: bigint;
  usdtRewardAmount: bigint;
  pekoRewardAmount: bigint;
  ethDepositTotalInUsdtAmount: bigint;
  usdtDepositTotalAmount: bigint;
  ethBorrowTotalInUsdtAmount: bigint;
  usdtBorrowTotalAmount: bigint;
  accountAddress: string;
}

export interface IReturnValueOfUserInfo {
  data?: IUserInfo;
  [key: string]: any;
}

export interface IBalanceData {
  decimals: number;
  formatted: string;
  symbol: string;
  value: bigint;
}

export interface IReturnValueOfBalance {
  data?: IBalanceData;
  [key: string]: any;
}

export interface IReturnValueOfListOfUsers {
  data?: Array<IUserInfo>;
  [key: string]: any;
}

export interface IReturnValueOfCalcTokenPrice {
  data?: number;
  [key: string]: any;
}
