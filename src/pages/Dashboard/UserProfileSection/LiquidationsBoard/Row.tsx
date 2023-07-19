import { useEffect, useState } from "react";
import { formatEther, formatUnits } from "viem";
import Tr from "../../../../components/tableComponents/Tr";
import { ILiquidation } from "../../../../utils/interfaces";
import { USDC_DECIMAL } from "../../../../utils/constants";
import Td from "../../../../components/tableComponents/Td";
import FilledButton from "../../../../components/buttons/FilledButton";

//  -----------------------------------------------------------------------------------------

interface IProps {
  liquidation: ILiquidation;
  ethPriceInUsd: number;
  usdcPriceInUsd: number;
  openLiquidateDialog: Function;
}

//  -----------------------------------------------------------------------------------------

export default function Row({ liquidation, ethPriceInUsd, usdcPriceInUsd, openLiquidateDialog }: IProps) {
  const [borrowedValueInUsd, setBorrowedValueInUsd] = useState<number>(0)
  const [depositedValueInUsd, setDepositedValueInUsd] = useState<number>(0)

  //  ----------------------------------------------------------------------------------------

  useEffect(() => {
    const _borrowedValueInUsd = Number(formatEther(liquidation.ethBorrowAmount + liquidation.ethInterestAmount)) * ethPriceInUsd +
      Number(formatUnits(liquidation.usdtBorrowAmount + liquidation.usdtInterestAmount, USDC_DECIMAL)) * usdcPriceInUsd
    const _depositedValueInUsd = Number(formatEther(liquidation.ethDepositAmount + liquidation.ethRewardAmount)) * ethPriceInUsd +
      Number(formatUnits(liquidation.usdtDepositAmount + liquidation.usdtRewardAmount, USDC_DECIMAL)) * usdcPriceInUsd

    setBorrowedValueInUsd(_borrowedValueInUsd)
    setDepositedValueInUsd(_depositedValueInUsd)
  }, [liquidation])

  //  ----------------------------------------------------------------------------------------
  return (
    <Tr>
      {/* Borrowed Value */}
      <Td>
        {liquidation.ethBorrowAmount && liquidation.usdtBorrowAmount ? (
          <div className="flex flex-col gap-1">
            <span className="uppercase">{Number(formatEther(liquidation.ethBorrowAmount + liquidation.ethInterestAmount)).toFixed(4)} ETH</span>
            <span className="uppercase">
              {Number(formatUnits(liquidation.usdtBorrowAmount + liquidation.usdtInterestAmount, USDC_DECIMAL)).toFixed(4)} USDC
            </span>
          </div>
        ) : !liquidation.ethBorrowAmount && liquidation.usdtBorrowAmount ? (
          <span className="uppercase">
            {Number(formatUnits(liquidation.usdtBorrowAmount + liquidation.usdtInterestAmount, USDC_DECIMAL)).toFixed(4)} USDC
          </span>
        ) : (
          <span className="uppercase">{Number(formatEther(liquidation.ethBorrowAmount + liquidation.ethInterestAmount)).toFixed(4)} ETH</span>
        )}
      </Td>

      {/* Deposited Value */}
      <Td>
        {liquidation.ethDepositAmount && liquidation.usdtDepositAmount ? (
          <div className="flex flex-col gap-1">
            <span className="uppercase">{Number(formatEther(liquidation.ethDepositAmount + liquidation.ethRewardAmount)).toFixed(4)} ETH</span>
            <span className="uppercase">{Number(formatUnits(liquidation.usdtDepositAmount + liquidation.usdtRewardAmount, USDC_DECIMAL)).toFixed(4)} USDC</span>
          </div>
        ) : !liquidation.ethDepositAmount && liquidation.usdtDepositAmount ? (
          <span className="uppercase">{Number(formatUnits(liquidation.usdtDepositAmount + liquidation.usdtRewardAmount, USDC_DECIMAL)).toFixed(4)} USDC</span>
        ) : (
          <span className="uppercase">{Number(formatEther(liquidation.ethDepositAmount + liquidation.ethRewardAmount)).toFixed(4)} ETH</span>
        )}
      </Td>

      {/* Risk Factor */}
      <Td className="text-red-500">
        {liquidation.riskFactor.toFixed(4)} %
      </Td>

      <Td>
        <FilledButton onClick={() => openLiquidateDialog(liquidation)}>
          Liquidate
        </FilledButton>
      </Td>
    </Tr>
  )
}