import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { Icon } from "@iconify/react";
import Slider from "rc-slider";
import { toast } from "react-toastify";
import { formatEther, formatUnits, parseEther } from "viem";
import { useContractWrite, usePrepareContractWrite, useWaitForTransaction } from "wagmi";
import MainInput from "../../../components/form/MainInput";
import { IN_PROGRESS, METADATA_OF_ASSET, POOL_CONTRACT_ABI, POOL_CONTRACT_ADDRESS, REGEX_NUMBER_VALID, USDC_CONTRACT_ABI, USDC_CONTRACT_ADDRESS, USDC_DECIMAL, WETH_CONTRACT_ADDRESS } from "../../../utils/constants";
import OutlinedButton from "../../../components/buttons/OutlinedButton";
import FilledButton from "../../../components/buttons/FilledButton";
import TextButton from "../../../components/buttons/TextButton";
import MoreInfo from "./MoreInfo";
import { TAsset } from "../../../utils/types";
import useLoading from "../../../hooks/useLoading";
import { IBalanceData, IUserInfo } from "../../../utils/interfaces";

//  ----------------------------------------------------------------------------------------------------

interface IProps {
  asset: TAsset;
  setVisible: Function;
  balanceData?: IBalanceData;
  userInfo?: IUserInfo;
}

//  ----------------------------------------------------------------------------------------------------

export default function RepayTab({ asset, setVisible, balanceData, userInfo }: IProps) {
  const [amount, setAmount] = useState<string>('0')
  const [moreInfoCollapsed, setMoreInfoCollapsed] = useState<boolean>(false)
  const [approved, setApproved] = useState<boolean>(false);
  const [maxAmount, setMaxAmount] = useState<string>('0');

  //  --------------------------------------------------------------------------

  const { openLoading, closeLoading } = useLoading()

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
  })

  //  Repay
  const { config: repayConfig, isSuccess: repayPrepareIsSuccess, error: errorOfRepayPrepare } = usePrepareContractWrite({
    address: POOL_CONTRACT_ADDRESS,
    abi: POOL_CONTRACT_ABI,
    functionName: 'repay',
    args: [asset === 'eth' ? WETH_CONTRACT_ADDRESS : USDC_CONTRACT_ADDRESS, Number(amount) * 10 ** Number(balanceData?.decimals)],
    value: asset === 'eth' ? parseEther(`${Number(amount)}`) : parseEther('0')
  })

  const { write: repay, data: repayData } = useContractWrite(repayConfig)

  const { isLoading: repayIsLoading, isError: repayIsError, isSuccess: repayIsSuccess } = useWaitForTransaction({
    hash: repayData?.hash
  })

  //  --------------------------------------------------------------------------

  const handleAmount = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    if (value.match(REGEX_NUMBER_VALID)) {
      setAmount(value);
    }
  }

  const handleMaxAmount = () => {
    setAmount(maxAmount)
  }

  const handleHalfAmount = () => {
    setAmount(`${Number(maxAmount) / 2}`)
  }

  const handleSlider = (value: any) => {
    setAmount(`${value * Number(maxAmount) / 100}`)
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

  //  --------------------------------------------------------------------------

  useEffect(() => {
    if (repayIsError) {
      closeLoading()
      toast.error('Borrow has been failed.')
    }
  }, [repayIsError])

  useEffect(() => {
    if (repayIsSuccess) {
      closeLoading()
      toast.success('Repaid.')
      setVisible(false)
    }
  }, [repayIsSuccess])

  useEffect(() => {
    if (errorOfRepayPrepare) {
      // toast.warn(`${errorOfRepayPrepare.cause}`)
    }
  }, [errorOfRepayPrepare])

  useEffect(() => {
    if (approveIsSuccess) {
      closeLoading();
      toast.success('Approved!');
      setApproved(true)
    } else {
      setApproved(false)
    }
  }, [approveIsSuccess])

  useEffect(() => {
    if (userInfo) {
      if (asset === 'eth') {
        setMaxAmount(formatEther(userInfo.ethBorrowAmount))
      } else {
        setMaxAmount(formatUnits(userInfo.usdtDepositAmount, USDC_DECIMAL))
      }
    }
  }, [userInfo])

  //  --------------------------------------------------------------------------

  return (
    <>
      <div className="flex flex-col gap-2">
        <MainInput
          endAdornment={<span className="text-gray-100 uppercase">{METADATA_OF_ASSET[asset].symbol}</span>}
          disabled={asset === 'usdc' && approveIsLoading ? approved ? true : false : false}
          onChange={handleAmount}
          value={amount}
        />

        <div className="flex items-center justify-between">
          <p className="text-gray-500">Max: {Number(maxAmount).toFixed(4)} <span className="uppercase">{METADATA_OF_ASSET[asset].symbol}</span></p>
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
            disabled={asset === 'usdc' ? approved ? true : false : false}
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

        {asset === 'eth' ? (
          <FilledButton
            className="mt-8 py-2 text-base"
            disabled={!repayPrepareIsSuccess || repayIsLoading}
            onClick={() => repay?.()}
          >
            {repayIsLoading ? IN_PROGRESS : 'Repay'}
          </FilledButton>
        ) : approved ? (
          <FilledButton
            className="mt-8 py-2 text-base"
            disabled={!repayPrepareIsSuccess || repayIsLoading}
            onClick={() => repay?.()}
          >
            {repayIsLoading ? IN_PROGRESS : 'Repay'}
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

        <div className="flex items-center">
          <div className="flex-1 h-[1px] bg-gray-800" />
          <TextButton className="flex items-center gap-2" onClick={() => setMoreInfoCollapsed(!moreInfoCollapsed)}>
            More Info
            <Icon icon={moreInfoCollapsed ? 'ep:arrow-up-bold' : 'ep:arrow-down-bold'} />
          </TextButton>
          <div className="flex-1 h-[1px] bg-gray-800" />
        </div>

        {moreInfoCollapsed && (
          <MoreInfo />
        )}
      </div>
    </>
  )
}