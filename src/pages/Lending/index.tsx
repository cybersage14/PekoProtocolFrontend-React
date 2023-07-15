import { lazy, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Icon } from "@iconify/react";
import { useMediaQuery } from 'react-responsive';
import { List, ListItem } from "@material-tailwind/react";
import { toast } from "react-toastify";
import { useAccount, useBalance, useContractRead } from "wagmi";
import Container from "../../components/containers/Container";
import InfoCard from "../../components/cards/InfoCard";
import OutlinedButton from "../../components/buttons/OutlinedButton";
import MainInput from "../../components/form/MainInput";
import CollapsibleBoard from "../../components/boards/CollapsibleBoard";
import PrimaryBoard from "../../components/boards/PrimaryBoard";
import Th from "../../components/tableComponents/Th";
import Td from "../../components/tableComponents/Td";
import Tr from "../../components/tableComponents/Tr";
import ProgressBar from "../../components/ProgressBar";
import Table from "../../components/tableComponents/Table";
import { POOL_CONTRACT_ABI, POOL_CONTRACT_ADDRESS, TEMP_CRYPTO_LOGO_URL, USDC_CONTRACT_ADDRESS, USDC_DECIMAL, WETH_CONTRACT_ADDRESS } from "../../utils/constants";
import { TAssetSymbol } from "../../utils/types";
import { IAssetMetadata, IReturnValueOfCalcTokenPrice, IReturnValueOfPoolInfo } from "../../utils/interfaces";
import DPRow from "./DPRow";
import { formatUnits, parseEther, parseUnits } from "viem";

// -----------------------------------------------------------------------------------

const AssetDialog = lazy(() => import('./AssetDialog'))

// -----------------------------------------------------------------------------------

const ASSETS: Array<IAssetMetadata> = [
  {
    id: 1,
    name: "Ethereum",
    symbol: "eth",
    imgSrc: "/assets/images/ethereum.png",
    contractAddress: WETH_CONTRACT_ADDRESS
  },
  {
    id: 2,
    name: "USD Coin",
    symbol: "usdc",
    imgSrc: "/assets/images/usdc.png",
    contractAddress: USDC_CONTRACT_ADDRESS
  }
]

// -----------------------------------------------------------------------------------

export default function Lending() {
  //  Context hooks -----------------------------------------------------
  const isMobile = useMediaQuery({ maxWidth: 1024 });
  const { isConnected, address } = useAccount();

  //  States  -----------------------------------------------------------
  const [dialogVisible, setDialogVisible] = useState<boolean>(false)
  const [assetSymbol, setAssetSymbol] = useState<TAssetSymbol>('eth');

  //  Wagmi hooks -------------------------------------------------------
  
  //  Balance data
  const { data: balanceData } = useBalance({
    address,
    token: assetSymbol === 'usdc' ? USDC_CONTRACT_ADDRESS : undefined,
    watch: true
  })

  console.log('>>>>>>>>>> balanceData => ', balanceData)

  const { data: poolInfos }: IReturnValueOfPoolInfo = useContractRead({
    address: POOL_CONTRACT_ADDRESS,
    abi: POOL_CONTRACT_ABI,
    functionName: 'listPools'
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

  //  Functions ---------------------------------------------------------
  const openDialog = (_assetSymbol: TAssetSymbol) => {
    setAssetSymbol(_assetSymbol);
    if (isConnected) {
      return setDialogVisible(true);
    } else {
      return toast.info('Please connect your wallet.');
    }
  }

  //  useMemo ------------------------------------------------------------

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

  //  --------------------------------------------------------------------

  return (
    <Container className="my-8">
      <div className="grid grid-cols-5 gap-8">
        <div className="col-span-5 lg:col-span-4">
          <div className="flex flex-col gap-4">
            {/* Infos and Liquidate button */}
            <div className="hidden lg:flex items-center justify-between">
              <div className="flex items-center gap-2">
                <InfoCard
                  label="Current Market Size"
                  value="761K"
                  unit="$"
                />
                <InfoCard
                  label="Total Borrowed"
                  value="93K"
                  unit="$"
                />
                <InfoCard
                  label="Lent Out"
                  value="12.2%"
                />
              </div>

              <Link to="/liquidate">
                <OutlinedButton>
                  Liquidate
                </OutlinedButton>
              </Link>
            </div>

            <div className="lg:hidden grid grid-cols-2 gap-2">
              <InfoCard
                label="Current Market Size"
                value="761K"
                unit="$"
              />
              <InfoCard
                label="Total Borrowed"
                value="93K"
                unit="$"
              />
              <InfoCard
                label="Lent Out"
                value="12.2%"
              />
              <Link to="/liquidate">
                <OutlinedButton className="w-full">
                  Liquidate
                </OutlinedButton>
              </Link>
            </div>

            {/* Assets board */}
            <CollapsibleBoard title="Assets" collapsible>
              <div className="flex flex-col gap-4">
                <div className="px-4 pt-4">
                  <div className="w-full lg:w-1/3">
                    <MainInput
                      startAdornment={<Icon icon="material-symbols:search" className="text-gray-700 text-lg" />}
                      className="bg-gray-900"
                      classNameOfInput="bg-gray-900"
                      placeholder="Search token"
                    />
                  </div>
                </div>

                {isMobile ? (
                  <List className="block lg:hidden text-sm">
                    {ASSETS.map(asset => (
                      <ListItem
                        key={asset.id}
                        className="flex-col gap-2 text-gray-100 border-b border-gray-800 rounded-none"
                        onClick={() => openDialog(asset.symbol)}
                      >
                        <div className="flex justify-between w-full">
                          <span className="text-gray-500 font-bold">Asset Name: </span>
                          <div className="flex items-center gap-2">
                            <img src={asset.imgSrc} alt="" className="w-10" />
                            <div className="flex flex-col">
                              <span className="font-semibold">{asset.name}</span>
                              <span className="text-sm text-gray-500">$0.999925</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-between w-full">
                          <span className="text-gray-500 font-bold">LTV: </span>
                          <span>50%</span>
                        </div>

                        <div className="flex justify-between w-full">
                          <span className="text-gray-500 font-bold">Deposit APY: </span>
                          <span className="text-green-500">0.04%</span>
                        </div>

                        <div className="flex justify-between w-full">
                          <span className="text-gray-500 font-bold">Borrow APY: </span>
                          <div className="flex flex-col">
                            <span className="font-semibold">187,300 USDC</span>
                            <span className="text-sm text-gray-500">$187,310.64</span>
                          </div>
                        </div>

                        <div className="flex justify-between w-full">
                          <span className="text-gray-500 font-bold">Total Borrowed: </span>
                          <span className="text-red-500">0.04%</span>
                        </div>

                        <div className="flex justify-between w-full">
                          <span className="text-gray-500 font-bold">Wallet: </span>
                          <div className="flex flex-col">
                            <span className="font-semibold">0 Cake</span>
                            <span className="text-sm text-gray-500">$0.00</span>
                          </div>
                        </div>
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Table>
                    <thead>
                      <tr>
                        <Th label="Asset Name" sortable />
                        <Th label="LTV" sortable />
                        <Th label="Deposit APY" sortable />
                        <Th label="Market Size" sortable />
                        <Th label="Borrow APY" sortable />
                        <Th label="Total Borrowed" sortable />
                        <Th label="Wallet" sortable />
                      </tr>
                    </thead>

                    <tbody>
                      {ASSETS.map(asset => (
                        <DPRow key={asset.id} asset={asset} openDialog={openDialog} ethPriceInUsd={ethPriceInUsd} usdcPriceInUsd={usdcPriceInUsd} />
                      ))}
                    </tbody>
                  </Table>
                )}
              </div>
            </CollapsibleBoard>
          </div>
        </div >

        <div className="col-span-5 lg:col-span-1 flex flex-col gap-4">
          {/* Account Board */}
          <PrimaryBoard
            title="Account"
            action={<span className="text-gray-500 text-sm">Connect Wallet</span>}
          >
            <div className="p-4 flex flex-col gap-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-md border border-gray-800 py-2 px-2 flex flex-col items-center">
                  <span className="text-gray-500 text-sm">APY</span>
                  <span className="text-green-500 font-semibold">0.00%</span>
                </div>
                <div className="rounded-md border border-gray-800 py-2 px-2 flex flex-col items-center">
                  <span className="text-gray-500 text-sm">Borrowed</span>
                  <span className="text-green-500 font-semibold">0.00%</span>
                </div>
                <div className="rounded-md border border-gray-800 py-2 px-2 flex flex-col items-center">
                  <span className="text-gray-500 text-sm">Risk Factor</span>
                  <span className="text-green-500 font-semibold">0.00%</span>
                </div>
              </div>

              <ProgressBar
                label="Borrowing Power"
                value={22.34}
                valueNode={<span className="text-red-500">22.34%</span>}
              />

              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 text-sm">Available</span>
                  <span className="text-gray-100">65.45%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 text-sm">Risk Factor</span>
                  <span className="text-red-500">45.65%</span>
                </div>
              </div>
            </div>
          </PrimaryBoard>

          {/* Deposits Board */}
          <PrimaryBoard title="Deposits" action={<span className="text-gray-100">$11.22</span>}>
            <div className="p-4 flex items-center justify-between text-gray-100">
              <div className="flex items-center gap-2">
                <img src={TEMP_CRYPTO_LOGO_URL} alt="" className="w-10" />
                <div className="flex flex-col">
                  <span className="font-semibold">USDC</span>
                  <span className="text-sm text-gray-500">$0.999925</span>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <span className="font-semibold">11.22 USDC</span>
                <span className="text-sm text-gray-500">$11.22</span>
              </div>
            </div>
          </PrimaryBoard>

          {/* Borrow Board */}
          <PrimaryBoard title="Borrow" action={<span className="text-gray-100">$11.22</span>}>
            <div className="p-4 flex items-center justify-between text-gray-100">
              <div className="flex items-center gap-2">
                <img src={TEMP_CRYPTO_LOGO_URL} alt="" className="w-10" />
                <div className="flex flex-col">
                  <span className="font-semibold">USDC</span>
                  <span className="text-sm text-gray-500">$0.999925</span>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <span className="font-semibold">11.22 USDC</span>
                <span className="text-sm text-gray-500">$11.22</span>
              </div>
            </div>
          </PrimaryBoard>
        </div>
      </div >
      <AssetDialog
        visible={dialogVisible}
        setVisible={setDialogVisible}
        assetSymbol={assetSymbol}
      />
    </Container >
  )
}