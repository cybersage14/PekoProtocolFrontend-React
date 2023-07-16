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
}

//  -----------------------------------------------------------------------------------------

export default function DPRow({ liquidation }: IProps) {
  const [liquidateEthValue, setLiquidateEthValue] = useState<number>(0)
  const [liquidateUsdcValue, setLiquidateUsdcValue] = useState<number>(0)
  const [approved, setApproved] = useState<boolean>(false);

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
    args: [POOL_CONTRACT_ADDRESS, parseUnits(`${liquidateUsdcValue}`, USDC_DECIMAL)]
  })

  const { write: approve, data: approveData } = useContractWrite(approveConfig);

  const { isLoading: approveIsLoading, isSuccess: approveIsSuccess, isError: approveIsError } = useWaitForTransaction({
    hash: approveData?.hash,
  })

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
    setLiquidateEthValue(Number(formatEther(liquidation.ethBorrowAmount + liquidation.ethInterestAmount)))
    setLiquidateUsdcValue(Number(formatUnits(liquidation.usdtBorrowAmount + liquidation.usdtBorrowAmount, USDC_DECIMAL)))
  }, [liquidation])

  useEffect(() => {
    if (approveIsSuccess) {
      toast.success('Approved.')
      setApproved(true)
    }
  }, [approveIsSuccess])

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
              <img src="/assets/images/ethereum.png" alt="" className="absolute top-0 left-[50%] w-10" />
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

      {/* Deposited Asset(s) */}
      <Td>
        <div className="flex justify-center">
          {liquidation.ethDepositAmount && liquidation.usdtDepositAmount ? (
            <div className="relative">
              <img src="/assets/images/usdc.png" alt="" className="w-10" />
              <img src="/assets/images/ethereum.png" alt="" className="absolute top-0 right-[50%] w-10" />
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
        {liquidation.ethDepositAmount && liquidation.usdtDepositAmount ? (
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
        )}
      </Td>

      {/* Risk Factor */}
      <Td className="text-red-500">
        {liquidation.riskFactor.toFixed(4)} %
      </Td>

      <Td>
        {approved ? (
          <FilledButton
            disabled={!liquidate || liquidateIsLoading}
            onClick={() => liquidate?.()}
          >
            {liquidateIsLoading ? IN_PROGRESS : "Liquidate"}
          </FilledButton>
        ) : (
          <FilledButton
            disabled={!approve || approveIsLoading}
            onClick={() => approve?.()}
          >
            {approveIsLoading ? IN_PROGRESS : 'Approve'}
          </FilledButton>
        )}
      </Td>
    </Tr>
  )
}