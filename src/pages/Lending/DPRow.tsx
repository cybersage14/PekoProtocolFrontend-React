import { useEffect, useMemo, useState } from "react";
import { useAccount, useBalance, useContractRead } from "wagmi";
import { formatEther, formatUnits } from "viem";
import Td from "../../components/tableComponents/Td";
import Tr from "../../components/tableComponents/Tr";
import { IAsset, IReturnValueOfBalance, IReturnValueOfPoolInfo } from "../../utils/interfaces";
import { APY_DECIMAL, POOL_CONTRACT_ABI, POOL_CONTRACT_ADDRESS, USDC_CONTRACT_ADDRESS } from "../../utils/constants";

//  ----------------------------------------------------------------------------------

interface IProps {
  asset: IAsset;
  openDialog: Function;
  ethPriceInUsd: number;
  usdcPriceInUsd: number;
}

//  ----------------------------------------------------------------------------------

export default function DPRow({ asset, openDialog, ethPriceInUsd, usdcPriceInUsd }: IProps) {
  const [marketSize, setMarketSize] = useState<number>(0)
  const [marketSizeInUsd, setMarketSizeInUsd] = useState<number>(0)
  const [totalBorrowed, setTotalBorrowed] = useState<number>(0)
  const [totalBorrowedInUsd, setTotalBorrowedInUsd] = useState<number>(0)
  const [depositApyInPercentage, setDepositApyInPercentage] = useState<number>(0)
  const [borrowApyInPercentage, setBorrowApyInPercentage] = useState<number>(0)

  //  ---------------------------------------------------------------------------------

  const { address, isConnected } = useAccount()

  //  ---------------------------------------------------------------------------------
  //  Balance data of the wallet
  const { data: balanceDataOfWallet }: IReturnValueOfBalance = useBalance({
    address,
    token: asset.symbol === 'usdc' ? USDC_CONTRACT_ADDRESS : undefined,
    watch: true
  })

  const { data: balanceDataOfPool }: IReturnValueOfBalance = useBalance({
    address: POOL_CONTRACT_ADDRESS,
    token: asset.symbol === 'usdc' ? USDC_CONTRACT_ADDRESS : undefined,
    watch: true
  })

  //  The info of the pool
  const { data: poolInfo }: IReturnValueOfPoolInfo = useContractRead({
    address: POOL_CONTRACT_ADDRESS,
    abi: POOL_CONTRACT_ABI,
    functionName: 'getPoolInfo',
    args: [asset.contractAddress],
    watch: true
  })

  //  ----------------------------------------------------------------------------------

  const balanceOfWalletInUsd = useMemo<number>(() => {
    if (balanceDataOfWallet) {
      return Number(balanceDataOfWallet.formatted) * (asset.symbol === 'eth' ? ethPriceInUsd : usdcPriceInUsd);
    }
    return 0
  }, [balanceDataOfWallet])

  //  ----------------------------------------------------------------------------------

  useEffect(() => {
    if (poolInfo) {
      setMarketSize(Number(balanceDataOfPool?.formatted))
      if (asset.symbol === 'eth') {
        setMarketSizeInUsd(Number(balanceDataOfPool?.formatted) * ethPriceInUsd)
        setTotalBorrowed(Number(formatEther(poolInfo.borrowAmount)))
        setTotalBorrowedInUsd(Number(formatEther(poolInfo.borrowAmount)) * ethPriceInUsd)
      } else {
        setMarketSizeInUsd(Number(balanceDataOfPool?.formatted) * usdcPriceInUsd)
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
      setDepositApyInPercentage(0)
      setBorrowApyInPercentage(0)
    }
  }, [poolInfo, asset])

  //  ----------------------------------------------------------------------------------

  return (
    <Tr className="hover:bg-gray-900" onClick={() => openDialog(asset)}>
      {/* Asset Name */}
      <Td>
        <div className="flex items-center gap-2">
          <img src={asset.imgSrc} alt="" className="w-10" />
          <div className="flex flex-col">
            <span className="font-semibold">{asset.name}</span>
            <span className="text-sm text-gray-500">
              ${asset.symbol === 'eth' ? ethPriceInUsd.toFixed(2) : usdcPriceInUsd.toFixed(2)}
            </span>
          </div>
        </div>
      </Td>

      {/* LTV */}
      <Td>{Number(poolInfo?.LTV)}%</Td>

      {/* Deposit APY */}
      <Td className="text-green-500">{depositApyInPercentage.toFixed(2)}%</Td>

      {/* Market size */}
      <Td>
        <div className="flex flex-col">
          <span className="font-semibold uppercase">{marketSize.toFixed(4)} {asset.symbol}</span>
          <span className="text-sm text-gray-500">${marketSizeInUsd.toFixed(2)}</span>
        </div>
      </Td>

      {/* Borrow APY */}
      <Td className="text-red-500">{borrowApyInPercentage.toFixed(2)}%</Td>

      {/* Total Borrowed */}
      <Td>
        <div className="flex flex-col">
          <span className="font-semibold uppercase">{totalBorrowed.toFixed(4)} {asset.symbol}</span>
          <span className="text-sm text-gray-500">${totalBorrowedInUsd.toFixed(2)}</span>
        </div>
      </Td>

      {/* Wallet */}
      {isConnected && (
        <Td>
          <div className="flex flex-col">
            <span className="font-semibold uppercase">{balanceDataOfWallet?.formatted ? Number(balanceDataOfWallet.formatted).toFixed(4) : 0} {asset.symbol}</span>
            <span className="text-sm text-gray-500">${balanceOfWalletInUsd.toFixed(2)}</span>
          </div>
        </Td>
      )}
    </Tr>
  )
}