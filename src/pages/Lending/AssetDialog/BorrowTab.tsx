import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { Icon } from "@iconify/react";
import Slider from "rc-slider";
import { toast } from "react-toastify";
import { useContractWrite, usePrepareContractWrite, useWaitForTransaction } from "wagmi";
import { formatEther, formatUnits } from "viem";
import MainInput from "../../../components/form/MainInput";
import { IN_PROGRESS, POOL_CONTRACT_ABI, POOL_CONTRACT_ADDRESS, REGEX_NUMBER_VALID, USDC_CONTRACT_ADDRESS, USDC_DECIMAL, WETH_CONTRACT_ADDRESS } from "../../../utils/constants";
import OutlinedButton from "../../../components/buttons/OutlinedButton";
import FilledButton from "../../../components/buttons/FilledButton";
import TextButton from "../../../components/buttons/TextButton";
import MoreInfo from "./MoreInfo";
import { TAssetSymbol } from "../../../utils/types";
import { IBalanceData, IPoolInfo, IUserInfo } from "../../../utils/interfaces";

//  ----------------------------------------------------------------------------------------------------

interface IProps {
  assetSymbol: TAssetSymbol;
  setVisible: Function;
  balanceData?: IBalanceData;
  userInfo?: IUserInfo;
  poolInfo?: IPoolInfo;
  ethPriceInUsd: number;
  usdcPriceInUsd: number;
}

//  ----------------------------------------------------------------------------------------------------

export default function BorrowTab({ assetSymbol, setVisible, balanceData, userInfo, poolInfo, ethPriceInUsd, usdcPriceInUsd }: IProps) {
  const [amount, setAmount] = useState<string>('0')
  const [moreInfoCollapsed, setMoreInfoCollapsed] = useState<boolean>(false)
  const [maxAmountInUsd, setMaxAmountInUsd] = useState<number>(0)

  //  ----------------------------------------------------------------------------

  //  Borrow
  const { config: borrowConfig, isSuccess: borrowPrepareIsSuccess, error: errorOfBorrowPrepare } = usePrepareContractWrite({
    address: POOL_CONTRACT_ADDRESS,
    abi: POOL_CONTRACT_ABI,
    functionName: 'borrow',
    args: [assetSymbol === 'eth' ? WETH_CONTRACT_ADDRESS : USDC_CONTRACT_ADDRESS, Number(amount) * 10 ** Number(balanceData?.decimals)],
  })

  const { write: borrow, data: borrowData } = useContractWrite(borrowConfig)

  const { isLoading: borrowIsLoading, isError: borrowIsError, isSuccess: borrowIsSuccess } = useWaitForTransaction({
    hash: borrowData?.hash
  })

  //  ----------------------------------------------------------------------------

  const maxAmount = useMemo<number>(() => {
    if (assetSymbol === 'eth' && ethPriceInUsd > 0) {
      return maxAmountInUsd / ethPriceInUsd
    }
    if (assetSymbol === 'usdc' && usdcPriceInUsd > 0) {
      console.log(">>>>>>>> usdcPriceInUsd => ", usdcPriceInUsd)
      return maxAmountInUsd / usdcPriceInUsd
    }
    return 0
  }, [maxAmountInUsd])

  //  ----------------------------------------------------------------------------

  const handleAmount = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    if (value.match(REGEX_NUMBER_VALID)) {
      setAmount(value);
    }
  }

  const handleHalf = () => {
    setAmount(`${maxAmount / 2}`)
  }

  const handleMax = () => {
    setAmount(`${maxAmount}`)
  }

  const handleSlider = (value: any) => {
    setAmount(`${value * maxAmount / 100}`)
  }

  //  ----------------------------------------------------------------------------

  useEffect(() => {
    if (borrowIsError) {
      toast.error('Borrow has been failed.')
    }
  }, [borrowIsError])

  useEffect(() => {
    if (borrowIsSuccess) {
      toast.success('Borrowed.')
      setVisible(false)
    }
  }, [borrowIsSuccess])

  useEffect(() => {
    if (errorOfBorrowPrepare) {
      // toast.warn(`${errorOfBorrowPrepare.cause}`)
      console.log('>>>>>>>>>> errorOfBorrowPrepare => ', errorOfBorrowPrepare)
    }
  }, [errorOfBorrowPrepare])

  //  Get max borrowable amount in USD
  useEffect(() => {
    if (userInfo) {
      if (ethPriceInUsd && usdcPriceInUsd) {
        const ethAmountInUsd = (Number(formatEther(userInfo.ethDepositAmount)) - Number(formatEther(userInfo.ethBorrowAmount))) * ethPriceInUsd
        const usdcAmountInUsd = (Number(formatUnits(userInfo.usdtDepositAmount, USDC_DECIMAL)) - Number(formatUnits(userInfo.usdtBorrowAmount, USDC_DECIMAL))) * usdcPriceInUsd
        const amountInUsd = ethAmountInUsd + usdcAmountInUsd
        console.log('>>>>>>> userInfo => ', userInfo)
        console.log('>>>>>>> usdcAmountInUsd => ', usdcAmountInUsd)

        //  >>>>>>>>>>>>>> Require to calculate LTV
        setMaxAmountInUsd(amountInUsd * Number(poolInfo?.LTV) / 100)
      }
    }
  }, [userInfo])

  //  ----------------------------------------------------------------------------

  return (
    <>
      <div className="flex flex-col gap-2">
        <MainInput
          endAdornment={<span className="text-gray-100 uppercase">{assetSymbol}</span>}
          onChange={handleAmount}
          value={amount}
        />

        <div className="flex items-center justify-between">
          <p className="text-gray-500">Max: {maxAmount.toFixed(4)} <span className="uppercase">{assetSymbol}</span></p>
          <div className="flex items-center gap-2">
            <OutlinedButton className="text-xs px-2 py-1" onClick={handleHalf}>half</OutlinedButton>
            <OutlinedButton className="text-xs px-2 py-1" onClick={handleMax}>max</OutlinedButton>
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
            value={Number(amount) / maxAmount * 100}
            onChange={handleSlider}
          />
        </div>

        <div className="flex flex-col gap-2 text-sm mt-8">
          <div className="flex items-center justify-between">
            <span className="text-gray-500">Deposited</span>
            <span className="text-gray-100 uppercase">
              {userInfo && balanceData ? assetSymbol === 'eth' ?
                Number(formatEther((userInfo.ethDepositAmount))).toFixed(4) :
                Number(formatUnits((userInfo.usdtDepositAmount), balanceData.decimals)).toFixed(4) : ''}&nbsp;
              {assetSymbol}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-500">APY</span>
            <span className="text-gray-100">{Number(poolInfo?.borrowApy).toFixed(2)}%</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-500">Wallet</span>
            <span className="text-gray-100 uppercase">{Number(balanceData?.formatted).toFixed(4)} {assetSymbol}</span>
          </div>
        </div>

        <FilledButton
          className="mt-8 py-2 text-base"
          disabled={!borrowPrepareIsSuccess || borrowIsLoading}
          onClick={() => borrow?.()}
        >
          {borrowIsLoading ? IN_PROGRESS : 'Borrow'}
        </FilledButton>

        {/* <div className="flex items-center">
          <div className="flex-1 h-[1px] bg-gray-800" />
          <TextButton className="flex items-center gap-2" onClick={() => setMoreInfoCollapsed(!moreInfoCollapsed)}>
            More Info
            <Icon icon={moreInfoCollapsed ? 'ep:arrow-up-bold' : 'ep:arrow-down-bold'} />
          </TextButton>
          <div className="flex-1 h-[1px] bg-gray-800" />
        </div> */}

        {moreInfoCollapsed && (
          <MoreInfo />
        )}
      </div>
    </>
  )
}