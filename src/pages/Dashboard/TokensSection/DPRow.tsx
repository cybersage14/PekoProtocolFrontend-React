import { useMemo } from "react";
import { useAccount, useBalance } from "wagmi";
import Td from "../../../components/tableComponents/Td";
import { IAsset, IReturnValueOfBalance } from "../../../utils/interfaces";
import { USDC_CONTRACT_ADDRESS } from "../../../utils/constants";

//  ------------------------------------------------------------------------------------------------

interface IProps {
  asset: IAsset;
  ethPriceInUsd: number;
  usdcPriceInUsd: number;
}

//  ------------------------------------------------------------------------------------------------

export default function DPRow({ asset, ethPriceInUsd, usdcPriceInUsd }: IProps) {
  const { address } = useAccount()

  //  Balance data
  const { data: balanceData }: IReturnValueOfBalance = useBalance({
    address,
    token: asset.symbol === 'usdc' ? USDC_CONTRACT_ADDRESS : undefined
  })

  const balanceInUsd = useMemo<number>(() => {
    if (balanceData) {
      return Number(balanceData.formatted) * (asset.symbol === 'eth' ? ethPriceInUsd : usdcPriceInUsd);
    }
    return 0
  }, [balanceData])

  return (
    <tr>
      <Td>
        <div className="flex items-center gap-2">
          <img src={asset.imgSrc} alt="" className="w-10" />
          <span className="font-bold uppercase">{asset.symbol}</span>
        </div>
      </Td>
      <Td className="uppercase">
        {Number(balanceData?.formatted).toFixed(4)} {asset.symbol}
      </Td>
      <Td>
        $ {asset.symbol === 'eth' ? ethPriceInUsd.toFixed(2) : usdcPriceInUsd.toFixed(2)}
      </Td>
      <Td>${balanceInUsd.toFixed(2)}</Td>
    </tr>
  )
}