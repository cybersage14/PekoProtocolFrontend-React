import { useMemo, useState } from "react";
import { List, ListItem, Switch } from "@material-tailwind/react";
import { useMediaQuery } from "react-responsive";
import { useContractRead } from "wagmi";
import { formatEther, parseEther, parseUnits } from "viem";
import Container from "../../components/containers/Container";
import Table from "../../components/tableComponents/Table";
import Th from "../../components/tableComponents/Th";
import { getVisibleWalletAddress } from "../../utils/functions";
import { POOL_CONTRACT_ABI, POOL_CONTRACT_ADDRESS, TEMP_CRYPTO_LOGO_URL, USDC_CONTRACT_ADDRESS, USDC_DECIMAL, WETH_CONTRACT_ADDRESS } from "../../utils/constants";
import FilledButton from "../../components/buttons/FilledButton";
import { IReturnValueOfCalcTokenPrice, IReturnValueOfListOfUsers } from "../../utils/interfaces";
import DPRow from "./DPRow";

// -----------------------------------------------------------------------------------

const TEMP_INDEXES_OF_TABLE: Array<number> = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

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

      {isMobile ? visible ? (
        <List className="text-sm">
          {TEMP_INDEXES_OF_TABLE.map(index => (
            <ListItem
              key={index}
              className="flex-col gap-2 text-gray-100 border-b border-gray-800 rounded-none"
            >
              <div className="flex justify-between w-full">
                <span className="text-gray-500 font-bold">User: </span>
                <span className="!text-blue-500">{getVisibleWalletAddress('0x5da095266ec7ec1d979f01a9d7e4ee902e0182bc')}</span>
              </div>
              <div className="flex justify-between w-full">
                <span className="text-gray-500 font-bold">Borrowed Asset(s): </span>
                <div className="flex justify-center">
                  <img src={TEMP_CRYPTO_LOGO_URL} alt="" className="w-10" />
                </div>
              </div>
              <div className="flex justify-between w-full">
                <span className="text-gray-500 font-bold">Borrowed Value: </span>
                <span>$0.08213020982964468</span>
              </div>
              <div className="flex justify-between w-full">
                <span className="text-gray-500 font-bold">Deposited Asset(s): </span>
                <div className="flex justify-center">
                  <img src={TEMP_CRYPTO_LOGO_URL} alt="" className="w-10" />
                </div>
              </div>
              <div className="flex justify-between w-full">
                <span className="text-gray-500 font-bold">Deposited Value: </span>
                <span>$0.00046209994186645765</span>
              </div>
              <div className="flex justify-between w-full">
                <span className="text-gray-500 font-bold">Risk Factor: </span>
                <span className="text-red-500">23691%</span>
              </div>
              <div className="flex justify-between w-full">
                <span className="text-gray-500 font-bold">Operation: </span>
                <FilledButton>Liquidate</FilledButton>
              </div>
            </ListItem>
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
          {visible && ethPriceInUsd && usdcPriceInUsd ? (
            <tbody>
              {users?.map((userInfo, index) => (
                <DPRow key={index} userInfo={userInfo} ethPriceInUsd={Number(ethPriceInUsd)} usdcPriceInUsd={Number(usdcPriceInUsd)} liquidationThreshold={liquidationThreshold} />
              ))}
            </tbody>
          ) : (<></>)}
        </Table>
      )}
    </Container>
  )
}