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
    const depositedValueInUsd = Number(formatEther(userInfo.ethDepositAmount + userInfo.ethRewardAmount)) * ethPriceInUsd + Number(formatUnits(userInfo.usdtDepositAmount + userInfo.usdtDepositAmount, USDC_DECIMAL)) * usdcPriceInUsd
    const borrowedValueInUsd = Number(formatEther(userInfo.ethBorrowAmount + userInfo.ethInterestAmount)) * ethPriceInUsd + Number(formatUnits(userInfo.usdtBorrowAmount + userInfo.usdtInterestAmount, USDC_DECIMAL)) * usdcPriceInUsd

    return borrowedValueInUsd / (depositedValueInUsd * 0.9)
  }, [userInfo, ethPriceInUsd, usdcPriceInUsd])

  //  ----------------------------------------------------------------------------------------

  

  //  ----------------------------------------------------------------------------------------

  return (
    <Tr>
      {/* User */}
      <Td className="!text-blue-500">{getVisibleWalletAddress(userInfo.accountAddress)}</Td>

      {/* Borrowed Asset(s) */}
      <Td>
        <div className="flex justify-center">
          {userInfo.ethBorrowAmount && userInfo.usdtBorrowAmount ? (
            <div className="relative">
              <img src="/assets/images/usdc.png" alt="" className="w-10" />
              <img src="/assets/images/ethereum.png" alt="" className="absolute top-0 left-[50%] w-10" />
            </div>
          ) : !userInfo.ethBorrowAmount && userInfo.usdtBorrowAmount ? (
            <img src="/assets/images/usdc.png" alt="" className="w-10" />
          ) : (
            <img src="/assets/images/ethereum.png" alt="" className="w-10" />
          )}
        </div>
      </Td>

      {/* Borrowed Value */}
      <Td>
        {userInfo.ethBorrowAmount && userInfo.usdtBorrowAmount ? (
          <div className="flex flex-col gap-1">
            <span className="uppercase">{Number(formatEther(userInfo.ethBorrowAmount)).toFixed(4)} ETH</span>
            <span className="uppercase">{Number(formatUnits(userInfo.usdtBorrowAmount, USDC_DECIMAL)).toFixed(4)} USDC</span>
          </div>
        ) : !userInfo.ethBorrowAmount && userInfo.usdtBorrowAmount ? (
          <span className="uppercase">{Number(formatUnits(userInfo.usdtBorrowAmount, USDC_DECIMAL)).toFixed(4)} USDC</span>
        ) : (
          <span className="uppercase">{Number(formatEther(userInfo.ethBorrowAmount)).toFixed(4)} ETH</span>
        )}
      </Td>

      {/* Deposited Asset(s) */}
      <Td>
        <div className="flex justify-center">
          {userInfo.ethDepositAmount && userInfo.usdtDepositAmount ? (
            <div className="relative">
              <img src="/assets/images/usdc.png" alt="" className="w-10" />
              <img src="/assets/images/ethereum.png" alt="" className="absolute top-0 right-[50%] w-10" />
            </div>
          ) : !userInfo.ethDepositAmount && userInfo.usdtDepositAmount ? (
            <img src="/assets/images/usdc.png" alt="" className="w-10" />
          ) : (
            <img src="/assets/images/ethereum.png" alt="" className="w-10" />
          )}
        </div>
      </Td>

      {/* Deposited Value */}
      <Td>
        {userInfo.ethDepositAmount && userInfo.usdtDepositAmount ? (
          <div className="flex flex-col gap-1">
            <span className="uppercase">{Number(formatEther(userInfo.ethDepositAmount)).toFixed(4)} ETH</span>
            <span className="uppercase">{Number(formatUnits(userInfo.usdtDepositAmount, USDC_DECIMAL)).toFixed(4)} USDC</span>
          </div>
        ) : !userInfo.ethDepositAmount && userInfo.usdtDepositAmount ? (
          <span className="uppercase">{Number(formatUnits(userInfo.usdtDepositAmount, USDC_DECIMAL)).toFixed(4)} USDC</span>
        ) : (
          <span className="uppercase">{Number(formatEther(userInfo.ethDepositAmount)).toFixed(4)} ETH</span>
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