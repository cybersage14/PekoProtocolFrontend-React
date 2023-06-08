import { useState } from "react";
import TextButton from "../../../components/buttons/TextButton";
import CustomDialog from "../../../components/dialogs/CustomDialog";
import DepositTab from "./DepositTab";
import WithdrawTab from "./WithdrawTab";
import BorrowTab from "./BorrowTab";
import RepayTab from "./RepayTab";

type TTabValue = 'deposit' | 'withdraw' | 'borrow' | 'repay'

interface IProps {
  visible: boolean;
  setVisible: Function;
}

export default function AssetDialog({ visible, setVisible }: IProps) {
  const [tabValue, setTabValue] = useState<TTabValue>('deposit')

  return (
    <CustomDialog title="USD Coin" visible={visible} setVisible={setVisible}>
      <div className="grid grid-cols-4">
        <TextButton
          className={`border-b-2 rounded-none text-base w-full ${tabValue === 'deposit' ? 'border-blue-500' : 'border-transparent'}`}
          onClick={() => setTabValue('deposit')}
        >Deposit</TextButton>
        <TextButton
          className={`border-b-2 rounded-none text-base ${tabValue === 'withdraw' ? 'border-blue-500' : 'border-transparent'}`}
          onClick={() => setTabValue('withdraw')}
        >Withdraw</TextButton>
        <TextButton
          className={`border-b-2 rounded-none text-base ${tabValue === 'borrow' ? 'border-blue-500' : 'border-transparent'}`}
          onClick={() => setTabValue('borrow')}
        >Borrow</TextButton>
        <TextButton
          className={`border-b-2 rounded-none text-base ${tabValue === 'repay' ? 'border-blue-500' : 'border-transparent'}`}
          onClick={() => setTabValue('repay')}
        >Repay</TextButton>
      </div>
      <div className="my-4">
        {tabValue === 'deposit' ? <DepositTab /> : tabValue === 'withdraw' ? <WithdrawTab /> : tabValue === 'borrow' ? <BorrowTab /> : <RepayTab />}
      </div>
    </CustomDialog>
  )
}