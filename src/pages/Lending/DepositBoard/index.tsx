import { lazy, useMemo } from "react";
import PrimaryBoard from "../../../components/boards/PrimaryBoard";
import { ASSETS, USDC_DECIMAL } from "../../../utils/constants";
import { IUserInfo } from "../../../utils/interfaces";
import { formatEther, formatUnits } from "viem";

//  ----------------------------------------------------------------------------------------------

const Position = lazy(() => import('./Position'))

//  ----------------------------------------------------------------------------------------------

interface IProps {
  ethPriceInUsd: number;
  usdcPriceInUsd: number;
  userInfo: IUserInfo;
}

//  ----------------------------------------------------------------------------------------------

export default function DepositBoard({ userInfo, ethPriceInUsd, usdcPriceInUsd }: IProps) {
  const totalAmountInUsd = useMemo<number>(() => {
    const ethAmountInUsd = Number(formatEther(userInfo.ethDepositAmount)) * ethPriceInUsd;
    const usdcAmountInUsd = Number(formatUnits(userInfo.usdtDepositAmount, USDC_DECIMAL)) * usdcPriceInUsd;
    return ethAmountInUsd + usdcAmountInUsd
  }, [userInfo])

  return (
    <PrimaryBoard title="Deposits" action={<span className="text-gray-100">${totalAmountInUsd.toFixed(2)}</span>}>
      <div className="flex flex-col">
        {ASSETS.map(asset => (
          <Position key={asset.id} asset={asset} userInfo={userInfo} ethPriceInUsd={ethPriceInUsd} usdcPriceInUsd={usdcPriceInUsd} />
        ))}
      </div>
    </PrimaryBoard>
  )
}