import { ChangeEvent, useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import Slider from "rc-slider";
import { toast } from "react-toastify";
import { useContractRead, useContractWrite, usePrepareContractWrite, useWaitForTransaction } from "wagmi";
import { formatEther, formatUnits, parseEther } from "viem";
import MainInput from "../../../components/form/MainInput";
import { IN_PROGRESS, METADATA_OF_ASSET, POOL_CONTRACT_ABI, POOL_CONTRACT_ADDRESS, REGEX_NUMBER_VALID, USDC_CONTRACT_ADDRESS, USDC_DECIMAL, WETH_CONTRACT_ADDRESS } from "../../../utils/constants";
import OutlinedButton from "../../../components/buttons/OutlinedButton";
import FilledButton from "../../../components/buttons/FilledButton";
import TextButton from "../../../components/buttons/TextButton";
import MoreInfo from "./MoreInfo";
import { TAsset } from "../../../utils/types";
import useLoading from "../../../hooks/useLoading";
import { IBalanceData, IPoolInfo, IReturnValueOfCalcTokenPrice, IUserInfo } from "../../../utils/interfaces";

//  ----------------------------------------------------------------------------------------------------

interface IProps {
  asset: TAsset;
  setVisible: Function;
  balanceData?: IBalanceData;
  userInfo?: IUserInfo;
  poolInfo: IPoolInfo;
}

//  ----------------------------------------------------------------------------------------------------

export default function BorrowTab({ asset, setVisible, balanceData, userInfo, poolInfo }: IProps) {
  const [amount, setAmount] = useState<string>('0')
  const [moreInfoCollapsed, setMoreInfoCollapsed] = useState<boolean>(false)
  const [maxAmountInUsd, setMaxAmountInUsd] = useState<string>('0')

  //  ----------------------------------------------------------------------------

  const { openLoading, closeLoading } = useLoading()

  //  ----------------------------------------------------------------------------

  //  Borrow
  const { config: borrowConfig, isSuccess: borrowPrepareIsSuccess, error: errorOfBorrowPrepare } = usePrepareContractWrite({
    address: POOL_CONTRACT_ADDRESS,
    abi: POOL_CONTRACT_ABI,
    functionName: 'borrow',
    args: [asset === 'eth' ? WETH_CONTRACT_ADDRESS : USDC_CONTRACT_ADDRESS, Number(amount) * 10 ** Number(balanceData?.decimals)],
  })

  const { write: borrow, data: borrowData } = useContractWrite(borrowConfig)

  const { isLoading: borrowIsLoading, isError: borrowIsError, isSuccess: borrowIsSuccess } = useWaitForTransaction({
    hash: borrowData?.hash
  })

  //  Get the price of ethereum in USD.
  const { data: ethPriceInUsdc }: IReturnValueOfCalcTokenPrice = useContractRead({
    address: POOL_CONTRACT_ADDRESS,
    abi: POOL_CONTRACT_ABI,
    args: [WETH_CONTRACT_ADDRESS, parseEther('1')],
    watch: true
  })

  //  ----------------------------------------------------------------------------

  const handleAmount = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    if (value.match(REGEX_NUMBER_VALID)) {
      setAmount(value);
    }
  }

  //  ----------------------------------------------------------------------------

  useEffect(() => {
    if (borrowIsError) {
      closeLoading()
      toast.error('Borrow has been failed.')
    }
  }, [borrowIsError])

  useEffect(() => {
    if (borrowIsSuccess) {
      closeLoading()
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
      if (ethPriceInUsdc) {
        const ethAmountInUsd = (Number(formatEther(userInfo.ethDepositAmount)) - Number(formatEther(userInfo.ethBorrowAmount))) * Number(formatUnits(ethPriceInUsdc, USDC_DECIMAL))
        const usdcAmountInUsd = Number(formatUnits(userInfo.usdtDepositAmount, USDC_DECIMAL)) - Number(formatUnits(userInfo.usdtBorrowAmount, USDC_DECIMAL))
        const amountInUsd = ethAmountInUsd + usdcAmountInUsd

        //  >>>>>>>>>>>>>> Require to calculate LTV
        setMaxAmountInUsd(`${amountInUsd * Number(poolInfo.LTV) / 100}`)
      }
    }
  }, [userInfo])

  //  ----------------------------------------------------------------------------

  return (
    <>
      <div className="flex flex-col gap-2">
        <MainInput
          endAdornment={<span className="text-gray-100 uppercase">{METADATA_OF_ASSET[asset].symbol}</span>}
          onChange={handleAmount}
          value={amount}
        />

        <div className="flex items-center justify-between">
          <p className="text-gray-500">Max: 2.790385 <span className="uppercase">{METADATA_OF_ASSET[asset].symbol}</span></p>
          <div className="flex items-center gap-2">
            <OutlinedButton className="text-xs px-2 py-1">half</OutlinedButton>
            <OutlinedButton className="text-xs px-2 py-1">max</OutlinedButton>
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
          />
        </div>

        <div className="flex flex-col gap-2 text-sm mt-8">
          <div className="flex items-center justify-between">
            <span className="text-gray-500">Deposited</span>
            <span className="text-gray-100 uppercase">
              {userInfo && balanceData ? asset === 'eth' ?
                Number(formatEther((userInfo.ethDepositAmount))).toFixed(4) :
                Number(formatUnits((userInfo.usdtDepositAmount), balanceData.decimals)).toFixed(4) : ''}&nbsp;
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

        <FilledButton
          className="mt-8 py-2 text-base"
          disabled={!borrowPrepareIsSuccess || borrowIsLoading}
          onClick={() => borrow?.()}
        >
          {borrowIsLoading ? IN_PROGRESS : 'Borrow'}
        </FilledButton>

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