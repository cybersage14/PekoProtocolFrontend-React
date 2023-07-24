import Slider from "rc-slider";
import OutlinedButton from "../../../components/buttons/OutlinedButton";
import CustomDialog from "../../../components/dialogs/CustomDialog";
import MainInput from "../../../components/form/MainInput";
import { IAsset, IPropsOfCustomDialog, IReturnValueOfAllowance } from "../../../utils/interfaces";
import FilledButton from "../../../components/buttons/FilledButton";
import { IN_PROGRESS, POOL_CONTRACT_ABI, POOL_CONTRACT_ADDRESS, REGEX_NUMBER_VALID } from "../../../utils/constants";
import { ChangeEvent, useMemo, useState } from "react";
import { useContractRead, useContractWrite, usePrepareContractWrite, useWaitForTransaction } from "wagmi";
import { toast } from "react-toastify";
import { formatUnits } from "viem";

//  -------------------------------------------------------------------------------------------

interface IProps extends IPropsOfCustomDialog {
  visible: boolean;
  setVisible: Function;
  asset: IAsset;
}

//  -------------------------------------------------------------------------------------------

export default function ClaimProfitDialog({ visible, setVisible, asset }: IProps) {
  const [amount, setAmount] = useState<string>('0')

  //  ----------------------------------------------------------------------
  //  Get Profit
  const { data: profitInBigint }: IReturnValueOfAllowance = useContractRead({
    address: POOL_CONTRACT_ADDRESS,
    abi: POOL_CONTRACT_ABI,
    functionName: 'getProfit',
    args: [asset.contractAddress],
    watch: true
  })

  //  Claim Peko
  const { config: configOfClaimProfit } = usePrepareContractWrite({
    address: POOL_CONTRACT_ADDRESS,
    abi: POOL_CONTRACT_ABI,
    functionName: 'claimProfit',
  })
  const { write: claimPeko, data: claimPekoData } = useContractWrite(configOfClaimProfit);
  const { isLoading: claimPekoIsLoading } = useWaitForTransaction({
    hash: claimPekoData?.hash,
    onSuccess: () => {
      toast.success('Peko Claimed.')
      setVisible(false)
    },
    onError: () => {
      toast.error('Claim occured error.')
    }
  })

  //  ----------------------------------------------------------------------

  const amountInNumberType = useMemo<string>(() => {
    if (amount[0] === '0') {
      if (amount[1] !== '.')
        return `${Number(amount)}`
    }
    return amount
  }, [amount])

  const maxAmount = useMemo<number>(() => {
    if (profitInBigint) {
      return Number(formatUnits(profitInBigint, asset.decimals))
    }
    return 0
  }, [profitInBigint])

  const amountIsValid = useMemo<boolean>(() => {
    if (Number(amount) > maxAmount) {
      return false
    }
    if (Number(amount) <= 0) {
      return false
    }
    return true
  }, [amount, maxAmount])

  //  ----------------------------------------------------------------------

  const handleAmount = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    if (value.match(REGEX_NUMBER_VALID)) {
      setAmount(value);
    }
  }

  const handleMaxAmount = () => {
    setAmount(maxAmount.toFixed(4))
  }

  const handleHalfAmount = () => {
    setAmount(`${(maxAmount / 2).toFixed(4)}`)
  }

  const handleSlider = (value: any) => {
    setAmount(`${Number(value * maxAmount / 100).toFixed(4)}`)
  }

  //  ----------------------------------------------------------------------

  return (
    <CustomDialog title="Claim Profit" visible={visible} setVisible={setVisible}>
      <div className="flex flex-col gap-24">
        <div className="flex flex-col gap-4">
          <MainInput
            endAdornment={<span className="text-gray-100 uppercase">PEKO</span>}
            onChange={handleAmount}
            value={amountInNumberType}
          />

          <div className="flex items-center justify-between">
            <p className="text-gray-500">Max: {maxAmount.toFixed(asset.decimals)}<span className="uppercase">{asset.symbol}</span></p>
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
              value={Number(amount) / maxAmount * 100}
              onChange={handleSlider}
            />
          </div>
        </div>

        <FilledButton
          className="py-2 text-base"
          disabled={!amountIsValid || !claimPeko || claimPekoIsLoading}
          onClick={() => claimPeko?.()}
        >
          {claimPekoIsLoading ? IN_PROGRESS : "Claim $Peko"}
        </FilledButton>
      </div>
    </CustomDialog>
  )
}