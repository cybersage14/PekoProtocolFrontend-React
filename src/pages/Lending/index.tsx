import { Link } from "react-router-dom";
import { Icon } from "@iconify/react";
import Container from "../../components/Container";
import InfoCard from "../../components/cards/InfoCard";
import OutlinedButton from "../../components/buttons/OutlinedButton";
import MainInput from "../../components/MainInput";
import Th from "../../components/tableComponents/Th";
import Board from "../../components/Board";
import Td from "../../components/tableComponents/Td";

// -----------------------------------------------------------------------------------

const TEMP_INDEXES_OF_TABLE: Array<number> = [1, 2, 3, 4, 5, 6, 7];

// -----------------------------------------------------------------------------------

export default function Lending() {
  return (
    <Container className="my-8">
      <div className="grid grid-cols-5 gap-12">
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
            <Board title="Assets" collapsible>
              <div className="flex flex-col gap-4">
                <div className="px-4">
                  <div className="w-1/3">
                    <MainInput
                      startAdornment={<Icon icon="material-symbols:search" className="text-gray-700 text-lg" />}
                      placeholder="Search token"
                    />
                  </div>
                </div>

                <table className="table-auto">
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
                      <tr key={index}>
                        <Td>
                          <div className="flex items-center gap-2">
                            <img src="https://cryptologos.cc/logos/usd-coin-usdc-logo.svg?v=025" alt="" className="w-10" />
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
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Board>
          </div>
        </div>

        <div></div>
      </div>
    </Container>
  )
}