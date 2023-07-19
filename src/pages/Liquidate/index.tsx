import { lazy, useMemo, useState } from "react";
import { List } from "@material-tailwind/react";
import { useMediaQuery } from "react-responsive";
import { useContractRead } from "wagmi";
import { formatEther, formatUnits, parseEther, parseUnits } from "viem";
import Container from "../../components/containers/Container";
import Table from "../../components/tableComponents/Table";
import Th from "../../components/tableComponents/Th";
import { POOL_CONTRACT_ABI, POOL_CONTRACT_ADDRESS, USDC_CONTRACT_ADDRESS, USDC_DECIMAL, WETH_CONTRACT_ADDRESS } from "../../utils/constants";
import { ILiquidation, IReturnValueOfCalcTokenPrice, IReturnValueOfListOfUsers } from "../../utils/interfaces";

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

  //  ----------------------------------------------------------------

  //  Get listOfUsers
  const { data: listOfUsers }: IReturnValueOfListOfUsers = useContractRead({
    address: POOL_CONTRACT_ADDRESS,
    abi: POOL_CONTRACT_ABI,
    functionName: 'listUserInfo',
    watch: true
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

  //  ----------------------------------------------------------------

  const ethPriceInUsd = useMemo<number>(() => {
    if (ethPriceInBigInt) {
      return Number(formatUnits(ethPriceInBigInt, USDC_DECIMAL))
    }
    return 0
  }, [ethPriceInBigInt])

  const usdcPriceInUsd = useMemo<number>(() => {
    if (usdcPriceInBigInt) {
      return Number(formatUnits(usdcPriceInBigInt, USDC_DECIMAL))
    }
    return 0
  }, [usdcPriceInBigInt])

  const liquidationThreshold = useMemo<number>(() => {
    if (liquidatationThresholdInBigInt) {
      return Number(liquidatationThresholdInBigInt)
    }
    return 0
  }, [liquidatationThresholdInBigInt])

  const liquidations = useMemo<Array<ILiquidation>>(() => {
    if (listOfUsers) {
      let _liquidations = [];
      for (let i = 0; i < listOfUsers.length; i += 1) {
        if (listOfUsers[i].ethBorrowAmount || listOfUsers[i].usdtBorrowAmount) {
          let depositedValueInUsd = Number(formatEther(listOfUsers[i].ethDepositAmount + listOfUsers[i].ethRewardAmount)) * ethPriceInUsd + Number(formatUnits(listOfUsers[i].usdtDepositAmount + listOfUsers[i].usdtDepositAmount, USDC_DECIMAL)) * usdcPriceInUsd
          let borrowedValueInUsd = Number(formatEther(listOfUsers[i].ethBorrowAmount + listOfUsers[i].ethInterestAmount)) * ethPriceInUsd + Number(formatUnits(listOfUsers[i].usdtBorrowAmount + listOfUsers[i].usdtInterestAmount, USDC_DECIMAL)) * usdcPriceInUsd

          console.log('>>>>>>>>>> ethPriceInUsd => ', ethPriceInUsd)
          console.log('>>>>>>>>>> usdcPriceInUsd => ', usdcPriceInUsd)
          console.log(">>>>>>>>>> depositedValueInUsd => ", depositedValueInUsd)

          if (depositedValueInUsd > 0) {
            let riskFactor = borrowedValueInUsd / (depositedValueInUsd * 0.9) * 100
            if (riskFactor > liquidationThreshold) {
              _liquidations.push({ ...listOfUsers[i], riskFactor })
            }
          }
        }
      }
      return _liquidations;
    }
    return []
  }, [listOfUsers])

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