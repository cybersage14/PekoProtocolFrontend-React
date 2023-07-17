import { useEffect, useMemo, useState } from "react";
import { useAccount, useBalance, useContractRead } from "wagmi";
import { ListItem } from "@material-tailwind/react";
import { IAsset, IBalanceData, IReturnValueOfBalance, IReturnValueOfPoolInfo } from "../../utils/interfaces";
import { APY_DECIMAL, POOL_CONTRACT_ABI, POOL_CONTRACT_ADDRESS, USDC_CONTRACT_ADDRESS } from "../../utils/constants";
import { formatEther, formatUnits } from "viem";

//  ----------------------------------------------------------------------------------

interface IProps {
  asset: IAsset;
  openDialog: Function;
  ethPriceInUsd: number;
  usdcPriceInUsd: number;
  balanceData?: IBalanceData;
}

//  ----------------------------------------------------------------------------------

export default function MBRow({ asset, openDialog, ethPriceInUsd, usdcPriceInUsd }: IProps) {
  const [marketSize, setMarketSize] = useState<number>(0)
  const [marketSizeInUsd, setMarketSizeInUsd] = useState<number>(0)
  const [totalBorrowed, setTotalBorrowed] = useState<number>(0)
  const [totalBorrowedInUsd, setTotalBorrowedInUsd] = useState<number>(0)
  const [depositApyInPercentage, setDepositApyInPercentage] = useState<number>(0)
  const [borrowApyInPercentage, setBorrowApyInPercentage] = useState<number>(0)

  //  ---------------------------------------------------------------------------------

  const { address, isConnected } = useAccount()

  //  ---------------------------------------------------------------------------------

  //  Balance data
  const { data: balanceData }: IReturnValueOfBalance = useBalance({
    address,
    token: asset.symbol === 'usdc' ? USDC_CONTRACT_ADDRESS : undefined,
    watch: true
  })

  const { data: poolInfo }: IReturnValueOfPoolInfo = useContractRead({
    address: POOL_CONTRACT_ADDRESS,
    abi: POOL_CONTRACT_ABI,
    functionName: 'getPoolInfo',
    args: [asset.contractAddress],
    watch: true
  })

  //  ----------------------------------------------------------------------------------

  const balanceInUsd = useMemo<number>(() => {
    if (balanceData) {
      return Number(balanceData.formatted) * (asset.symbol === 'eth' ? ethPriceInUsd : usdcPriceInUsd);
    }
    return 0
  }, [balanceData])


  //  ----------------------------------------------------------------------------------

  useEffect(() => {
    if (poolInfo) {
      if (asset.symbol === 'eth') {
        setMarketSize(Number(formatEther(poolInfo.totalAmount)))
        setMarketSizeInUsd(Number(formatEther(poolInfo.totalAmount)) * ethPriceInUsd)
        setTotalBorrowed(Number(formatEther(poolInfo.borrowAmount)))
        setTotalBorrowedInUsd(Number(formatEther(poolInfo.borrowAmount)) * ethPriceInUsd)
      } else {
        setMarketSize(Number(formatUnits(poolInfo.totalAmount, asset.decimals)))
        setMarketSizeInUsd(Number(formatUnits(poolInfo.totalAmount, asset.decimals)) * usdcPriceInUsd)
        setTotalBorrowed(Number(formatUnits(poolInfo.borrowAmount, asset.decimals)))
        setTotalBorrowedInUsd(Number(formatUnits(poolInfo.borrowAmount, asset.decimals)) * usdcPriceInUsd)
      }
      setDepositApyInPercentage(Number(formatUnits(poolInfo.depositApy, APY_DECIMAL)))
      setBorrowApyInPercentage(Number(formatUnits(poolInfo.borrowApy, APY_DECIMAL)))
    } else {
      setMarketSize(0)
      setMarketSizeInUsd(0)
      setTotalBorrowed(0)
      setTotalBorrowedInUsd(0)
    }
  }, [poolInfo, asset])

  //  ----------------------------------------------------------------------------------

  return (
    <ListItem
      key={asset.id}
      className="flex-col gap-2 text-gray-100 border-b border-gray-800 rounded-none"
      onClick={() => openDialog(asset)}
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
        <span className="text-green-500">{depositApyInPercentage.toFixed(2)}%</span>
      </div>

      {/* Market size */}
      <div className="flex justify-between w-full">
        <span className="text-gray-500 font-bold">Market size: </span>
        <div className="flex flex-col">
          <span className="font-semibold uppercase">{marketSize.toFixed(4)} {asset.symbol}</span>
          <span className="text-sm text-gray-500">${marketSizeInUsd.toFixed(4)}</span>
        </div>
      </div>

      {/* Borrow APY */}
      <div className="flex justify-between w-full">
        <span className="text-gray-500 font-bold">Borrow APY: </span>
        <span className="text-red-500">{borrowApyInPercentage.toFixed(2)}%</span>
      </div>

      {/* Total Borrowed */}
      <div className="flex justify-between w-full">
        <span className="text-gray-500 font-bold">Total Borrowed: </span>
        <div className="flex flex-col">
          <span className="font-semibold uppercase">{totalBorrowed.toFixed(4)} {asset.symbol}</span>
          <span className="text-sm text-gray-500">${totalBorrowedInUsd.toFixed(4)}</span>
        </div>
      </div>

      {/* Wallet */}
      {isConnected && (
        <div className="flex justify-between w-full">
          <span className="text-gray-500 font-bold">Wallet: </span>
          <div className="flex flex-col">
            <span className="font-semibold uppercase">{balanceData?.formatted ? Number(balanceData.formatted).toFixed(4) : 0} {asset.symbol}</span>
            <span className="text-sm text-gray-500">${balanceInUsd.toFixed(4)}</span>
          </div>
        </div>
      )}

    </ListItem>
  )
}