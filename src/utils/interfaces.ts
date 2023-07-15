import { ReactNode } from "react";
import { TAssetSymbol } from "./types";

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
  symbol: TAssetSymbol;
  imgSrc: string;
  contractAddress: string;
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

export interface IPoolInfo {
  LTV: bigint;
  depositApy: bigint;
  borrowApy: bigint;
  totalAmount: bigint;
  borrowAmount: bigint;
}

export interface IBalanceData {
  decimals: number;
  formatted: string;
  symbol: string;
  value: bigint;
}

export interface IReturnValueOfUserInfo {
  data?: IUserInfo;
  [key: string]: any;
}

export interface IReturnValueOfPoolInfo {
  data?: IPoolInfo;
  [key: string]: any;
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
  data?: bigint;
  [key: string]: any;
}
