import { useMemo } from "react";
import { useContractRead } from "wagmi";
import { formatUnits } from "viem";
import Td from "../../../components/tableComponents/Td";
import { IAsset, IReturnValueOfAllowance } from "../../../utils/interfaces"
import { POOL_CONTRACT_ABI, POOL_CONTRACT_ADDRESS } from "../../../utils/constants";
import FilledButton from "../../../components/buttons/FilledButton";

//  ---------------------------------------------------------------------------------------------

interface IProps {
  asset: IAsset;
  ethPriceInUsd: number;
  usdcPriceInUsd: number;
  openDialog: Function;
}

//  ---------------------------------------------------------------------------------------------

export default function DPRow({ asset, ethPriceInUsd, usdcPriceInUsd, openDialog }: IProps) {
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
    <tr>
      {/* Token */}
      <Td>
        <div className="flex items-center gap-2">
          <img src={asset.imgSrc} alt={asset.name} className="w-10" />
          <span className="font-bold uppercase">{asset.symbol}</span>
        </div>
      </Td>

      {/* Profit */}
      <Td className="uppercase">{profit} {asset.symbol}</Td>

      {/* Profit in USD */}
      <Td>${profitInUsd.toFixed(2)}</Td>

      <Td>
        <FilledButton
          onClick={() => openDialog(asset)}
        >
          Claim
        </FilledButton>
      </Td>
    </tr>
  )
}