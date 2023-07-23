import { useEffect, useMemo, useState } from "react";
import { useAccount, useBalance, useContractRead, useContractWrite, usePrepareContractWrite, useWaitForTransaction } from "wagmi";
import { toast } from "react-toastify";
import { formatEther, formatUnits, parseEther } from "viem";
import CustomDialog from "./dialogs/CustomDialog";
import { ILiquidation, IReturnValueOfAllowance, IReturnValueOfBalance } from "../utils/interfaces";
import FilledButton from "./buttons/FilledButton";
import { DELAY_TIME, IN_PROGRESS, POOL_CONTRACT_ABI, POOL_CONTRACT_ADDRESS, USDC_CONTRACT_ABI, USDC_CONTRACT_ADDRESS, USDC_DECIMAL } from "../utils/constants";

// ---------------------------------------------------------------------------------------------

interface IProps {
  liquidation: ILiquidation | null;
  visible: boolean;
  setVisible: Function;
  closeLiquidateDialog: Function;
}

// ---------------------------------------------------------------------------------------------

export default function LiquidateDialog({ visible, setVisible, closeLiquidateDialog, liquidation }: IProps) {
  const [ethAmountToPay, setEthAmountToPay] = useState<number>(0)
  const [usdcAmountToPay, setUsdcAmountToPay] = useState<number>(0)
  const [ethAmountToGetPaid, setEthAmountToGetPaid] = useState<number>(0)
  const [usdcAmountToGetPaid, setUsdcAmountToGetPaid] = useState<number>(0)
  const [approved, setApproved] = useState<boolean>(false);
  const [approveIsLoadingDelayed, setApproveIsLoadingDelayed] = useState<boolean>(false)

  //  ---------------------------------------------------------------------------

  const { address } = useAccount()

  //  ---------------------------------------------------------------------------

  //  Get the ETH balance data of wallet
  const { data: ethBalanceDataOfWallet }: IReturnValueOfBalance = useBalance({
    address,
    watch: true
  })

  //  Get the USDC balance data of wallet
  const { data: usdcBalanceDataOfWallet }: IReturnValueOfBalance = useBalance({
    address,
    token: USDC_CONTRACT_ADDRESS,
    watch: true
  })

  //  Get approved USDC
  const { data: approvedUsdcInBigint }: IReturnValueOfAllowance = useContractRead({
    address: USDC_CONTRACT_ADDRESS,
    abi: USDC_CONTRACT_ABI,
    functionName: 'allowance',
    args: [address, POOL_CONTRACT_ADDRESS],
    watch: true
  })

  //  Liquidate
  const { config: liquidateConfig, isSuccess: liquidateIsPrepared } = usePrepareContractWrite({
    address: POOL_CONTRACT_ADDRESS,
    abi: POOL_CONTRACT_ABI,
    functionName: 'liquidate',
    args: [liquidation?.accountAddress],
    value: parseEther(`${ethAmountToPay}`)
  })
  const { write: liquidate, data: liquidateData } = useContractWrite(liquidateConfig);
  const { isLoading: liquidateIsLoading } = useWaitForTransaction({
    hash: liquidateData?.hash,
    onSuccess: () => {
      toast.success('Liquidated.')
      closeLiquidateDialog()
    },
    onError: () => {
      toast.error('Aprrove occured error.')
    }
  })

  //  Approve USDC
  const { config: approveConfig } = usePrepareContractWrite({
    address: USDC_CONTRACT_ADDRESS,
    abi: USDC_CONTRACT_ABI,
    functionName: 'approve',
    args: [POOL_CONTRACT_ADDRESS, usdcAmountToPay * 10 ** USDC_DECIMAL],
  })
  const { write: approve, data: approveData } = useContractWrite(approveConfig);
  const { isLoading: approveIsLoading } = useWaitForTransaction({
    hash: approveData?.hash,
    onSuccess: () => {
      setTimeout(() => {
        setApproved(true)
      }, DELAY_TIME)
    },
    onError: () => {
      setApproved(false)
      toast.error('Approve occured error.')
    }
  })

  //  ---------------------------------------------------------------------------

  //  Eth amount of wallet
  const ethBalanceOfWallet = useMemo<number>(() => {
    if (ethBalanceDataOfWallet) {
      if (ethBalanceDataOfWallet.formatted) {
        return Number(ethBalanceDataOfWallet.formatted)
      }
    }
    return 0
  }, [ethBalanceDataOfWallet])

  //  USDC amount of wallet
  const usdcBalanceOfWallet = useMemo<number>(() => {
    if (usdcBalanceDataOfWallet) {
      if (usdcBalanceDataOfWallet.formatted) {
        return Number(usdcBalanceDataOfWallet.formatted)
      }
    }
    return 0
  }, [usdcBalanceDataOfWallet])

  //  True if wallet has enough eth
  const ethIsSufficient = useMemo<boolean>(() => {
    if (ethBalanceOfWallet >= ethAmountToPay) {
      return true
    }
    return false
  }, [ethBalanceOfWallet, ethAmountToPay])

  //  True if wallet has enough usdc
  const usdcIsSufficient = useMemo<boolean>(() => {
    if (usdcBalanceOfWallet >= usdcAmountToPay) {
      return true
    }
    return false
  }, [usdcBalanceOfWallet, usdcAmountToPay])

  //  Approved USDC amount
  const approvedUsdc = useMemo(() => {
    if (approvedUsdcInBigint) {
      return Number(formatUnits(approvedUsdcInBigint, USDC_DECIMAL))
    }
    return 0
  }, [approvedUsdcInBigint])

  //  ---------------------------------------------------------------------------

  const handleUsdcLiquidate = () => {
    console.log('>>>>>>>>>> approvedUsdc => ', approvedUsdc)
    if (approvedUsdc >= usdcAmountToPay && liquidate) {
      liquidate()
    } else {
      setApproved(false)
      toast.warn(`Please approve ${usdcAmountToPay} USDC.`)
    }
  }

  //  ---------------------------------------------------------------------------

  //  Get totalBorrow and totalDeposit of the liquidation
  useEffect(() => {
    if (liquidation) {
      setEthAmountToPay(Number(formatEther(liquidation.ethBorrowAmount + liquidation.ethInterestAmount)))
      if (Number(formatUnits(liquidation.usdtBorrowAmount + liquidation.usdtInterestAmount, USDC_DECIMAL)) === 0) {
        setUsdcAmountToPay(Number(formatUnits(liquidation.usdtBorrowAmount + liquidation.usdtInterestAmount, USDC_DECIMAL)))
      } else {
        setUsdcAmountToPay(Number(formatUnits(liquidation.usdtBorrowAmount + liquidation.usdtInterestAmount, USDC_DECIMAL)))
      }
      setEthAmountToGetPaid(Number(formatEther(liquidation.ethDepositAmount + liquidation.ethRewardAmount)))
      setUsdcAmountToGetPaid(Number(formatUnits(liquidation.usdtDepositAmount + liquidation.usdtRewardAmount, USDC_DECIMAL)))
    }
  }, [liquidation])

  useEffect(() => {
    if (liquidateIsPrepared) {
      setApproved(true)
    } else {
      setApproved(false)
    }
  }, [liquidateIsPrepared])

  useEffect(() => {
    if (approveIsLoading) {
      setApproveIsLoadingDelayed(true)
    } else {
      setTimeout(() => {
        setApproveIsLoadingDelayed(false)
      }, DELAY_TIME)
    }
  }, [approveIsLoading])

  //  ---------------------------------------------------------------------------

  return (
    <CustomDialog title="Liquidate" visible={visible} setVisible={setVisible}>
      <div className="flex flex-col gap-12">
        {/* You pay */}
        <div className="bg-gray-900 rounded-md flex flex-col gap-8">
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg text-gray-100">You Pay</h2>
              {/* <span className="text-gray-500 text-sm">Needless repay will return to your wallet</span> */}
            </div>

            <div className="flex flex-col gap-4">
              {!!ethAmountToPay && (
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <img src="/assets/images/ethereum.png" alt="" className="w-10" />
                    <span className="text-gray-100 text-lg">{ethAmountToPay} ETH</span>
                  </div>
                  {!ethIsSufficient && (
                    <span className="text-red-500">Insufficient ETH balance</span>
                  )}
                </div>
              )}

              {!!usdcAmountToPay && (
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <img src="/assets/images/usdc.png" alt="" className="w-10" />
                    <span className="text-gray-100 text-lg">{usdcAmountToPay} USDC</span>
                  </div>
                  {!usdcIsSufficient && (
                    <span className="text-red-500">Insufficient USDC balance</span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Gain up to */}
        <div className="bg-gray-900 rounded-md flex flex-col gap-8">
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg text-gray-100">Gain up to</h2>
              {/* <span className="text-gray-500 text-sm">Needless repay will return to your wallet</span> */}
            </div>

            <div className="flex flex-col gap-4">
              {!!ethAmountToGetPaid && (
                <div className="flex items-center justify-between">
                  <img src="/assets/images/ethereum.png" alt="" className="w-10" />
                  <span className="text-gray-100 text-lg">{ethAmountToGetPaid} ETH</span>
                </div>
              )}

              {!!usdcAmountToGetPaid && (
                <div className="flex items-center justify-between">
                  <img src="/assets/images/usdc.png" alt="" className="w-10" />
                  <span className="text-gray-100 text-lg">{usdcAmountToGetPaid} USDC</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {usdcAmountToPay > 0 ? (
          <>
            {approved ? (
              <FilledButton
                className="w-full text-base py-3 font-semibold"
                disabled={liquidateIsLoading}
                onClick={() => handleUsdcLiquidate()}
              >
                {liquidateIsLoading ? IN_PROGRESS : 'Liquidate'}
              </FilledButton>
            ) : (
              <FilledButton
                className="w-full text-base py-3 font-semibold"
                disabled={!approve || approveIsLoadingDelayed}
                onClick={() => approve?.()}
              >
                {approveIsLoadingDelayed ? IN_PROGRESS : 'Approve'}
              </FilledButton>
            )}
          </>
        ) : (
          <FilledButton
            className="w-full text-base py-3 font-semibold"
            disabled={!liquidate || liquidateIsLoading}
            onClick={() => liquidate?.()}
          >
            {liquidateIsLoading ? IN_PROGRESS : 'Liquidate'}
          </FilledButton>
        )}
      </div>
    </CustomDialog>
  )
}