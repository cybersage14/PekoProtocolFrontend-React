import { ChangeEvent, useEffect, useMemo, useState } from "react";
import Slider from "rc-slider";
import { toast } from "react-toastify";
import { formatEther, formatUnits, parseEther } from "viem";
import { useAccount, useContractRead, useContractWrite, usePrepareContractWrite, useWaitForTransaction } from "wagmi";
import MainInput from "../../../components/form/MainInput";
import { IN_PROGRESS, POOL_CONTRACT_ABI, POOL_CONTRACT_ADDRESS, REGEX_NUMBER_VALID, USDC_CONTRACT_ABI, USDC_CONTRACT_ADDRESS, USDC_DECIMAL } from "../../../utils/constants";
import OutlinedButton from "../../../components/buttons/OutlinedButton";
import FilledButton from "../../../components/buttons/FilledButton";
import MoreInfo from "./MoreInfo";
import { IAsset, IBalanceData, IReturnValueOfAllowance, IUserInfo } from "../../../utils/interfaces";

//  ----------------------------------------------------------------------------------------------------

interface IProps {
  asset: IAsset;
  setVisible: Function;
  balanceData?: IBalanceData;
  userInfo?: IUserInfo;
}

//  ----------------------------------------------------------------------------------------------------

export default function RepayTab({ asset, setVisible, balanceData, userInfo }: IProps) {
  const [amount, setAmount] = useState<string>('0')
  const [moreInfoCollapsed, setMoreInfoCollapsed] = useState<boolean>(false)
  const [maxAmount, setMaxAmount] = useState<string>('0');

  const { address } = useAccount()

  //  --------------------------------------------------------------------------

  const amountToRepay = useMemo<number>(() => {
    return Number(amount) * 10 ** Number(balanceData?.decimals)
  }, [asset, amount])

  //  --------------------------------------------------------------------------

  //  Approve USDC
  const { config: approveConfig } = usePrepareContractWrite({
    address: USDC_CONTRACT_ADDRESS,
    abi: USDC_CONTRACT_ABI,
    functionName: 'approve',
    args: [POOL_CONTRACT_ADDRESS, Number(amount) * 10 ** Number(balanceData?.decimals)]
  })
  const { write: approve, data: approveData } = useContractWrite(approveConfig);
  const { isLoading: approveIsLoading, isSuccess: approveIsSuccess } = useWaitForTransaction({
    hash: approveData?.hash,
    onError: () => {
      toast.error('Approve occured error.')
    }
  })

  //  Get approved USDC
  const { data: approvedUsdcInBigint }: IReturnValueOfAllowance = useContractRead({
    address: USDC_CONTRACT_ADDRESS,
    abi: USDC_CONTRACT_ABI,
    functionName: 'allowance',
    args: [address, POOL_CONTRACT_ADDRESS],
    watch: true
  })

  //  Repay
  const { config: repayConfig, error: errorOfRepayPrepare } = usePrepareContractWrite({
    address: POOL_CONTRACT_ADDRESS,
    abi: POOL_CONTRACT_ABI,
    functionName: 'repay',
    args: [asset.contractAddress, amountToRepay],
    value: asset.symbol === 'eth' ? parseEther(`${Number(amount)}`) : parseEther('0')
  })
  const { write: repay, data: repayData } = useContractWrite(repayConfig)
  const { isLoading: repayIsLoading, isError: repayIsError } = useWaitForTransaction({
    hash: repayData?.hash,
    onSuccess: () => {
      toast.success('Repaid.')
      setVisible(false)
    },
    onError: () => {
      toast.error('Repaying occured error')
    }
  })

  //  --------------------------------------------------------------------------

  const handleAmount = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    if (value.match(REGEX_NUMBER_VALID)) {
      setAmount(value);
    }
  }

  const handleMaxAmount = () => {
    setAmount(Number(maxAmount).toFixed(4))
  }

  const handleHalfAmount = () => {
    setAmount(`${(Number(maxAmount) / 2).toFixed(4)}`)
  }

  const handleSlider = (value: any) => {
    setAmount(`${Number(value * Number(maxAmount) / 100).toFixed(4)}`)
  }

  const handleUsdcRepay = () => {
    if (approvedUsdc >= Number(amount)) {
      repay?.()
    } else {
      toast.warn(`Please approve ${Number(amount) - approvedUsdc} USDC more.`)
    }
  }

  //  --------------------------------------------------------------------------

  const amountIsValid = useMemo<boolean>(() => {
    const amountInNumber = Number(amount);
    const maxAmountInNumber = Number(maxAmount);
    if (amountInNumber !== 0) {
      if (amountInNumber <= maxAmountInNumber) {
        return true;
      }
    }
    return false;
  }, [amount, maxAmount])

  const approvedUsdc = useMemo(() => {
    if (approvedUsdcInBigint) {
      return Number(formatUnits(approvedUsdcInBigint, USDC_DECIMAL))
    }
    return 0
  }, [approvedUsdcInBigint])

  const amountInNumberType = useMemo<string>(() => {
    if (amount[0] === '0') {
      if (amount[1] !== '.')
        return `${Number(amount)}`
    }
    return amount
  }, [amount])

  //  --------------------------------------------------------------------------

  useEffect(() => {
    if (repayIsError) {
      toast.error('Borrow has been failed.')
    }
  }, [repayIsError])

  useEffect(() => {
    if (errorOfRepayPrepare) {
      // toast.warn(`${errorOfRepayPrepare.cause}`)
    }
  }, [errorOfRepayPrepare])

  useEffect(() => {
    if (userInfo) {
      if (asset.symbol === 'eth') {
        setMaxAmount(formatEther(userInfo.ethBorrowAmount + userInfo.ethInterestAmount))
      } else {
        setMaxAmount(formatUnits(userInfo.usdtBorrowAmount + userInfo.usdtInterestAmount, USDC_DECIMAL))
      }
    }
  }, [userInfo])

  //  --------------------------------------------------------------------------

  return (
    <>
      <div className="flex flex-col gap-2">
        <MainInput
          endAdornment={<span className="text-gray-100 uppercase">{asset.symbol}</span>}
          // disabled={asset.symbol === 'usdc' && approveIsLoading ? approveIsSuccess ? true : false : false}
          onChange={handleAmount}
          value={amountInNumberType}
        />

        <div className="flex items-center justify-between">
          <p className="text-gray-500">Max: {Number(maxAmount).toFixed(4)} <span className="uppercase">{asset.symbol}</span></p>
          <div className="flex items-center gap-2">
            <OutlinedButton className="text-xs px-2 py-1" onClick={handleHalfAmount}>half</OutlinedButton>
            <OutlinedButton className="text-xs px-2 py-1" onClick={handleMaxAmount}>max</OutlinedButton>
          </div>
        </div>

        <div className="mt-4 px-2">
          <Slider
            marks={{
              0: '0%',
              25: '25%',
              50: '50%',
              75: '75%',
              100: '100%'
            }}
            className="bg-gray-900"
            railStyle={{ backgroundColor: '#3F3F46' }}
            trackStyle={{ backgroundColor: '#3B82F6' }}
            // disabled={asset.symbol === 'usdc' ? approveIsSuccess ? true : false : false}
            onChange={handleSlider}
            value={Number(amount) / Number(maxAmount) * 100}
          />
        </div>

        {/* <div className="flex flex-col gap-2 text-sm mt-8">
          <div className="flex items-center justify-between">
            <span className="text-gray-500">Deposited</span>
            <span className="text-gray-100">0 USDC</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-500">APY</span>
            <span className="text-gray-100">1.19%</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-500">Wallet</span>
            <span className="text-gray-100">2.89039 USDC</span>
          </div>
        </div> */}

        {asset.symbol === 'eth' ? (
          <FilledButton
            className="mt-8 py-2 text-base"
            disabled={!repay || !amountIsValid || repayIsLoading}
            onClick={() => repay?.()}
          >
            {repayIsLoading ? IN_PROGRESS : "Repay"}
          </FilledButton>
        ) : (
          <>
            {approveIsSuccess ? (
              <FilledButton
                className="mt-8 py-2 text-base"
                disabled={!amountIsValid || repayIsLoading}
                onClick={() => handleUsdcRepay()}
              >
                {repayIsLoading ? IN_PROGRESS : "Repay"}
              </FilledButton>
            ) : (
              <FilledButton
                className="mt-8 py-2 text-base"
                disabled={!approve || !amountIsValid || approveIsLoading}
                onClick={() => approve?.()}
              >
                {approveIsLoading ? IN_PROGRESS : 'Approve'}
              </FilledButton>
            )}
          </>
        )}

        {moreInfoCollapsed && (
          <MoreInfo />
        )}
      </div>
    </>
  )
}