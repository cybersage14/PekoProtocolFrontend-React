import { useMemo, useState } from "react";
import { useAccount, useBalance, useContractRead } from "wagmi";
import TextButton from "../../../components/buttons/TextButton";
import CustomDialog from "../../../components/dialogs/CustomDialog";
import { TAssetSymbol } from "../../../utils/types";
import DepositTab from "./DepositTab";
import WithdrawTab from "./WithdrawTab";
import BorrowTab from "./BorrowTab";
import RepayTab from "./RepayTab";
import { METADATA_OF_ASSET, POOL_CONTRACT_ABI, POOL_CONTRACT_ADDRESS, USDC_CONTRACT_ADDRESS, WETH_CONTRACT_ADDRESS } from "../../../utils/constants";
import { IReturnValueOfPoolInfo, IReturnValueOfUserInfo } from "../../../utils/interfaces";

//  --------------------------------------------------------------------------------------------

type TTabValue = 'deposit' | 'withdraw' | 'borrow' | 'repay'

interface IProps {
  visible: boolean;
  setVisible: Function;
  assetSymbol: TAssetSymbol
  ethPriceInUsd: number;
  usdcPriceInUsd: number;
}

//  --------------------------------------------------------------------------------------------

export default function AssetDialog({ visible, setVisible, assetSymbol, ethPriceInUsd, usdcPriceInUsd }: IProps) {
  const [tabValue, setTabValue] = useState<TTabValue>('deposit')

  //  -----------------------------------------------------------------

  const { address } = useAccount();

  //  -----------------------------------------------------------------

  const argsOfGetPoolInfo = useMemo<Array<string>>(() => {
    if (assetSymbol === 'eth') {
      return [WETH_CONTRACT_ADDRESS]
    } else {
      return [USDC_CONTRACT_ADDRESS]
    }
  }, [assetSymbol])

  //  -----------------------------------------------------------------

  //  Balance data
  const { data: balanceData } = useBalance({
    address,
    token: assetSymbol === 'usdc' ? USDC_CONTRACT_ADDRESS : undefined,
    watch: true
  })

  //  Get Userinfo
  const { data: userInfo }: IReturnValueOfUserInfo = useContractRead({
    address: POOL_CONTRACT_ADDRESS,
    abi: POOL_CONTRACT_ABI,
    functionName: 'getUserInfo',
    args: [address],
    watch: true
  });

  //  Get PoolInfo
  const { data: poolInfo }: IReturnValueOfPoolInfo = useContractRead({
    address: POOL_CONTRACT_ADDRESS,
    abi: POOL_CONTRACT_ABI,
    functionName: 'getPoolInfo',
    args: argsOfGetPoolInfo
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
        {tabValue === 'deposit' ?
          <DepositTab
            assetSymbol={assetSymbol}
            setVisible={setVisible}
            balanceData={balanceData}
            userInfo={userInfo}
            poolInfo={poolInfo}
          /> : tabValue === 'withdraw' ?
            <WithdrawTab
              assetSymbol={assetSymbol}
              setVisible={setVisible}
              balanceData={balanceData}
              userInfo={userInfo}
              ethPriceInUsd={ethPriceInUsd}
              usdcPriceInUsd={usdcPriceInUsd}
            /> : tabValue === 'borrow' ?
              <BorrowTab
                assetSymbol={assetSymbol}
                setVisible={setVisible}
                balanceData={balanceData}
                userInfo={userInfo}
                poolInfo={poolInfo}
                ethPriceInUsd={ethPriceInUsd}
                usdcPriceInUsd={usdcPriceInUsd}
              /> : <RepayTab
                assetSymbol={assetSymbol}
                setVisible={setVisible}
                balanceData={balanceData}
                userInfo={userInfo}
              />
        }
      </div>
    </CustomDialog>
  )
}