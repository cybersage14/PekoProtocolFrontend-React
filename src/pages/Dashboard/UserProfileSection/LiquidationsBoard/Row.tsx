import { useEffect, useMemo, useState } from "react";
import Tr from "../../../../components/tableComponents/Tr";
import { IUserInfo } from "../../../../utils/interfaces";
import { formatEther, formatUnits, parseEther, parseUnits } from "viem";
import { IN_PROGRESS, POOL_CONTRACT_ABI, POOL_CONTRACT_ADDRESS, USDC_CONTRACT_ABI, USDC_CONTRACT_ADDRESS, USDC_DECIMAL } from "../../../../utils/constants";
import { useContractWrite, usePrepareContractWrite, useWaitForTransaction } from "wagmi";
import { toast } from "react-toastify";
import Td from "../../../../components/tableComponents/Td";
import FilledButton from "../../../../components/buttons/FilledButton";

//  -----------------------------------------------------------------------------------------

interface IProps {
  userInfo: IUserInfo;
  ethPriceInUsd: number;
  usdcPriceInUsd: number;
}

//  -----------------------------------------------------------------------------------------

export default function Row({ userInfo, ethPriceInUsd, usdcPriceInUsd }: IProps) {
  const [liquidateEthValue, setLiquidateEthValue] = useState<number>(0)
  const [liquidateUsdcValue, setLiquidateUsdcValue] = useState<number>(0)
  const [approved, setApproved] = useState<boolean>(false);

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

  const handleLiquidate = () => {
    approve?.()
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
    <Tr>
      {/* Borrowed Value */}
      <Td>
        {userInfo.ethBorrowAmount && userInfo.usdtBorrowAmount ? (
          <div className="flex flex-col gap-1">
            <span className="uppercase">{Number(formatEther(userInfo.ethBorrowAmount + userInfo.ethInterestAmount)).toFixed(4)} ETH</span>
            <span className="uppercase">
              {Number(formatUnits(userInfo.usdtBorrowAmount + userInfo.usdtInterestAmount, USDC_DECIMAL)).toFixed(4)} USDC
            </span>
          </div>
        ) : !userInfo.ethBorrowAmount && userInfo.usdtBorrowAmount ? (
          <span className="uppercase">
            {Number(formatUnits(userInfo.usdtBorrowAmount + userInfo.usdtInterestAmount, USDC_DECIMAL)).toFixed(4)} USDC
          </span>
        ) : (
          <span className="uppercase">{Number(formatEther(userInfo.ethBorrowAmount + userInfo.ethInterestAmount)).toFixed(4)} ETH</span>
        )}
      </Td>

      {/* Deposited Value */}
      <Td>
        {userInfo.ethDepositAmount && userInfo.usdtDepositAmount ? (
          <div className="flex flex-col gap-1">
            <span className="uppercase">{Number(formatEther(userInfo.ethDepositAmount + userInfo.ethRewardAmount)).toFixed(4)} ETH</span>
            <span className="uppercase">{Number(formatUnits(userInfo.usdtDepositAmount + userInfo.usdtRewardAmount, USDC_DECIMAL)).toFixed(4)} USDC</span>
          </div>
        ) : !userInfo.ethDepositAmount && userInfo.usdtDepositAmount ? (
          <span className="uppercase">{Number(formatUnits(userInfo.usdtDepositAmount + userInfo.usdtRewardAmount, USDC_DECIMAL)).toFixed(4)} USDC</span>
        ) : (
          <span className="uppercase">{Number(formatEther(userInfo.ethDepositAmount + userInfo.ethRewardAmount)).toFixed(4)} ETH</span>
        )}
      </Td>

      {/* Risk Factor */}
      <Td className="text-red-500">
        {riskFactor.toFixed(4)} %
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