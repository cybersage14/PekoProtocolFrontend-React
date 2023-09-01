import { lazy, useMemo, useState } from "react";
import { formatEther, formatUnits } from "viem";
import { useAccount, useContractRead } from "wagmi";
import PrimaryBoard from "../../../../components/boards/PrimaryBoard";
import Table from "../../../../components/tableComponents/Table";
import Th from "../../../../components/tableComponents/Th";
import { ILiquidation, IReturnValueOfListOfUsers, IUserInfo } from "../../../../utils/interfaces";
import { POOL_CONTRACT_ABI, POOL_CONTRACT_ADDRESS, USDC_DECIMAL } from "../../../../utils/constants";

//  NoNO-----------------------------------------------------------------------------------------NoNo

const Row = lazy(() => import('./Row'))
const LiquidateDialog = lazy(() => import('../../../../components/LiquidateDialog'))

//  -----------------------------------------------------------------------------------------

interface IProps {
  userInfo: IUserInfo;
  ethPriceInUsd: number;
  usdcPriceInUsd: number;
}

//  -----------------------------------------------------------------------------------------

export default function LiquidationsBoard({ userInfo, ethPriceInUsd, usdcPriceInUsd }: IProps) {
  const [selectedLiquidation, setSelectedLiquidation] = useState<ILiquidation | null>(null)
  const [liquidateDialogOpened, setLiquidateDialogOpened] = useState<boolean>(false)

  //  -------------------------------------------------------------------------------

  const { address } = useAccount()

  //  Get listOfUsers
  const { data: listOfUsers }: IReturnValueOfListOfUsers = useContractRead({
    address: POOL_CONTRACT_ADDRESS,
    abi: POOL_CONTRACT_ABI,
    functionName: 'listUserInfo',
    watch: true
  })

  const { data: liquidatationThresholdInBigInt } = useContractRead({
    address: POOL_CONTRACT_ADDRESS,
    abi: POOL_CONTRACT_ABI,
    functionName: 'getLiquidationThreshhold',
    watch: true
  })

  //  -------------------------------------------------------------------------------

  const openLiquidateDialog = (liquidation: ILiquidation) => {
    setSelectedLiquidation(liquidation)
    setLiquidateDialogOpened(true)
  }

  const closeLiquidateDialog = () => {
    setSelectedLiquidation(null)
    setLiquidateDialogOpened(false)
  }

  //  -------------------------------------------------------------------------------

  const liquidations = useMemo<Array<ILiquidation>>(() => {
    if (listOfUsers) {
      let _liquidations = [];

      for (let i = 0; i < listOfUsers.length; i += 1) {
        if (address === listOfUsers[i].accountAddress) {
          if (listOfUsers[i].ethBorrowAmount || listOfUsers[i].usdtBorrowAmount) {
            let depositedValueInUsd = Number(formatEther(listOfUsers[i].ethDepositAmount + listOfUsers[i].ethRewardAmount)) * ethPriceInUsd + Number(formatUnits(listOfUsers[i].usdtDepositAmount + listOfUsers[i].usdtDepositAmount, USDC_DECIMAL)) * usdcPriceInUsd
            let borrowedValueInUsd = Number(formatEther(listOfUsers[i].ethBorrowAmount + listOfUsers[i].ethInterestAmount)) * ethPriceInUsd + Number(formatUnits(listOfUsers[i].usdtBorrowAmount + listOfUsers[i].usdtInterestAmount, USDC_DECIMAL)) * usdcPriceInUsd

            if (depositedValueInUsd > 0) {
              let riskFactor = borrowedValueInUsd / (depositedValueInUsd * 0.9) * 100
              if (riskFactor > Number(liquidatationThresholdInBigInt)) {
                _liquidations.push({ ...listOfUsers[i], riskFactor })
              }
            }
          }
        }
      }

      return _liquidations
    }
    return []
  }, [listOfUsers])

  //  -------------------------------------------------------------------------------

  return (
    <PrimaryBoard title="Liquidations" className="col-span-2 lg:col-span-1">
      <Table className="w-full">
        <thead>
          <tr>
            <Th label="Borrowed Value" />
            <Th label="Deposited Value" />
            <Th label="Risk Factor" />
            <Th label="Operation" />
          </tr>
        </thead>

        <tbody>
          {liquidations.map(liquadationItem => (
            <Row
              liquidation={liquadationItem}
              ethPriceInUsd={ethPriceInUsd}
              usdcPriceInUsd={usdcPriceInUsd}
              openLiquidateDialog={openLiquidateDialog}
            />
          ))}
        </tbody>
      </Table>
      <LiquidateDialog
        liquidation={selectedLiquidation}
        visible={liquidateDialogOpened}
        setVisible={setLiquidateDialogOpened}
        closeLiquidateDialog={closeLiquidateDialog}
      />
    </PrimaryBoard>
  )
}