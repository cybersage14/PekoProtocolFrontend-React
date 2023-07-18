import { useEffect, useState } from "react";
import { formatEther, formatUnits, parseEther, parseUnits } from "viem";
import { useContractWrite, usePrepareContractWrite, useWaitForTransaction } from "wagmi";
import { toast } from "react-toastify";
import Td from "../../components/tableComponents/Td";
import Tr from "../../components/tableComponents/Tr";
import { getVisibleWalletAddress } from "../../utils/functions";
import { ILiquidation } from "../../utils/interfaces"
import { IN_PROGRESS, POOL_CONTRACT_ABI, POOL_CONTRACT_ADDRESS, USDC_CONTRACT_ABI, USDC_CONTRACT_ADDRESS, USDC_DECIMAL } from "../../utils/constants";
import FilledButton from "../../components/buttons/FilledButton";

//  -----------------------------------------------------------------------------------------

interface IProps {
  liquidation: ILiquidation;
  ethPriceInUsd: number;
  usdcPriceInUsd: number;
  openLiquidateDialog: Function;
}

//  -----------------------------------------------------------------------------------------

export default function DPRow({ liquidation, ethPriceInUsd, usdcPriceInUsd, openLiquidateDialog }: IProps) {
  const [liquidateEthValue, setLiquidateEthValue] = useState<number>(0)
  const [liquidateUsdcValue, setLiquidateUsdcValue] = useState<number>(0)
  const [borrowedValueInUsd, setBorrowedValueInUsd] = useState<number>(0)
  const [depositedValueInUsd, setDepositedValueInUsd] = useState<number>(0)

  //  ----------------------------------------------------------------------------------------

  //  Liquidate
  const { config: liquidateConfig } = usePrepareContractWrite({
    address: POOL_CONTRACT_ADDRESS,
    abi: POOL_CONTRACT_ABI,
    functionName: 'liquidate',
    args: [liquidation.accountAddress],
    value: parseEther(`${liquidateEthValue}`)
  })

  const { write: liquidate, data: liquidateData } = useContractWrite(liquidateConfig);

  const { isLoading: liquidateIsLoading, isSuccess: liqudateIsSuccess, isError: liquidateIsError } = useWaitForTransaction({
    hash: liquidateData?.hash
  })

  //  Approve USDC
  const { config: approveConfig } = usePrepareContractWrite({
    address: USDC_CONTRACT_ADDRESS,
    abi: USDC_CONTRACT_ABI,
    functionName: 'approve',
    args: [POOL_CONTRACT_ADDRESS, parseUnits(`${liquidateUsdcValue}`, USDC_DECIMAL)],
  })

  const { write: approve, data: approveData } = useContractWrite(approveConfig);

  const { isLoading: approveIsLoading, isError: approveIsError } = useWaitForTransaction({
    hash: approveData?.hash,
    onSuccess: () => {
      liquidate?.()
    }
  })

  //  ----------------------------------------------------------------------------------------

  const handleLiquidate = async () => {
    if (liquidateUsdcValue > 0) {
      approve?.()
    } else {
      liquidate?.()
    }
  }

  //  ----------------------------------------------------------------------------------------

  useEffect(() => {
    if (liqudateIsSuccess) {
      toast.success('Liquidated.')
    }
  }, [liqudateIsSuccess])

  useEffect(() => {
    if (liquidateIsError) {
      toast.error('Error.')
    }
  }, [liquidateIsError])

  useEffect(() => {
    if (approveIsError) {
      toast.error('Approve Error.')
    }
  }, [approveIsError])

  useEffect(() => {
    //  >>>>>>>>>>>>>>>>> Need to be fixed.
    setLiquidateEthValue(Number(formatEther(liquidation.ethBorrowAmount + liquidation.ethInterestAmount)) / 10000 * 9999 + 0.001)
    setLiquidateUsdcValue(Number(formatUnits(liquidation.usdtBorrowAmount + liquidation.usdtInterestAmount, USDC_DECIMAL)))

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
      {/* User */}
      <Td className="!text-blue-500">{getVisibleWalletAddress(liquidation.accountAddress)}</Td>

      {/* Borrowed Asset(s) */}
      <Td>
        <div className="flex justify-center">
          {liquidation.ethBorrowAmount && liquidation.usdtBorrowAmount ? (
            <div className="relative">
              <img src="/assets/images/usdc.png" alt="" className="w-10" />
              <img src="/assets/images/ethereum.png" alt="" className="absolute top-0 left-[60%] w-10" />
            </div>
          ) : !liquidation.ethBorrowAmount && liquidation.usdtBorrowAmount ? (
            <img src="/assets/images/usdc.png" alt="" className="w-10" />
          ) : (
            <img src="/assets/images/ethereum.png" alt="" className="w-10" />
          )}
        </div>
      </Td>

      {/* Borrowed Value */}
      <Td>
        {/* {liquidation.ethBorrowAmount && liquidation.usdtBorrowAmount ? (
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
        )} */}
        ${borrowedValueInUsd.toFixed(2)}
      </Td>

      {/* Deposited Asset(s) */}
      <Td>
        <div className="flex justify-center">
          {liquidation.ethDepositAmount && liquidation.usdtDepositAmount ? (
            <div className="relative">
              <img src="/assets/images/usdc.png" alt="" className="w-10" />
              <img src="/assets/images/ethereum.png" alt="" className="absolute top-0 right-[60%] w-10" />
            </div>
          ) : !liquidation.ethDepositAmount && liquidation.usdtDepositAmount ? (
            <img src="/assets/images/usdc.png" alt="" className="w-10" />
          ) : (
            <img src="/assets/images/ethereum.png" alt="" className="w-10" />
          )}
        </div>
      </Td>

      {/* Deposited Value */}
      <Td>
        {/* {liquidation.ethDepositAmount && liquidation.usdtDepositAmount ? (
          <div className="flex flex-col gap-1">
            <span className="uppercase">{Number(formatEther(liquidation.ethDepositAmount + liquidation.ethRewardAmount)).toFixed(4)} ETH</span>
            <span className="uppercase">
              {Number(formatUnits(liquidation.usdtDepositAmount + liquidation.usdtRewardAmount, USDC_DECIMAL)).toFixed(4)} USDC
            </span>
          </div>
        ) : !liquidation.ethDepositAmount && liquidation.usdtDepositAmount ? (
          <span className="uppercase">{Number(formatUnits(liquidation.usdtDepositAmount + liquidation.usdtRewardAmount, USDC_DECIMAL)).toFixed(4)} USDC</span>
        ) : (
          <span className="uppercase">{Number(formatEther(liquidation.ethDepositAmount + liquidation.ethRewardAmount)).toFixed(4)} ETH</span>
        )} */}
        ${depositedValueInUsd.toFixed(2)}
      </Td>

      {/* Risk Factor */}
      <Td className="text-red-500">
        {liquidation.riskFactor.toFixed(4)} %
      </Td>

      <Td>
        {/* <FilledButton
          disabled={!approve || approveIsLoading || liquidateIsLoading}
          onClick={() => handleLiquidate()}
        >
          {approveIsLoading || liquidateIsLoading ? IN_PROGRESS : 'Liquidate'}
        </FilledButton> */}
        <FilledButton onClick={() => openLiquidateDialog(liquidation)}>
          Liquidate
        </FilledButton>
      </Td>
    </Tr>
  )
}