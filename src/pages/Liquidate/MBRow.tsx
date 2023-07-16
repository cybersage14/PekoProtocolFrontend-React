import { ListItem } from "@material-tailwind/react";
import { getVisibleWalletAddress } from "../../utils/functions";
import { IUserInfo } from "../../utils/interfaces";
import { useEffect, useMemo, useState } from "react";
import { formatEther, formatUnits, parseEther, parseUnits } from "viem";
import { IN_PROGRESS, POOL_CONTRACT_ABI, POOL_CONTRACT_ADDRESS, USDC_CONTRACT_ABI, USDC_CONTRACT_ADDRESS, USDC_DECIMAL } from "../../utils/constants";
import { useContractWrite, usePrepareContractWrite, useWaitForTransaction } from "wagmi";
import { toast } from "react-toastify";
import FilledButton from "../../components/buttons/FilledButton";

//  -----------------------------------------------------------------------------------------

interface IProps {
  userInfo: IUserInfo;
  ethPriceInUsd: number;
  usdcPriceInUsd: number;
  liquidationThreshold: number;
}

//  -----------------------------------------------------------------------------------------

export default function MBRow({ userInfo, ethPriceInUsd, usdcPriceInUsd, liquidationThreshold }: IProps) {
  const [liquidateEthValue, setLiquidateEthValue] = useState<number>(0)
  const [liquidateUsdcValue, setLiquidateUsdcValue] = useState<number>(0)
  const [approved, setApproved] = useState<boolean>(false);

  //  ----------------------------------------------------------------------------------------

  const riskFactor = useMemo<number>(() => {
    const depositedValueInUsd = Number(formatEther(userInfo.ethDepositAmount + userInfo.ethRewardAmount)) * ethPriceInUsd + Number(formatUnits(userInfo.usdtDepositAmount + userInfo.usdtDepositAmount, USDC_DECIMAL)) * usdcPriceInUsd
    const borrowedValueInUsd = Number(formatEther(userInfo.ethBorrowAmount + userInfo.ethInterestAmount)) * ethPriceInUsd + Number(formatUnits(userInfo.usdtBorrowAmount + userInfo.usdtInterestAmount, USDC_DECIMAL)) * usdcPriceInUsd

    return borrowedValueInUsd / (depositedValueInUsd * 0.9) * 100
  }, [userInfo, ethPriceInUsd, usdcPriceInUsd])

  //  ----------------------------------------------------------------------------------------

  //  Liquidate
  const { config: liquidateConfig } = usePrepareContractWrite({
    address: POOL_CONTRACT_ADDRESS,
    abi: POOL_CONTRACT_ABI,
    functionName: 'liquidate',
    args: [userInfo.accountAddress],
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
    setLiquidateEthValue(Number(formatEther(userInfo.ethBorrowAmount + userInfo.ethInterestAmount)))
    setLiquidateUsdcValue(Number(formatUnits(userInfo.usdtBorrowAmount + userInfo.usdtBorrowAmount, USDC_DECIMAL)))
  }, [userInfo])

  useEffect(() => {
    if (approveIsSuccess) {
      toast.success('Approved.')
      setApproved(true)
    }
  }, [approveIsSuccess])

  //  ----------------------------------------------------------------------------------------
  return (
    <>
      {liquidationThreshold <= riskFactor ? (
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
          </div>

          {/* Borrowed value */}
          <div className="flex justify-between w-full">
            <span className="text-gray-500 font-bold">Borrowed Value: </span>
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
          </div>

          {/* Deposited assets */}
          <div className="flex justify-between w-full">
            <span className="text-gray-500 font-bold">Deposited Asset(s): </span>
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

          {/* Deposited value */}
          <div className="flex justify-between w-full">
            <span className="text-gray-500 font-bold">Deposited Value: </span>
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
          </div>

          {/* Risk factor */}
          <div className="flex justify-between w-full">
            <span className="text-gray-500 font-bold">Risk Factor: </span>
            <span className="text-red-500">{riskFactor.toFixed(4)}%</span>
          </div>

          {/* Operation */}
          <div className="flex justify-between w-full">
            <span className="text-gray-500 font-bold">Operation: </span>
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
          </div>
        </ListItem>
      ) : (
        <></>
      )}
    </>
  )
}