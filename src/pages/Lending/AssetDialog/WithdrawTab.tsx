import { ChangeEvent, useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import Slider from "rc-slider";
import { toast } from "react-toastify";
import { useAccount, useBalance, useContractRead, useContractWrite, usePrepareContractWrite, useWaitForTransaction } from "wagmi";
import MainInput from "../../../components/form/MainInput";
import { METADATA_OF_ASSET, POOL_CONTRACT_ABI, POOL_CONTRACT_ADDRESS, REGEX_NUMBER_VALID, USDC_CONTRACT_ADDRESS, WETH_CONTRACT_ADDRESS } from "../../../utils/constants";
import OutlinedButton from "../../../components/buttons/OutlinedButton";
import FilledButton from "../../../components/buttons/FilledButton";
import TextButton from "../../../components/buttons/TextButton";
import MoreInfo from "./MoreInfo";
import { TAsset } from "../../../utils/types";
import useLoading from "../../../hooks/useLoading";
import { formatUnits } from "viem";

//  ----------------------------------------------------------------------------------------------------

interface IProps {
  asset: TAsset;
  setVisible: Function;
}

interface IUserInfo {
  ehtColAmount: bigint;
  ehtDebtAmount: bigint;
  usdtColAmount: bigint;
  usdtDebtAmount: bigint;
  userAddress: string;
}

interface IReturnValueOfUserInfo {
  data?: IUserInfo;
  [key: string]: any;
}

//  ----------------------------------------------------------------------------------------------------

export default function WithdrawTab({ asset, setVisible }: IProps) {
  const [amount, setAmount] = useState<string>('0')
  const [moreInfoCollapsed, setMoreInfoCollapsed] = useState<boolean>(false)
  const [maxAmount, setMaxAmount] = useState<string>('0')

  //  --------------------------------------------------------------------

  const { address } = useAccount()
  const { openLoading, closeLoading } = useLoading()

  //  --------------------------------------------------------------------

  //  Balance data
  const { data: balanceData } = useBalance({
    address,
    token: asset === 'usdc' ? USDC_CONTRACT_ADDRESS : undefined
  })

  const { data: userInfo }: IReturnValueOfUserInfo = useContractRead({
    address: POOL_CONTRACT_ADDRESS,
    abi: POOL_CONTRACT_ABI,
    functionName: 'getUserInfo',
    args: [address]
  });

  console.log('>>>>>>>> userInfo => ', userInfo);

  //  Withdraw
  const { config: withdrawConfig, isSuccess: withdrawPrepareIsSuccess } = usePrepareContractWrite({
    address: POOL_CONTRACT_ADDRESS,
    abi: POOL_CONTRACT_ABI,
    functionName: 'withdraw',
    args: [asset === 'eth' ? WETH_CONTRACT_ADDRESS : USDC_CONTRACT_ADDRESS, Number(amount) * 10 ** Number(balanceData?.decimals)],
  })

  const { write: withdraw, data: withdrawData } = useContractWrite(withdrawConfig);

  const { isLoading: withdrawIsLoading, isError: withdrawIsError, isSuccess: withdrawIsSuccess } = useWaitForTransaction({
    hash: withdrawData?.hash
  })

  //  --------------------------------------------------------------------

  const handleAmount = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    if (value.match(REGEX_NUMBER_VALID)) {
      setAmount(value);
    }
  }

  const handleHalf = () => {
    setAmount(`${Number(maxAmount) / 2}`)
  }

  const handleMax = () => {
    setAmount(maxAmount)
  }

  const handleSlider = (value: any) => {
    setAmount(`${value * Number(balanceData?.formatted) / 100}`)
  }

  //  --------------------------------------------------------------------

  useEffect(() => {
    if (!withdrawIsLoading) {
      closeLoading()
    } else {
      openLoading()
    }
  }, [withdrawIsLoading])

  useEffect(() => {
    if (withdrawIsError) {
      closeLoading()
      toast.error('Withdraw has been failed.');
    }
  }, [withdrawIsError])

  useEffect(() => {
    if (withdrawIsSuccess) {
      closeLoading()
      toast.success('Withdrawed.')
      setVisible(false)
    }
  }, [withdrawIsSuccess])

  useEffect(() => {
    if (userInfo && balanceData?.decimals) {
      setMaxAmount(formatUnits(userInfo.ehtColAmount, balanceData.decimals))
    }
  }, [userInfo])

  //  --------------------------------------------------------------------

  return (
    <>
      <div className="flex flex-col gap-2">
        <MainInput
          endAdornment={<span className="text-gray-100 uppercase">{METADATA_OF_ASSET[asset].symbol}</span>}
          onChange={handleAmount}
          value={amount}
        />

        <div className="flex items-center justify-between">
          <p className="text-gray-500">Max: {Number(maxAmount).toFixed(4)} <span className="uppercase">{METADATA_OF_ASSET[asset].symbol}</span></p>
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
            value={Number(amount) / Number(maxAmount) * 100}
            onChange={handleSlider}
          />
        </div>

        <div className="flex flex-col gap-2 text-sm mt-8">
          <div className="flex items-center justify-between">
            <span className="text-gray-500">Wallet</span>
            <span className="text-gray-100">0 USDC</span>
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
          disabled={!withdrawPrepareIsSuccess}
          onClick={() => withdraw?.()}
        >
          Withdraw
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