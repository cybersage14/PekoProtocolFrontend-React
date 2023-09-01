import { useMemo } from "react";
import { useContractRead } from "wagmi";
import { formatUnits } from "viem";
import { IAsset, IReturnValueOfAllowance } from "../../../utils/interfaces";
import { POOL_CONTRACT_ABI, POOL_CONTRACT_ADDRESS } from "../../../utils/constants";
import FilledButton from "../../../components/buttons/FilledButton";

//  -------------------------------------------------------------------------------------------------------

interface IProps {
  asset: IAsset;
  ethPriceInUsd: number;
  usdcPriceInUsd: number;
  openDialog: Function;
}

//  -------------------------------------------------------------------------------------------------------

export default function MBRow({ asset, ethPriceInUsd, usdcPriceInUsd, openDialog }: IProps) {
  const { data: profitInBigint }: IReturnValueOfAllowance = useContractRead({
    address: POOL_CONTRACT_ADDRESS,
    abi: POOL_CONTRACT_ABI,
    functionName: 'getProfit',
    args: [asset.contractAddress],
    watch: true
  })

  //  ----------------------------------------------------------------------

  const profit = useMemo<number>(() => {
    if (profitInBigint) {
      return Number(formatUnits(profitInBigint, asset.decimals))
    }
    return 0
  }, [profitInBigint])

  const profitInUsd = useMemo<number>(() => {
    if (asset.symbol === 'eth') {
      return profit * ethPriceInUsd
    }
    return profit * usdcPriceInUsd
  }, [profit])

  //  ----------------------------------------------------------------------

  return (
    <div className="flex flex-col gap-4 text-gray-100 border-b border-gray-800 pb-6">
      {/* Token */}
      <div className="flex justify-between w-full">
        <span className="text-gray-500 font-bold">Token: </span>
        <div className="flex items-center gap-2">
          <img src="/assets/images/logo.png" alt="" className="w-8" />
          <span className="font-semibold uppercase">{asset.symbol}</span>
        </div>
      </div>

      {/* Profit */}
      <div className="flex justify-between w-full">
        <span className="text-gray-500 font-bold">Profit: </span>
        <span>{profit} {asset.symbol}</span>
      </div>

      {/* Profit in USD */}
      <div className="flex justify-between w-full">
        <span className="text-gray-500 font-bold">Profit in USD: </span>
        <span>${profitInUsd.toFixed(2)}</span>
      </div>

      <div className="flex justify-between w-full">
        <span className="text-gray-500 font-bold">Profit in USD: </span>
        <FilledButton onClick={() => openDialog(asset)}>
          Claim
        </FilledButton>
      </div>
    </div>
  )
}