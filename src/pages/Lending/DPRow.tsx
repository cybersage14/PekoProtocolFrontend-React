import { useContractRead } from "wagmi";
import Td from "../../components/tableComponents/Td";
import Tr from "../../components/tableComponents/Tr";
import { IAssetMetadata, IBalanceData, IReturnValueOfCalcTokenPrice, IReturnValueOfPoolInfo } from "../../utils/interfaces";
import { POOL_CONTRACT_ABI, POOL_CONTRACT_ADDRESS, USDC_DECIMAL, WETH_CONTRACT_ADDRESS } from "../../utils/constants";
import { formatEther, formatUnits, parseEther } from "viem";
import { useMemo } from "react";

//  ----------------------------------------------------------------------------------

interface IProps {
  asset: IAssetMetadata;
  openDialog: Function;
  ethPriceInUsd: number;
  usdcPriceInUsd: number;
  balanceData?: IBalanceData;
}

//  ----------------------------------------------------------------------------------

export default function DPRow({ asset, openDialog, ethPriceInUsd, usdcPriceInUsd, balanceData }: IProps) {

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
    <Tr className="hover:bg-gray-900" onClick={() => openDialog(asset.symbol)}>
      <Td>
        <div className="flex items-center gap-2">
          <img src={asset.imgSrc} alt="" className="w-10" />
          <div className="flex flex-col">
            <span className="font-semibold">{asset.name}</span>
            <span className="text-sm text-gray-500">
              ${asset.symbol === 'eth' ? ethPriceInUsd.toFixed(4) : usdcPriceInUsd.toFixed(4)}
            </span>
          </div>
        </div>
      </Td>
      <Td>{Number(poolInfo?.LTV)}%</Td>
      <Td className="text-green-500">{Number(poolInfo?.depositApy)}%</Td>
      <Td>
        <div className="flex flex-col">
          <span className="font-semibold uppercase">{Number(poolInfo?.totalAmount)} {asset.symbol}</span>
          <span className="text-sm text-gray-500">${marketSizeInUsd.toFixed(4)}</span>
        </div>
      </Td>
      <Td className="text-red-500">{Number(poolInfo?.borrowApy)}%</Td>
      <Td>
        <div className="flex flex-col">
          <span className="font-semibold uppercase">{Number(poolInfo?.borrowAmount)} {asset.symbol}</span>
          <span className="text-sm text-gray-500">${totalBorrowedInUsd.toFixed(4)}</span>
        </div>
      </Td>
      <Td>
        <div className="flex flex-col">
          <span className="font-semibold uppercase">{balanceData?.formatted ? Number(balanceData.formatted) : 0} {asset.symbol}</span>
          <span className="text-sm text-gray-500">${balanceInUsd.toFixed(4)}</span>
        </div>
      </Td>
    </Tr>
  )
}