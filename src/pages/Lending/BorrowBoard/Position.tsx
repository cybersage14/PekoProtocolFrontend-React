import { useEffect, useState } from "react";
import { formatEther, formatUnits } from "viem";
import { IAsset, IUserInfo } from "../../../utils/interfaces";

//  --------------------------------------------------------------------------------------------

interface IProps {
  asset: IAsset;
  ethPriceInUsd: number;
  usdcPriceInUsd: number;
  userInfo: IUserInfo;
}

//  --------------------------------------------------------------------------------------------

export default function Position({ asset, ethPriceInUsd, usdcPriceInUsd, userInfo }: IProps) {
  const [assetAmount, setAssetAmount] = useState<number>(0)
  const [assetAmountInUsd, setAssetAmountInUsd] = useState<number>(0)

  useEffect(() => {
    let _assetAmount = 0;
    if (asset.symbol === 'eth') {
      _assetAmount = Number(formatEther(userInfo.ethBorrowAmount)) + Number(formatEther(userInfo.ethRewardAmount))
      setAssetAmount(_assetAmount)
      setAssetAmountInUsd(_assetAmount * ethPriceInUsd)
    } else {
      _assetAmount = Number(formatUnits(userInfo.usdtBorrowAmount, asset.decimals)) + Number(formatUnits(userInfo.usdtRewardAmount, asset.decimals))
      setAssetAmount(_assetAmount)
      setAssetAmountInUsd(_assetAmount * usdcPriceInUsd)
    }
  }, [asset])

  return (
    <div className="p-4 flex items-center justify-between text-gray-100">
      <div key={asset.id} className="flex items-center gap-2">
        <img src={asset.imgSrc} alt="" className="w-10" />
        <div className="flex flex-col">
          <span className="font-semibold uppercase">{asset.symbol}</span>
          <span className="text-sm text-gray-500">${asset.symbol === 'eth' ? ethPriceInUsd.toFixed(2) : usdcPriceInUsd.toFixed(2)}</span>
        </div>
      </div>
      <div className="flex flex-col items-end">
        <span className="font-semibold uppercase">
          {assetAmount.toFixed(4)} {asset.symbol}
        </span>
        <span className="text-sm text-gray-500">
          ${assetAmountInUsd.toFixed(2)}
        </span>
      </div>
    </div>
  )
}