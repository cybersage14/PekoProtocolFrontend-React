import { useState } from "react";
import { useAccount, useBalance, useContractRead } from "wagmi";
import TextButton from "../../../components/buttons/TextButton";
import CustomDialog from "../../../components/dialogs/CustomDialog";
import { TAssetSymbol } from "../../../utils/types";
import DepositTab from "./DepositTab";
import WithdrawTab from "./WithdrawTab";
import BorrowTab from "./BorrowTab";
import RepayTab from "./RepayTab";
import { METADATA_OF_ASSET, POOL_CONTRACT_ABI, POOL_CONTRACT_ADDRESS, USDC_CONTRACT_ADDRESS } from "../../../utils/constants";
import { IPoolInfo, IReturnValueOfPoolInfo, IReturnValueOfUserInfo } from "../../../utils/interfaces";

//  --------------------------------------------------------------------------------------------

type TTabValue = 'deposit' | 'withdraw' | 'borrow' | 'repay'

interface IProps {
  visible: boolean;
  setVisible: Function;
  assetSymbol: TAssetSymbol
}

//  --------------------------------------------------------------------------------------------

const TEMP_POOL_INFO: IPoolInfo = {
  LTV: BigInt(80),
  depositApy: BigInt(500),
  borrowApy: BigInt(10000),
  totalAmount: BigInt(0),
  borrowAmount: BigInt(0)
}

//  --------------------------------------------------------------------------------------------

export default function AssetDialog({ visible, setVisible, assetSymbol }: IProps) {
  const [tabValue, setTabValue] = useState<TTabValue>('deposit')

  //  -----------------------------------------------------------------

  const { address } = useAccount();

  //  -----------------------------------------------------------------

  //  Balance data
  const { data: balanceData } = useBalance({
    address,
    token: assetSymbol === 'usdc' ? USDC_CONTRACT_ADDRESS : undefined,
    watch: true
  })

  console.log('>>>>>>>>>> balanceData => ', balanceData)

  //  Get Userinfo
  const { data: userInfo }: IReturnValueOfUserInfo = useContractRead({
    address: POOL_CONTRACT_ADDRESS,
    abi: POOL_CONTRACT_ABI,
    functionName: 'getUserInfo',
    args: [address],
    watch: true
  });

  console.log('>>>>>>>>>> userInfo => ', userInfo)

  //  Get PoolInfo
  const { data: poolInfo }: IReturnValueOfPoolInfo = useContractRead({
    address: POOL_CONTRACT_ADDRESS,
    abi: POOL_CONTRACT_ABI,
    functionName: 'getPoolInfo',
    // args: [assetSymbol === 'eth' ? WETH_CONTRACT_ADDRESS]
  })

  //  -----------------------------------------------------------------

  return (
    <CustomDialog title={METADATA_OF_ASSET[assetSymbol].name} visible={visible} setVisible={setVisible}>
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
        {tabValue === 'deposit' ? <DepositTab assetSymbol={assetSymbol} setVisible={setVisible} balanceData={balanceData} userInfo={userInfo} /> :
          tabValue === 'withdraw' ? <WithdrawTab assetSymbol={assetSymbol} setVisible={setVisible} balanceData={balanceData} userInfo={userInfo} /> :
            tabValue === 'borrow' ? <BorrowTab assetSymbol={assetSymbol} setVisible={setVisible} balanceData={balanceData} userInfo={userInfo} poolInfo={TEMP_POOL_INFO} /> :
              <RepayTab assetSymbol={assetSymbol} setVisible={setVisible} balanceData={balanceData} userInfo={userInfo} />}
      </div>
    </CustomDialog>
  )
}