import { Progress } from "@material-tailwind/react";
import Table from "../../components/tableComponents/Table";
import Th from "../../components/tableComponents/Th";
import Tr from "../../components/tableComponents/Tr";
import Td from "../../components/tableComponents/Td";
import { TEMP_CRYPTO_LOGO_URL } from "../../utils/constants";
import { IPropsOfComponent } from "../../utils/interfaces";

// -----------------------------------------------------------------------------------

const TEMP_INDEXES_OF_TABLE: Array<number> = [1, 2, 3, 4, 5, 6, 7];

// -----------------------------------------------------------------------------------

export default function BorrowPanel({ className = '', ...others }: IPropsOfComponent) {
  return (
    <div className={`w-96 bg-gray-900 p-4 flex flex-col gap-4 rounded-md ${className}`} {...others}>
      <h2 className="text-gray-100 text-lg">Borrow API</h2>
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Borrowing Amount</span>
          <span className="text-blue-500">0 APT</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Borrowable</span>
          <span className="text-gray-100">0 APT</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">APY</span>
          <span className="text-red-500">1.15%</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Borrower Power</span>
          <div className="flex items-center gap-1">
            <Progress value={10} className="w-24 bg-gray-800" size="sm" />
            <span className="text-gray-100">10%</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <span className="text-gray-500 text-sm">Your Assets</span>
        <div className="h-[340px] w-full overflow-auto">
          <Table className="bg-black relative w-full h-fit">
            <thead>
              <tr className="border-b border-gray-900">
                <Th label="Asset" />
                <Th label="Deposit" />
                <Th label="Borrow" />
              </tr>
            </thead>
            <tbody>
              {TEMP_INDEXES_OF_TABLE.map(index => (
                <Tr key={index} className="text-sm">
                  <Td className="!py-3">
                    <div className="flex items-center gap-1">
                      <img src={TEMP_CRYPTO_LOGO_URL} alt="" className="w-6" />
                      <span>APT</span>
                    </div>
                  </Td>
                  <Td className="!py-3">
                    <div className="flex flex-col">
                      <span>0</span>
                      <span className="text-gray-500">$0.00</span>
                    </div>
                  </Td>
                  <Td className="!py-3">
                    <div className="flex flex-col">
                      <span>0</span>
                      <span className="text-gray-500">$0.00</span>
                    </div>
                  </Td>
                </Tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>
    </div>
  )
}