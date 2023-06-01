import { Link } from "react-router-dom";
import { Icon } from "@iconify/react";
import Container from "../../components/Container";
import InfoCard from "../../components/cards/InfoCard";
import OutlinedButton from "../../components/buttons/OutlinedButton";
import MainInput from "../../components/MainInput";
import CollapsibleBoard from "../../components/boards/CollapsibleBoard";
import PrimaryBoard from "../../components/boards/PrimaryBoard";
import Th from "../../components/tableComponents/Th";
import Td from "../../components/tableComponents/Td";
import Tr from "../../components/tableComponents/Tr";
import ProgressBar from "../../components/ProgressBar";
import Table from "../../components/tableComponents/Table";
import { TEMP_CRYPTO_LOGO_URL } from "../../utils/constants";

// -----------------------------------------------------------------------------------

const TEMP_INDEXES_OF_TABLE: Array<number> = [1, 2, 3, 4, 5, 6, 7];

// -----------------------------------------------------------------------------------

export default function Lending() {
  return (
    <Container className="my-8">
      <div className="grid grid-cols-5 gap-8">
        <div className="col-span-4">
          <div className="flex flex-col gap-4">
            {/* Infos and Liquidate button */}
            <div className="flex items-center justify-between">
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

            {/* Assets board */}
            <CollapsibleBoard title="Assets" collapsible>
              <div className="flex flex-col gap-4">
                <div className="px-4">
                  <div className="w-1/3">
                    <MainInput
                      startAdornment={<Icon icon="material-symbols:search" className="text-gray-700 text-lg" />}
                      placeholder="Search token"
                    />
                  </div>
                </div>

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
                    {TEMP_INDEXES_OF_TABLE.map(index => (
                      <Tr key={index} className="hover:bg-gray-900">
                        <Td>
                          <div className="flex items-center gap-2">
                            <img src={TEMP_CRYPTO_LOGO_URL} alt="" className="w-10" />
                            <div className="flex flex-col">
                              <span className="font-semibold">USDC</span>
                              <span className="text-sm text-gray-500">$0.999925</span>
                            </div>
                          </div>
                        </Td>
                        <Td>50%</Td>
                        <Td className="text-green-500">0.04%</Td>
                        <Td>
                          <div className="flex flex-col">
                            <span className="font-semibold">187,300 USDC</span>
                            <span className="text-sm text-gray-500">$187,310.64</span>
                          </div>
                        </Td>
                        <Td className="text-red-500">0.04%</Td>
                        <Td>
                          <div className="flex flex-col">
                            <span className="font-semibold">42,260 USDC</span>
                            <span className="text-sm text-gray-500">$42,253.77</span>
                          </div>
                        </Td>
                        <Td>
                          <div className="flex flex-col">
                            <span className="font-semibold">0 Cake</span>
                            <span className="text-sm text-gray-500">$0.00</span>
                          </div>
                        </Td>
                      </Tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </CollapsibleBoard>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {/* Account Board */}
          <PrimaryBoard
            title="Account"
            action={<span className="text-gray-500 text-sm">Connect Wallet</span>}
          >
            <div className="px-3 mb-6 flex flex-col gap-4">
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
            <div className="mb-6 px-3 flex items-center justify-between text-gray-100">
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
            <div className="mb-6 px-3 flex items-center justify-between text-gray-100">
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
      </div>
    </Container>
  )
}