import { useState } from "react";
import TextButton from "../../../components/buttons/TextButton";
import CustomDialog from "../../../components/dialogs/CustomDialog";
import { TAsset } from "../../../utils/types";
import DepositTab from "./DepositTab";
import WithdrawTab from "./WithdrawTab";
import BorrowTab from "./BorrowTab";
import RepayTab from "./RepayTab";
import { METADATA_OF_ASSET } from "../../../utils/constants";

//  --------------------------------------------------------------------------------------------

type TTabValue = 'deposit' | 'withdraw' | 'borrow' | 'repay'

interface IProps {
  visible: boolean;
  setVisible: Function;
  asset: TAsset
}

//  --------------------------------------------------------------------------------------------

export default function AssetDialog({ visible, setVisible, asset }: IProps) {
  const [tabValue, setTabValue] = useState<TTabValue>('deposit')

  return (
    <CustomDialog title={METADATA_OF_ASSET[asset].name} visible={visible} setVisible={setVisible}>
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
        {tabValue === 'deposit' ? <DepositTab asset={asset} /> :
          tabValue === 'withdraw' ? <WithdrawTab asset={asset} /> : tabValue === 'borrow' ?
            <BorrowTab asset={asset} /> : <RepayTab asset={asset} />}
      </div>
    </CustomDialog>
  )
}