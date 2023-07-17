import { lazy, useMemo } from "react";
import PrimaryBoard from "../../../../components/boards/PrimaryBoard";
import Table from "../../../../components/tableComponents/Table";
import Th from "../../../../components/tableComponents/Th";
import { ILiquidation, IReturnValueOfListOfUsers, IUserInfo } from "../../../../utils/interfaces";
import { useAccount, useContractRead } from "wagmi";
import { POOL_CONTRACT_ABI, POOL_CONTRACT_ADDRESS, USDC_DECIMAL } from "../../../../utils/constants";
import { formatEther, formatUnits } from "viem";

//  -----------------------------------------------------------------------------------------

const Row = lazy(() => import('./Row'))

//  -----------------------------------------------------------------------------------------

interface IProps {
  userInfo: IUserInfo;
  ethPriceInUsd: number;
  usdcPriceInUsd: number;
}

//  -----------------------------------------------------------------------------------------

export default function LiquidationsBoard({ userInfo, ethPriceInUsd, usdcPriceInUsd }: IProps) {
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

      console.log('>>>>>>>>>> _liquidations => ', _liquidations)

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
            <Row liquidation={liquadationItem} ethPriceInUsd={ethPriceInUsd} usdcPriceInUsd={usdcPriceInUsd} />
          ))}
        </tbody>
      </Table>
    </PrimaryBoard>
  )
}