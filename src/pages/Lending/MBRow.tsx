import { useMemo } from "react";
import { useContractRead } from "wagmi";
import { ListItem } from "@material-tailwind/react";
import { IAssetMetadata, IBalanceData, IReturnValueOfPoolInfo } from "../../utils/interfaces";
import { POOL_CONTRACT_ABI, POOL_CONTRACT_ADDRESS } from "../../utils/constants";

//  ----------------------------------------------------------------------------------

interface IProps {
  asset: IAssetMetadata;
  openDialog: Function;
  ethPriceInUsd: number;
  usdcPriceInUsd: number;
  balanceData?: IBalanceData;
}

//  ----------------------------------------------------------------------------------

export default function MBRow({ asset, openDialog, ethPriceInUsd, usdcPriceInUsd, balanceData }: IProps) {
  const { data: poolInfo }: IReturnValueOfPoolInfo = useContractRead({
    address: POOL_CONTRACT_ADDRESS,
    abi: POOL_CONTRACT_ABI,
    functionName: 'getPoolInfo',
    args: [asset.contractAddress]
  })

  //  ----------------------------------------------------------------------------------

  const marketSizeInUsd = useMemo<number>(() => {
    if (poolInfo) {
      return Number(poolInfo.totalAmount) * (asset.symbol === 'eth' ? ethPriceInUsd : usdcPriceInUsd);
    }
    return 0
  }, [poolInfo])

  const totalBorrowedInUsd = useMemo<number>(() => {
    if (poolInfo) {
      return Number(poolInfo.borrowAmount) * (asset.symbol === 'eth' ? ethPriceInUsd : usdcPriceInUsd)
    }
    return 0
  }, [poolInfo])

  const balanceInUsd = useMemo<number>(() => {
    if (balanceData) {
      return Number(balanceData.formatted) * (asset.symbol === 'eth' ? ethPriceInUsd : usdcPriceInUsd);
    }
    return 0
  }, [balanceData])

  //  ----------------------------------------------------------------------------------

  return (
    <ListItem
      key={asset.id}
      className="flex-col gap-2 text-gray-100 border-b border-gray-800 rounded-none"
      onClick={() => openDialog(asset.symbol)}
    >
      {/* Asset name */}
      <div className="flex justify-between w-full">
        <span className="text-gray-500 font-bold">Asset Name: </span>
        <div className="flex items-center gap-2">
          <img src={asset.imgSrc} alt="" className="w-10" />
          <div className="flex flex-col">
            <span className="font-semibold">{asset.name}</span>
            <span className="text-sm text-gray-500">
              ${asset.symbol === 'eth' ? ethPriceInUsd.toFixed(4) : usdcPriceInUsd.toFixed(4)}
            </span>
          </div>
        </div>
      </div>

      {/* LTV */}
      <div className="flex justify-between w-full">
        <span className="text-gray-500 font-bold">LTV: </span>
        <span>{Number(poolInfo?.LTV)}%</span>
      </div>

      {/* Deposit APY */}
      <div className="flex justify-between w-full">
        <span className="text-gray-500 font-bold">Deposit APY: </span>
        <span className="text-green-500">{Number(poolInfo?.depositApy)}%</span>
      </div>

      {/* Market size */}
      <div className="flex justify-between w-full">
        <span className="text-gray-500 font-bold">Market size: </span>
        <div className="flex flex-col">
          <span className="font-semibold uppercase">{Number(poolInfo?.totalAmount)} {asset.symbol}</span>
          <span className="text-sm text-gray-500">${marketSizeInUsd.toFixed(4)}</span>
        </div>
      </div>

      {/* Borrow APY */}
      <div className="flex justify-between w-full">
        <span className="text-gray-500 font-bold">Borrow APY: </span>
        <span className="text-red-500">{Number(poolInfo?.borrowApy)}%</span>
      </div>

      {/* Total Borrowed */}
      <div className="flex justify-between w-full">
        <span className="text-gray-500 font-bold">Total Borrowed: </span>
        <div className="flex flex-col">
          <span className="font-semibold uppercase">{Number(poolInfo?.borrowAmount)} {asset.symbol}</span>
          <span className="text-sm text-gray-500">${totalBorrowedInUsd.toFixed(4)}</span>
        </div>
      </div>

      {/* Wallet */}
      <div className="flex justify-between w-full">
        <span className="text-gray-500 font-bold">Wallet: </span>
        <div className="flex flex-col">
          <span className="font-semibold uppercase">{balanceData?.formatted ? Number(balanceData.formatted).toFixed(4) : 0} {asset.symbol}</span>
          <span className="text-sm text-gray-500">${balanceInUsd.toFixed(4)}</span>
        </div>
      </div>
    </ListItem>
  )
}