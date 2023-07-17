import { useEffect, useState } from "react";
import { ListItem } from "@material-tailwind/react";
import { toast } from "react-toastify";
import { useContractWrite, usePrepareContractWrite, useWaitForTransaction } from "wagmi";
import { formatEther, formatUnits, parseEther, parseUnits } from "viem";
import { getVisibleWalletAddress } from "../../utils/functions";
import { ILiquidation } from "../../utils/interfaces";
import { IN_PROGRESS, POOL_CONTRACT_ABI, POOL_CONTRACT_ADDRESS, USDC_CONTRACT_ABI, USDC_CONTRACT_ADDRESS, USDC_DECIMAL } from "../../utils/constants";
import FilledButton from "../../components/buttons/FilledButton";

//  -----------------------------------------------------------------------------------------

interface IProps {
  liquidation: ILiquidation;
}

//  -----------------------------------------------------------------------------------------

export default function MBRow({ liquidation }: IProps) {
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
    args: [POOL_CONTRACT_ADDRESS, parseUnits(`${liquidateUsdcValue}`, USDC_DECIMAL)],
  })

  const { write: approve, data: approveData } = useContractWrite(approveConfig);

  const { isLoading: approveIsLoading, isSuccess: approveIsSuccess, isError: approveIsError } = useWaitForTransaction({
    hash: approveData?.hash,
  })

  //  ----------------------------------------------------------------------------------------

  const handleLiquidate = async () => {
    if (approve) {
      await approve?.()
      if (liquidate) {
        liquidate()
      }
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
    setLiquidateEthValue(Number(formatEther(liquidation.ethBorrowAmount + liquidation.ethInterestAmount)))
    setLiquidateUsdcValue(Number(formatUnits(liquidation.usdtBorrowAmount + liquidation.usdtInterestAmount, USDC_DECIMAL)))
  }, [liquidation])

  useEffect(() => {
    if (approveIsSuccess) {
      setApproved(true)
    } else {
      setApproved(false)
    }
  }, [approveIsSuccess, liquidate])
  
  //  ----------------------------------------------------------------------------------------

  return (
    <ListItem
      className="flex-col gap-6 text-gray-100 border-b border-gray-800 rounded-none"
    >
      {/* User */}
      <div className="flex justify-between w-full">
        <span className="text-gray-500 font-bold">User: </span>
        <span className="!text-blue-500">{getVisibleWalletAddress('0x5da095266ec7ec1d979f01a9d7e4ee902e0182bc')}</span>
      </div>

      {/* Borrowed assets */}
      <div className="flex justify-between w-full">
        <span className="text-gray-500 font-bold">Borrowed Asset(s): </span>
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
      </div>

      {/* Borrowed value */}
      <div className="flex justify-between w-full">
        <span className="text-gray-500 font-bold">Borrowed Value: </span>
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
      </div>

      {/* Deposited assets */}
      <div className="flex justify-between w-full">
        <span className="text-gray-500 font-bold">Deposited Asset(s): </span>
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

      {/* Deposited value */}
      <div className="flex justify-between w-full">
        <span className="text-gray-500 font-bold">Deposited Value: </span>
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
      </div>

      {/* Risk factor */}
      <div className="flex justify-between w-full">
        <span className="text-gray-500 font-bold">Risk Factor: </span>
        <span className="text-red-500">{liquidation.riskFactor.toFixed(4)}%</span>
      </div>

      {/* Operation */}
      <div className="flex justify-between w-full">
        <span className="text-gray-500 font-bold">Operation: </span>
        <FilledButton
          disabled={!approve || approveIsLoading || liquidateIsLoading}
          onClick={() => handleLiquidate()}
        >
          {approveIsLoading || liquidateIsLoading ? IN_PROGRESS : 'Liquidate'}
        </FilledButton>
      </div>
    </ListItem >
  )
}