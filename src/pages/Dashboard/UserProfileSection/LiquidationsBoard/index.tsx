import { lazy, useEffect, useMemo, useState } from "react";
import { formatEther, formatUnits } from "viem";
import { useAccount, useContractRead } from "wagmi";
import PrimaryBoard from "../../../../components/boards/PrimaryBoard";
import Table from "../../../../components/tableComponents/Table";
import Th from "../../../../components/tableComponents/Th";
import { ILiquidation, IReturnValueOfAllowance, IReturnValueOfListOfUsers, IUserInfo } from "../../../../utils/interfaces";
import { POOL_CONTRACT_ABI, POOL_CONTRACT_ADDRESS, USDC_DECIMAL } from "../../../../utils/constants";

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
  const [currentPage, setCurrentPage] = useState<number>(0)
  const [liquidations, setLiquidations] = useState<Array<ILiquidation>>([])

  //  -------------------------------------------------------------------------------

  const { address } = useAccount()

  //  Get listOfUsers
  const { data: listOfUsers }: IReturnValueOfListOfUsers = useContractRead({
    address: POOL_CONTRACT_ADDRESS,
    abi: POOL_CONTRACT_ABI,
    functionName: 'listUserInfo',
    args: [currentPage],
    watch: true,
    onSuccess: () => {
      if (numberOfPages > currentPage) {
        setCurrentPage(currentPage + 1)
      }
    }
  })

  const { data: liquidatationThresholdInBigInt } = useContractRead({
    address: POOL_CONTRACT_ADDRESS,
    abi: POOL_CONTRACT_ABI,
    functionName: 'getLiquidationThreshhold',
    watch: true
  })

  const { data: numberOfUsersInBigint }: IReturnValueOfAllowance = useContractRead({
    address: POOL_CONTRACT_ADDRESS,
    abi: POOL_CONTRACT_ABI,
    functionName: 'getMemberNumber',
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

  // const liquidations = useMemo<Array<ILiquidation>>(() => {
  //   if (listOfUsers) {
  //     let _liquidations = [];

  //     for (let i = 0; i < listOfUsers.length; i += 1) {
  //       if (address === listOfUsers[i].accountAddress) {
  //         if (listOfUsers[i].ethBorrowAmount || listOfUsers[i].usdtBorrowAmount) {
  //           let depositedValueInUsd = Number(formatEther(listOfUsers[i].ethDepositAmount + listOfUsers[i].ethRewardAmount)) * ethPriceInUsd + Number(formatUnits(listOfUsers[i].usdtDepositAmount + listOfUsers[i].usdtDepositAmount, USDC_DECIMAL)) * usdcPriceInUsd
  //           let borrowedValueInUsd = Number(formatEther(listOfUsers[i].ethBorrowAmount + listOfUsers[i].ethInterestAmount)) * ethPriceInUsd + Number(formatUnits(listOfUsers[i].usdtBorrowAmount + listOfUsers[i].usdtInterestAmount, USDC_DECIMAL)) * usdcPriceInUsd

  //           if (depositedValueInUsd > 0) {
  //             let riskFactor = borrowedValueInUsd / (depositedValueInUsd * 0.9) * 100
  //             if (riskFactor > Number(liquidatationThresholdInBigInt)) {
  //               _liquidations.push({ ...listOfUsers[i], riskFactor })
  //             }
  //           }
  //         }
  //       }
  //     }

  //     return _liquidations
  //   }
  //   return []
  // }, [listOfUsers])

  //  The threshold of liquidation
  const liquidationThreshold = useMemo<number>(() => {
    if (liquidatationThresholdInBigInt) {
      return Number(liquidatationThresholdInBigInt)
    }
    return 0
  }, [liquidatationThresholdInBigInt])

  //  The number of users
  const numberOfUsers = useMemo<number>(() => {
    if (numberOfUsersInBigint) {
      return Number(numberOfUsersInBigint)
    }
    return 0
  }, [numberOfUsersInBigint])

  const numberOfPages = useMemo<number>(() => {
    return Math.ceil(numberOfUsers / 100)
  }, [numberOfUsers])

  //  -------------------------------------------------------------------------------

  useEffect(() => {
    console.log('>>>>>>>>>> listOfUsers => ', listOfUsers)
    if (listOfUsers) {
      const _liquidations = [];
      for (let i = 0; i < listOfUsers.length; i += 1) {
        if (address === listOfUsers[i].accountAddress) {
          if (listOfUsers[i].ethBorrowAmount || listOfUsers[i].usdtBorrowAmount) {
            let depositedValueInUsd = Number(formatEther(listOfUsers[i].ethDepositAmount + listOfUsers[i].ethRewardAmount)) * ethPriceInUsd + Number(formatUnits(listOfUsers[i].usdtDepositAmount + listOfUsers[i].usdtDepositAmount, USDC_DECIMAL)) * usdcPriceInUsd
            let borrowedValueInUsd = Number(formatEther(listOfUsers[i].ethBorrowAmount + listOfUsers[i].ethInterestAmount)) * ethPriceInUsd + Number(formatUnits(listOfUsers[i].usdtBorrowAmount + listOfUsers[i].usdtInterestAmount, USDC_DECIMAL)) * usdcPriceInUsd

            if (depositedValueInUsd > 0) {
              let riskFactor = borrowedValueInUsd / depositedValueInUsd * 100
              if (riskFactor > liquidationThreshold) {
                _liquidations.push({ ...listOfUsers[i], riskFactor })
              }
            }
          }
        }
      }
      if (currentPage === 0) {
        setLiquidations(_liquidations)
      } else {
        setLiquidations([...liquidations, ..._liquidations])
      }
    }
  }, [listOfUsers, currentPage])

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