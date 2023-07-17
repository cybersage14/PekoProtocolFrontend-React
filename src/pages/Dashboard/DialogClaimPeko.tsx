import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { useContractWrite, usePrepareContractWrite, useWaitForTransaction } from "wagmi";
import { parseUnits } from "viem";
import { toast } from "react-toastify";
import CustomDialog from "../../components/dialogs/CustomDialog";
import MainInput from "../../components/form/MainInput";
import { IN_PROGRESS, PEKO_DECIMAL, POOL_CONTRACT_ABI, POOL_CONTRACT_ADDRESS, REGEX_NUMBER_VALID } from "../../utils/constants";
import { IUserInfo } from "../../utils/interfaces";
import OutlinedButton from "../../components/buttons/OutlinedButton";
import FilledButton from "../../components/buttons/FilledButton";

//  ---------------------------------------------------------------------------------------

interface IProps {
  visible: boolean;
  setVisible: Function;
  userInfo: IUserInfo
}

//  ---------------------------------------------------------------------------------------

export default function DialogClaimPeko({ userInfo, visible, setVisible }: IProps) {
  const [amount, setAmount] = useState<string>('0')

  //  ------------------------------------------------------------------------

  //  Claim Peko
  const { config: depositConfig } = usePrepareContractWrite({
    address: POOL_CONTRACT_ADDRESS,
    abi: POOL_CONTRACT_ABI,
    functionName: 'claimPeko',
    args: [parseUnits(amount, PEKO_DECIMAL)],
  })

  const { write: claimPeko, data: claimPekoData } = useContractWrite(depositConfig);

  const { isLoading: claimPekoIsLoading, isSuccess: claimPekoIsSuccess, isError: claimPekoIsError } = useWaitForTransaction({
    hash: claimPekoData?.hash,
  })

  //  ------------------------------------------------------------------------

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

  //  ------------------------------------------------------------------------

  const maxAmount = useMemo<number>(() => {
    return Number(userInfo.pekoRewardAmount)
  }, [userInfo])

  const amountIsValid = useMemo<boolean>(() => {
    if (Number(amount) > 0 && Number(amount) <= maxAmount) {
      return true
    }
    return false
  }, [maxAmount, amount])

  //  ------------------------------------------------------------------------

  useEffect(() => {
    if (claimPekoIsSuccess) {
      toast.success('Claimed.')
    }
  }, [claimPekoIsSuccess])

  useEffect(() => {
    if (claimPekoIsError) {
      toast.error('Claiming token has an error.')
    }
  }, [claimPekoIsError])

  //  ------------------------------------------------------------------------

  return (
    <CustomDialog title="Claim Peko Token" visible={visible} setVisible={setVisible}>
      <div className="flex flex-col gap-2">
        <MainInput
          endAdornment={<div><img src="/assets/images/logo.png" alt="" className="w-4" /></div>}
          onChange={handleAmount}
          value={amount}
          disabled={!amountIsValid}
        />
        <div className="flex items-center justify-between">
          <p className="text-gray-500">Max: {maxAmount.toFixed(4)} <span className="uppercase">PEKO</span></p>
          <div className="flex items-center gap-2">
            <OutlinedButton
              className="text-xs px-2 py-1"
              onClick={handleHalf}
            >half</OutlinedButton>
            <OutlinedButton
              className="text-xs px-2 py-1"
              onClick={handleMax}
            >max</OutlinedButton>
          </div>
        </div>

        <FilledButton
          className="mt-8 py-2 text-base"
          disabled={!claimPeko || claimPekoIsLoading}
          onClick={() => claimPeko?.()}
        >
          {claimPekoIsLoading ? IN_PROGRESS : "Claim"}
        </FilledButton>
      </div>
    </CustomDialog>
  )
}