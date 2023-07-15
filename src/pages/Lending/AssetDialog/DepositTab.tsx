import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { Icon } from "@iconify/react";
import Slider from "rc-slider";
import { toast } from "react-toastify";
import { formatEther, formatUnits, parseEther } from "viem";
import { useContractWrite, usePrepareContractWrite, useWaitForTransaction } from "wagmi";
import MainInput from "../../../components/form/MainInput";
import { IN_PROGRESS, METADATA_OF_ASSET, POOL_CONTRACT_ABI, POOL_CONTRACT_ADDRESS, REGEX_NUMBER_VALID, USDC_CONTRACT_ABI, USDC_CONTRACT_ADDRESS, WETH_CONTRACT_ADDRESS } from "../../../utils/constants";
import OutlinedButton from "../../../components/buttons/OutlinedButton";
import FilledButton from "../../../components/buttons/FilledButton";
import TextButton from "../../../components/buttons/TextButton";
import MoreInfo from "./MoreInfo";
import { TAsset } from "../../../utils/types";
import { IBalanceData, IUserInfo } from "../../../utils/interfaces";

//  ----------------------------------------------------------------------------------------------------

interface IProps {
  asset: TAsset;
  setVisible: Function;
  balanceData?: IBalanceData;
  userInfo?: IUserInfo;
}

//  ----------------------------------------------------------------------------------------------------

export default function DepositTab({ asset, setVisible, balanceData, userInfo }: IProps) {
  const [amount, setAmount] = useState<string>('0')
  const [moreInfoCollapsed, setMoreInfoCollapsed] = useState<boolean>(false)
  const [approved, setApproved] = useState<boolean>(false);

  //  -----------------------------------------------------

  //  Deposit
  const { config: depositConfig } = usePrepareContractWrite({
    address: POOL_CONTRACT_ADDRESS,
    abi: POOL_CONTRACT_ABI,
    functionName: 'deposit',
    args: [asset === 'eth' ? WETH_CONTRACT_ADDRESS : USDC_CONTRACT_ADDRESS, Number(amount) * 10 ** Number(balanceData?.decimals)],
    value: asset === 'eth' ? parseEther(`${Number(amount)}`) : parseEther('0')
  })

  const { write: deposit, data: depositData } = useContractWrite(depositConfig);

  const { isLoading: depositIsLoading, isSuccess: depositIsSuccess } = useWaitForTransaction({
    hash: depositData?.hash,
  })

  //  Approve USDC
  const { config: approveConfig } = usePrepareContractWrite({
    address: USDC_CONTRACT_ADDRESS,
    abi: USDC_CONTRACT_ABI,
    functionName: 'approve',
    args: [POOL_CONTRACT_ADDRESS, Number(amount) * 10 ** Number(balanceData?.decimals)]
  })

  const { write: approve, data: approveData } = useContractWrite(approveConfig);

  const { isLoading: approveIsLoading, isSuccess: approveIsSuccess, isError: approveIsError } = useWaitForTransaction({
    hash: approveData?.hash,
  })
  //  -----------------------------------------------------

  const handleAmount = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    if (value.match(REGEX_NUMBER_VALID)) {
      setAmount(value);
    }
  }

  const handleSlider = (value: any) => {
    setAmount(`${value * Number(balanceData?.formatted) / 100}`)
  }

  //  -----------------------------------------------------

  const amountIsValid = useMemo<boolean>(() => {
    const amountInNumber = Number(amount);
    const balanceInNumber = Number(balanceData?.formatted);
    if (amountInNumber !== 0) {
      if (amountInNumber <= balanceInNumber) {
        return true;
      }
    }
    return false;
  }, [amount, balanceData?.formatted])

  //  -----------------------------------------------------

  useEffect(() => {
    if (approveIsError) {
      toast.error('approve() occurred error.')
    }
  }, [approveIsError])

  useEffect(() => {
    if (depositIsSuccess) {
      toast.success('Deposited!');
      setVisible(false);
    }
  }, [depositIsSuccess])

  useEffect(() => {
    if (approveIsSuccess) {
      toast.success('Approved!');
      setApproved(true)
    } else {
      setApproved(false)
    }
  }, [approveIsSuccess])

  //  -----------------------------------------------------

  return (
    <>
      <div className="flex flex-col gap-2">
        <MainInput
          endAdornment={<span className="text-gray-100 uppercase">{METADATA_OF_ASSET[asset].symbol}</span>}
          onChange={handleAmount}
          value={amount}
          disabled={asset === 'usdc' ? approved ? true : false : false}
        />

        <div className="flex items-center justify-between">
          <p className="text-gray-500">Max: {Number(balanceData?.formatted).toFixed(4)} <span className="uppercase">{METADATA_OF_ASSET[asset].symbol}</span></p>
          <div className="flex items-center gap-2">
            <OutlinedButton
              className="text-xs px-2 py-1"
              onClick={() => setAmount(`${Number(balanceData?.formatted) / 2}`)}
            >half</OutlinedButton>
            <OutlinedButton
              className="text-xs px-2 py-1"
              onClick={() => setAmount(`${balanceData?.formatted}`)}
            >max</OutlinedButton>
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
            value={Number(amount) / Number(balanceData?.formatted) * 100}
            onChange={handleSlider}
            disabled={asset === 'usdc' ? approved ? true : false : false}
          />
        </div>

        <div className="flex flex-col gap-2 text-sm mt-8">
          <div className="flex items-center justify-between">
            <span className="text-gray-500">Deposited</span>
            <span className="text-gray-100 uppercase">
              {userInfo && balanceData ? asset === 'eth' ?
                Number(formatEther((userInfo.ehtColAmount - userInfo.ehtDebtAmount))).toFixed(4) :
                Number(formatUnits((userInfo.usdtColAmount - userInfo.usdtDebtAmount), balanceData.decimals)).toFixed(4) : ''}&nbsp;
              {METADATA_OF_ASSET[asset].symbol}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-500">APY</span>
            <span className="text-gray-100">1.19%</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-500">Wallet</span>
            <span className="text-gray-100 uppercase">{Number(balanceData?.formatted).toFixed(4)} {METADATA_OF_ASSET[asset].symbol}</span>
          </div>
        </div>

        {asset === 'eth' ? (
          <FilledButton
            className="mt-8 py-2 text-base"
            disabled={!deposit || !amountIsValid || depositIsLoading}
            onClick={() => deposit?.()}
          >
            {depositIsLoading ? IN_PROGRESS : "Deposit"}
          </FilledButton>
        ) : approved ? (
          <FilledButton
            className="mt-8 py-2 text-base"
            disabled={!deposit || depositIsLoading}
            onClick={() => deposit?.()}
          >
            {depositIsLoading ? IN_PROGRESS : "Deposit"}
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