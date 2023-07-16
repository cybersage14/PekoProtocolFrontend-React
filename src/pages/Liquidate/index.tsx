import { lazy, useMemo, useState } from "react";
import { List } from "@material-tailwind/react";
import { useMediaQuery } from "react-responsive";
import { useContractRead } from "wagmi";
import { formatEther, parseEther, parseUnits } from "viem";
import Container from "../../components/containers/Container";
import Table from "../../components/tableComponents/Table";
import Th from "../../components/tableComponents/Th";
import { POOL_CONTRACT_ABI, POOL_CONTRACT_ADDRESS, USDC_CONTRACT_ADDRESS, USDC_DECIMAL, WETH_CONTRACT_ADDRESS } from "../../utils/constants";
import { IReturnValueOfCalcTokenPrice, IReturnValueOfListOfUsers } from "../../utils/interfaces";

// -----------------------------------------------------------------------------------

const DPRow = lazy(() => import('./DPRow'))
const MBRow = lazy(() => import('./MBRow'))

// -----------------------------------------------------------------------------------

export default function Liquidate() {
  const isMobile = useMediaQuery({ maxWidth: 1024 });

  //  ----------------------------------------------------------------

  const [visible, setVisible] = useState<boolean>(true)

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
  })

  //  Get the price of ethereum in USD.
  const { data: usdcPriceInBigInt }: IReturnValueOfCalcTokenPrice = useContractRead({
    address: POOL_CONTRACT_ADDRESS,
    abi: POOL_CONTRACT_ABI,
    args: [USDC_CONTRACT_ADDRESS, parseUnits('1', USDC_DECIMAL)],
    functionName: 'calcTokenPrice',
  })

  const { data: liquidatationThresholdInBigInt } = useContractRead({
    address: POOL_CONTRACT_ADDRESS,
    abi: POOL_CONTRACT_ABI,
    functionName: 'getLiquidationThreshhold'
  })

  //  ----------------------------------------------------------------

  const users = useMemo(() => {
    if (listOfUsers) {
      return listOfUsers.filter(userInfo => userInfo.ethBorrowAmount || userInfo.usdtBorrowAmount)
    }
    return []
  }, [listOfUsers])

  const ethPriceInUsd = useMemo<number>(() => {
    if (ethPriceInBigInt) {
      return Number(formatEther(ethPriceInBigInt))
    }
    return 0
  }, [ethPriceInBigInt])

  const usdcPriceInUsd = useMemo<number>(() => {
    if (usdcPriceInBigInt) {
      return Number(formatEther(usdcPriceInBigInt))
    }
    return 0
  }, [usdcPriceInBigInt])

  const liquidationThreshold = useMemo<number>(() => {
    if (liquidatationThresholdInBigInt) {
      return Number(liquidatationThresholdInBigInt)
    }
    return 0
  }, [liquidatationThresholdInBigInt])

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
              {users?.map((userInfo, index) => (
                <MBRow key={index} userInfo={userInfo} ethPriceInUsd={Number(ethPriceInUsd)} usdcPriceInUsd={Number(usdcPriceInUsd)} liquidationThreshold={liquidationThreshold} />
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
                {users?.map((userInfo, index) => (
                  <DPRow 
                    key={index} 
                    userInfo={userInfo} 
                    ethPriceInUsd={Number(ethPriceInUsd)} 
                    usdcPriceInUsd={Number(usdcPriceInUsd)} 
                    liquidationThreshold={liquidationThreshold} 
                  />
                ))}
              </tbody>
            </Table>
          )}
        </>
      ) : (<></>)}
    </Container>
  )
}