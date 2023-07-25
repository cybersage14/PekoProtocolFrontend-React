import { lazy, useEffect, useMemo, useState } from "react";
import { ButtonGroup, List } from "@material-tailwind/react";
import { useMediaQuery } from "react-responsive";
import { useContractRead } from "wagmi";
import { formatEther, formatUnits, parseEther, parseUnits } from "viem";
import { Icon } from "@iconify/react";
import Container from "../../components/containers/Container";
import Table from "../../components/tableComponents/Table";
import Th from "../../components/tableComponents/Th";
import { POOL_CONTRACT_ABI, POOL_CONTRACT_ADDRESS, USDC_CONTRACT_ADDRESS, USDC_DECIMAL, WETH_CONTRACT_ADDRESS } from "../../utils/constants";
import { ILiquidation, IReturnValueOfAllowance, IReturnValueOfCalcTokenPrice, IReturnValueOfListOfUsers } from "../../utils/interfaces";

// -----------------------------------------------------------------------------------

const DPRow = lazy(() => import('./DPRow'))
const MBRow = lazy(() => import('./MBRow'))
const LiquidateDialog = lazy(() => import('../../components/LiquidateDialog'))

// -----------------------------------------------------------------------------------

export default function Liquidate() {
  const isMobile = useMediaQuery({ maxWidth: 1024 });

  //  ----------------------------------------------------------------

  const [visible, setVisible] = useState<boolean>(true)
  const [selectedLiquidation, setSelectedLiquidation] = useState<ILiquidation | null>(null)
  const [liquidateDialogOpened, setLiquidateDialogOpened] = useState<boolean>(false)
  const [currentPage, setCurrentPage] = useState<number>(0)
  const [liquidations, setLiquidations] = useState<Array<ILiquidation>>([])

  //  ----------------------------------------------------------------

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

  //  Get the price of ethereum in USD.
  const { data: ethPriceInBigInt }: IReturnValueOfCalcTokenPrice = useContractRead({
    address: POOL_CONTRACT_ADDRESS,
    abi: POOL_CONTRACT_ABI,
    args: [WETH_CONTRACT_ADDRESS, parseEther('1')],
    functionName: 'calcTokenPrice',
    watch: true
  })

  //  Get the price of ethereum in USD.
  const { data: usdcPriceInBigInt }: IReturnValueOfCalcTokenPrice = useContractRead({
    address: POOL_CONTRACT_ADDRESS,
    abi: POOL_CONTRACT_ABI,
    args: [USDC_CONTRACT_ADDRESS, parseUnits('1', USDC_DECIMAL)],
    functionName: 'calcTokenPrice',
    watch: true
  })

  //  Get the threshold of liquidation
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

  //  ----------------------------------------------------------------
  //  The price of 1 ETH in USD
  const ethPriceInUsd = useMemo<number>(() => {
    if (ethPriceInBigInt) {
      return Number(formatUnits(ethPriceInBigInt, USDC_DECIMAL))
    }
    return 0
  }, [ethPriceInBigInt])

  //  The price of 1 USDC in USD
  const usdcPriceInUsd = useMemo<number>(() => {
    if (usdcPriceInBigInt) {
      return Number(formatUnits(usdcPriceInBigInt, USDC_DECIMAL))
    }
    return 0
  }, [usdcPriceInBigInt])

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

  //  ----------------------------------------------------------------

  const openLiquidateDialog = (liquidation: ILiquidation) => {
    setSelectedLiquidation(liquidation)
    setLiquidateDialogOpened(true)
  }

  const closeLiquidateDialog = () => {
    setSelectedLiquidation(null)
    setLiquidateDialogOpened(false)
  }

  //  ----------------------------------------------------------------

  useEffect(() => {
    if (listOfUsers) {
      const _liquidations = [];
      for (let i = 0; i < listOfUsers.length; i += 1) {
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
      if (currentPage === 0) {
        setLiquidations(_liquidations)
      } else {
        setLiquidations([...liquidations, ..._liquidations])
      }
    }
  }, [listOfUsers, currentPage])

  //  ----------------------------------------------------------------

  return (
    <Container className="container my-8 flex flex-col gap-8">
      <header className="flex flex-col items-center gap-4">
        <h1 className="text-gray-100 text-3xl text-center">Liquidate</h1>
        <p className="text-center text-base text-gray-500">
          Liquidate to earn extra reward!
        </p>
        {/* <div className="flex items-center gap-4">
          <label htmlFor="ignore" className="text-gray-100 cursor-pointer">Ignore small debt</label>
          <Switch
            id="ignore"
            className="bg-gray-800"
            checked={!visible}
            onChange={() => setVisible(!visible)}
          />
        </div> */}
      </header>
      {visible && ethPriceInUsd && usdcPriceInUsd ? (
        <>
          {isMobile ? visible ? (
            <List className="text-sm">
              {liquidations.map((liquidationItem, index) => (
                <MBRow
                  key={index}
                  liquidation={liquidationItem}
                  ethPriceInUsd={ethPriceInUsd}
                  usdcPriceInUsd={usdcPriceInUsd}
                  openLiquidateDialog={openLiquidateDialog}
                />
              ))}
            </List>
          ) : (
            <></>
          ) : (
            <Table>
              <thead>
                <tr className="bg-gray-900">
                  <Th label="User" />
                  <Th label="Borrowed Asset(s)" />
                  <Th label="Borrowed Value" />
                  <Th label="Deposited Asset(s)" />
                  <Th label="Deposited Value" />
                  <Th label="Risk Factor" />
                  <Th label="Operation" />
                </tr>
              </thead>
              <tbody>
                {liquidations.map((liquidationItem, index) => (
                  <DPRow
                    ethPriceInUsd={ethPriceInUsd}
                    usdcPriceInUsd={usdcPriceInUsd}
                    key={index}
                    liquidation={liquidationItem}
                    openLiquidateDialog={openLiquidateDialog}
                  />
                ))}
              </tbody>
            </Table>
          )}
        </>
      ) : (<></>)}
      <LiquidateDialog
        liquidation={selectedLiquidation}
        visible={liquidateDialogOpened}
        setVisible={setLiquidateDialogOpened}
        closeLiquidateDialog={closeLiquidateDialog}
      />

    </Container>
  )
}