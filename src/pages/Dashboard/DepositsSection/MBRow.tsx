import { useMemo } from "react";
import { useAccount, useBalance } from "wagmi";
import { ListItem } from "@material-tailwind/react";
import { IAsset, IReturnValueOfBalance } from "../../../utils/interfaces";
import { USDC_CONTRACT_ADDRESS } from "../../../utils/constants";

//  ----------------------------------------------------------------------------------

interface IProps {
  asset: IAsset;
  ethPriceInUsd: number;
  usdcPriceInUsd: number;
}

//  ----------------------------------------------------------------------------------

export default function MBRow({ asset, ethPriceInUsd, usdcPriceInUsd }: IProps) {
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

  //  ------------------------------------------------------------------------------------------

  return (
    <div
      className="flex flex-col gap-4 text-gray-100 border-b border-gray-800 rounded-none pb-6"
    >
      {/* Symbol */}
      <div className="flex justify-between w-full">
        <span className="text-gray-500 font-bold">Symbol: </span>
        <div className="flex items-center gap-2">
          <img src={asset.imgSrc} alt="" className="w-10" />
          <span className="font-semibold uppercase">{asset.symbol}</span>
        </div>
      </div>

      {/* Balance */}
      <div className="flex justify-between w-full">
        <span className="text-gray-500 font-bold">Balance: </span>
        <span>{Number(balanceData?.formatted).toFixed(4)} {asset.symbol}</span>
      </div>

      {/* Price */}
      <div className="flex justify-between w-full">
        <span className="text-gray-500 font-bold">Price: </span>
        <span>${asset.symbol === 'eth' ? ethPriceInUsd.toFixed(2) : usdcPriceInUsd.toFixed(2)}</span>
      </div>

      {/* Value */}
      <div className="flex justify-between w-full">
        <span className="text-gray-500 font-bold">Value: </span>
        <span>${balanceInUsd.toFixed(2)}</span>
      </div>
    </div>
  )
}