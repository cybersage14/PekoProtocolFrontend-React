import { useMemo } from "react";
import { formatEther, formatUnits } from "viem";
import Td from "../../components/tableComponents/Td";
import Tr from "../../components/tableComponents/Tr";
import { getVisibleWalletAddress } from "../../utils/functions";
import { IUserInfo } from "../../utils/interfaces"
import { USDC_DECIMAL } from "../../utils/constants";
import FilledButton from "../../components/buttons/FilledButton";

//  -----------------------------------------------------------------------------------------

interface IProps {
  userInfo: IUserInfo;
  ethPriceInUsd: number;
  usdcPriceInUsd: number;
}

//  -----------------------------------------------------------------------------------------

export default function DPRow({ userInfo, ethPriceInUsd, usdcPriceInUsd }: IProps) {
  const riskFactor = useMemo<number>(() => {
    const depositedValueInUsd = Number(formatEther(userInfo.ehtColAmount)) * ethPriceInUsd + Number(formatUnits(userInfo.usdtColAmount, USDC_DECIMAL)) * usdcPriceInUsd
    const borrowedValueInUsd = Number(formatEther(userInfo.ehtDebtAmount)) * ethPriceInUsd + Number(formatUnits(userInfo.usdtDebtAmount, USDC_DECIMAL)) * usdcPriceInUsd

    return borrowedValueInUsd / (depositedValueInUsd * 0.9)
  }, [userInfo, ethPriceInUsd, usdcPriceInUsd])

  //  ----------------------------------------------------------------------------------------



  //  ----------------------------------------------------------------------------------------

  return (
    <Tr>
      {/* User */}
      <Td className="!text-blue-500">{getVisibleWalletAddress(userInfo.userAddress)}</Td>

      {/* Borrowed Asset(s) */}
      <Td>
        <div className="flex justify-center">
          {userInfo.ehtDebtAmount && userInfo.usdtDebtAmount ? (
            <div className="relative">
              <img src="/assets/images/usdc.png" alt="" className="w-10" />
              <img src="/assets/images/ethereum.png" alt="" className="absolute top-0 left-[50%] w-10" />
            </div>
          ) : !userInfo.ehtDebtAmount && userInfo.usdtDebtAmount ? (
            <img src="/assets/images/usdc.png" alt="" className="w-10" />
          ) : (
            <img src="/assets/images/ethereum.png" alt="" className="w-10" />
          )}
        </div>
      </Td>

      {/* Borrowed Value */}
      <Td>
        {userInfo.ehtDebtAmount && userInfo.usdtDebtAmount ? (
          <div className="flex flex-col gap-1">
            <span className="uppercase">{Number(formatEther(userInfo.ehtDebtAmount)).toFixed(4)} ETH</span>
            <span className="uppercase">{Number(formatUnits(userInfo.usdtDebtAmount, USDC_DECIMAL)).toFixed(4)} USDC</span>
          </div>
        ) : !userInfo.ehtDebtAmount && userInfo.usdtDebtAmount ? (
          <span className="uppercase">{Number(formatUnits(userInfo.usdtDebtAmount, USDC_DECIMAL)).toFixed(4)} USDC</span>
        ) : (
          <span className="uppercase">{Number(formatEther(userInfo.ehtDebtAmount)).toFixed(4)} ETH</span>
        )}
      </Td>

      {/* Deposited Asset(s) */}
      <Td>
        <div className="flex justify-center">
          {userInfo.ehtColAmount && userInfo.usdtColAmount ? (
            <div className="relative">
              <img src="/assets/images/usdc.png" alt="" className="w-10" />
              <img src="/assets/images/ethereum.png" alt="" className="absolute top-0 right-[50%] w-10" />
            </div>
          ) : !userInfo.ehtColAmount && userInfo.usdtColAmount ? (
            <img src="/assets/images/usdc.png" alt="" className="w-10" />
          ) : (
            <img src="/assets/images/ethereum.png" alt="" className="w-10" />
          )}
        </div>
      </Td>

      {/* Deposited Value */}
      <Td>
        {userInfo.ehtColAmount && userInfo.usdtColAmount ? (
          <div className="flex flex-col gap-1">
            <span className="uppercase">{Number(formatEther(userInfo.ehtColAmount)).toFixed(4)} ETH</span>
            <span className="uppercase">{Number(formatUnits(userInfo.usdtColAmount, USDC_DECIMAL)).toFixed(4)} USDC</span>
          </div>
        ) : !userInfo.ehtColAmount && userInfo.usdtColAmount ? (
          <span className="uppercase">{Number(formatUnits(userInfo.usdtColAmount, USDC_DECIMAL)).toFixed(4)} USDC</span>
        ) : (
          <span className="uppercase">{Number(formatEther(userInfo.ehtColAmount)).toFixed(4)} ETH</span>
        )}
      </Td>

      {/* Risk Factor */}
      <Td className="text-red-500">
        {riskFactor.toFixed(4)} %
      </Td>

      <Td>
        <FilledButton>Liquidate</FilledButton>
      </Td>
    </Tr>
  )
}