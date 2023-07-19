import { ChangeEvent, useEffect, useMemo, useState } from "react";
import Slider from "rc-slider";
import { toast } from "react-toastify";
import { useContractWrite, usePrepareContractWrite, useWaitForTransaction } from "wagmi";
import { formatEther, formatUnits } from "viem";
import MainInput from "../../../components/form/MainInput";
import { IN_PROGRESS, POOL_CONTRACT_ABI, POOL_CONTRACT_ADDRESS, REGEX_NUMBER_VALID, USDC_DECIMAL } from "../../../utils/constants";
import OutlinedButton from "../../../components/buttons/OutlinedButton";
import FilledButton from "../../../components/buttons/FilledButton";
import MoreInfo from "./MoreInfo";
import { IAsset, IBalanceData, IPoolInfo, IUserInfo } from "../../../utils/interfaces";

//  ----------------------------------------------------------------------------------------------------

interface IProps {
  asset: IAsset;
  setVisible: Function;
  balanceData?: IBalanceData;
  userInfo?: IUserInfo;
  ethPriceInUsd: number;
  usdcPriceInUsd: number;
  poolInfo?: IPoolInfo;
}

//  ----------------------------------------------------------------------------------------------------

export default function WithdrawTab({ asset, setVisible, balanceData, userInfo, poolInfo, ethPriceInUsd, usdcPriceInUsd }: IProps) {
  const [amount, setAmount] = useState<string>('0')
  const [moreInfoCollapsed, setMoreInfoCollapsed] = useState<boolean>(false)
  const [maxAmountInUsd, setMaxAmountInUsd] = useState<number>(0)

  //  --------------------------------------------------------------------

  //  Withdraw
  const { config: withdrawConfig, isSuccess: withdrawPrepareIsSuccess } = usePrepareContractWrite({
    address: POOL_CONTRACT_ADDRESS,
    abi: POOL_CONTRACT_ABI,
    functionName: 'withdraw',
    args: [asset.contractAddress, Number(amount) * 10 ** asset.decimals],
  })

  const { write: withdraw, data: withdrawData } = useContractWrite(withdrawConfig);

  const { isLoading: withdrawIsLoading, isError: withdrawIsError, isSuccess: withdrawIsSuccess } = useWaitForTransaction({
    hash: withdrawData?.hash
  })

  //  --------------------------------------------------------------------

  const maxAmount = useMemo<number>(() => {
    if (userInfo) {
      let depositTokenAmount = 0
      let tempMaxAmount = 0

      if (asset.symbol === 'eth' && ethPriceInUsd > 0) {
        depositTokenAmount = Number(formatEther(userInfo.ethDepositAmount + userInfo.ethRewardAmount))
        tempMaxAmount = maxAmountInUsd / ethPriceInUsd
      }
      if (asset.symbol === 'usdc' && usdcPriceInUsd > 0) {
        depositTokenAmount = Number(formatUnits(userInfo.usdtDepositAmount + userInfo.usdtRewardAmount, USDC_DECIMAL))
        tempMaxAmount = maxAmountInUsd / usdcPriceInUsd
      }

      if (depositTokenAmount < tempMaxAmount) {
        return depositTokenAmount
      }
      return tempMaxAmount
    }

    return 0
  }, [maxAmountInUsd, userInfo])

  //  --------------------------------------------------------------------

  const handleAmount = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    if (value.match(REGEX_NUMBER_VALID)) {
      setAmount(value);
    }
  }

  const handleHalf = () => {
    setAmount(`${(maxAmount / 2).toFixed(4)}`)
  }

  const handleMax = () => {
    setAmount(maxAmount.toFixed(4))
  }

  const handleSlider = (value: any) => {
    setAmount(`${Number(value * maxAmount / 100).toFixed(4)}`)
  }

  //  --------------------------------------------------------------------

  //  Ping error alert.
  useEffect(() => {
    if (withdrawIsError) {
      toast.error('Withdraw has been failed.');
    }
  }, [withdrawIsError])

  //  Ping alert and close dialog.
  useEffect(() => {
    if (withdrawIsSuccess) {
      toast.success('Withdrawed.')
      setVisible(false)
    }
  }, [withdrawIsSuccess])

  //  Get max withdrawable amount in USD.
  useEffect(() => {
    if (userInfo && poolInfo) {
      if (ethPriceInUsd && usdcPriceInUsd) {
        let depositTokenInUsd = 0;

        const totalDepositInUsd = Number(formatEther(userInfo.ethDepositAmount + userInfo.ethRewardAmount)) * ethPriceInUsd + Number(formatUnits(userInfo.usdtDepositAmount + userInfo.usdtRewardAmount, USDC_DECIMAL)) * usdcPriceInUsd;
        const totalBorrowInUsd = Number(formatEther(userInfo.ethBorrowAmount + userInfo.ethInterestAmount)) * ethPriceInUsd + Number(formatUnits(userInfo.usdtBorrowAmount + userInfo.usdtInterestAmount, USDC_DECIMAL)) * usdcPriceInUsd

        console.log('>>>>>>>>> totalDepositInUsd => ', totalDepositInUsd)
        console.log('>>>>>>>>> totalBorrowInUsd => ', totalBorrowInUsd)

        if (asset.symbol === 'eth') {
          depositTokenInUsd = Number(formatEther(userInfo.ethDepositAmount + userInfo.ethRewardAmount)) * ethPriceInUsd
        } else {
          depositTokenInUsd = Number(formatUnits(userInfo.usdtDepositAmount + userInfo.usdtRewardAmount, USDC_DECIMAL)) * usdcPriceInUsd
        }

        if (depositTokenInUsd > 0) {
          let _maxValueInUsd = (totalDepositInUsd * Number(poolInfo.LTV) / 100 - totalBorrowInUsd) / (Number(poolInfo.LTV) / 100)
          console.log('>>>>>>>>>> _maxValueInUsd => ', _maxValueInUsd)
          console.log('>>>>>>>>>> depositTokenInUsd => ', depositTokenInUsd)

          if (_maxValueInUsd <= depositTokenInUsd) {
            setMaxAmountInUsd(_maxValueInUsd)
          } else {
            setMaxAmountInUsd(depositTokenInUsd)
          }
        } else {
          setMaxAmountInUsd(0)
        }
      }
    }
  }, [userInfo, poolInfo])

  //  --------------------------------------------------------------------

  return (
    <>
      <div className="flex flex-col gap-2">
        <MainInput
          endAdornment={<span className="text-gray-100 uppercase">{asset.symbol}</span>}
          onChange={handleAmount}
          value={amount}
        />

        <div className="flex items-center justify-between">
          <p className="text-gray-500">Max: {maxAmount.toFixed(4)} <span className="uppercase">{asset.symbol}</span></p>
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
            <span className="text-gray-500">Wallet</span>
            <span className="text-gray-100 uppercase">{Number(balanceData?.formatted).toFixed(4)} {asset.symbol}</span>
          </div>
          {/* <div className="flex items-center justify-between">
            <span className="text-gray-500">APY</span>
            <span className="text-gray-100">1.19%</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-500">Wallet</span>
            <span className="text-gray-100">2.89039 USDC</span>
          </div> */}
        </div>

        <FilledButton
          className="mt-8 py-2 text-base"
          disabled={!withdrawPrepareIsSuccess || withdrawIsLoading}
          onClick={() => withdraw?.()}
        >
          {withdrawIsLoading ? IN_PROGRESS : 'Withdraw'}
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