import { useState } from "react";
import { useAccount, useBalance, useContractRead } from "wagmi";
import TextButton from "../../../components/buttons/TextButton";
import CustomDialog from "../../../components/dialogs/CustomDialog";
import DepositTab from "./DepositTab";
import WithdrawTab from "./WithdrawTab";
import BorrowTab from "./BorrowTab";
import RepayTab from "./RepayTab";
import { POOL_CONTRACT_ABI, POOL_CONTRACT_ADDRESS, USDC_CONTRACT_ADDRESS } from "../../../utils/constants";
import { IAsset, IReturnValueOfPoolInfo, IUserInfo } from "../../../utils/interfaces";

//  --------------------------------------------------------------------------------------------

type TTabValue = 'deposit' | 'withdraw' | 'borrow' | 'repay'

interface IProps {
  visible: boolean;
  setVisible: Function;
  asset: IAsset
  ethPriceInUsd: number;
  usdcPriceInUsd: number;
  userInfo?: IUserInfo;
}

//  --------------------------------------------------------------------------------------------

export default function AssetDialog({ visible, setVisible, asset, ethPriceInUsd, usdcPriceInUsd, userInfo }: IProps) {
  const [tabValue, setTabValue] = useState<TTabValue>('deposit')

  //  -----------------------------------------------------------------

  const { address } = useAccount();

  //  -----------------------------------------------------------------

  //  Balance data
  const { data: balanceData } = useBalance({
    address,
    token: asset.symbol === 'usdc' ? USDC_CONTRACT_ADDRESS : undefined,
    watch: true
  })

  //  Get PoolInfo
  const { data: poolInfo }: IReturnValueOfPoolInfo = useContractRead({
    address: POOL_CONTRACT_ADDRESS,
    abi: POOL_CONTRACT_ABI,
    functionName: 'getPoolInfo',
    args: [asset.contractAddress]
  })

  //  -----------------------------------------------------------------

  return (
    <CustomDialog title={asset.name} visible={visible} setVisible={setVisible}>
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
        {tabValue === 'deposit' ?
          <DepositTab
            asset={asset}
            setVisible={setVisible}
            balanceData={balanceData}
            userInfo={userInfo}
            poolInfo={poolInfo}
          /> : tabValue === 'withdraw' ?
            <WithdrawTab
              asset={asset}
              setVisible={setVisible}
              balanceData={balanceData}
              userInfo={userInfo}
              ethPriceInUsd={ethPriceInUsd}
              usdcPriceInUsd={usdcPriceInUsd}
              poolInfo={poolInfo}
            /> : tabValue === 'borrow' ?
              <BorrowTab
                asset={asset}
                setVisible={setVisible}
                balanceData={balanceData}
                userInfo={userInfo}
                poolInfo={poolInfo}
                ethPriceInUsd={ethPriceInUsd}
                usdcPriceInUsd={usdcPriceInUsd}
              /> : <RepayTab
                asset={asset}
                setVisible={setVisible}
                balanceData={balanceData}
                userInfo={userInfo}
              />
        }
      </div>
    </CustomDialog>
  )
}