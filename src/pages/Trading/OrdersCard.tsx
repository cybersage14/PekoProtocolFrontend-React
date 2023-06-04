import { useState } from "react";
import TextButton from "../../components/buttons/TextButton";
import { IPropsOfComponent } from "../../utils/interfaces";
import Table from "../../components/tableComponents/Table";
import Th from "../../components/tableComponents/Th";
import Tr from "../../components/tableComponents/Tr";
import Td from "../../components/tableComponents/Td";
import { TEMP_CRYPTO_LOGO_URL } from "../../utils/constants";

type TTabValue = 'orders' | 'balances';

export default function OrdersCard({ className = '' }: IPropsOfComponent) {
  const [tabValue, setTabValue] = useState<TTabValue>('orders')

  return (
    <div className={`bg-gray-900 rounded-md py-4 ${className}`}>
      {/* Tab buttons */}
      <div className="flex">
        <TextButton
          className={`border-b-2 rounded-none py-4 px-8 text-base ${tabValue === 'orders' ? 'border-blue-500' : 'border-transparent'}`}
          onClick={() => setTabValue('orders')}
        >Orders</TextButton>
        <TextButton
          className={`border-b-2 rounded-none py-4 px-8 text-base ${tabValue === 'balances' ? 'border-blue-500' : 'border-transparent'}`}
          onClick={() => setTabValue('balances')}
        >Balances</TextButton>
      </div>

      {tabValue === 'orders' ? (
        <Table className="w-full">
          <thead>
            <tr>
              <Th label="Trading Pair" />
              <Th label="Type" />
              <Th label="Amount" />
              <Th label="Price" />
              <Th label="Total" />
              <Th label="Actions" />
            </tr>
          </thead>
          <tbody>
            <Tr>
              <Td>
                <div className="flex items-center gap-6">
                  <div className="w-fit h-fit relative">
                    <img src={TEMP_CRYPTO_LOGO_URL} alt="" className="w-7" />
                    <img src={TEMP_CRYPTO_LOGO_URL} alt="" className="w-7 absolute top-0 left-[60%]" />
                  </div>
                  <span className="text-gray-100">APT / tUSDC</span>
                </div>
              </Td>
              <Td className="text-green-500">ASK</Td>
              <Td>0.1 APT</Td>
              <Td>25 tUSDC</Td>
              <Td>2.5 tUSDC</Td>
              <Td><TextButton className="text-red-500 text-base">Cancel</TextButton></Td>
            </Tr>
          </tbody>
        </Table>
      ) : (
        <Table className="w-full">
          <thead>
            <tr>
              <Th label="Asset" />
              <Th label="Withdrawable" />
              <Th label="Total Balance" />
              <Th label="Wallet" />
              <Th label="Actions" />
            </tr>
          </thead>
          <tbody>
            <Tr>
              <Td>
                <div className="flex items-center gap-2">
                  <img src={TEMP_CRYPTO_LOGO_URL} alt="" className="w-7" />
                  <span className="text-gray-100">APT</span>
                </div>
              </Td>
              <Td>
                <div className="flex flex-col">
                  <span className="text-gray-100">0 APT</span>
                  <span className="text-gray-500 text-sm">$0.00</span>
                </div>
              </Td>
              <Td>
                <div className="flex flex-col">
                  <span className="text-gray-100">0 APT</span>
                  <span className="text-gray-500 text-sm">$0.00</span>
                </div>
              </Td>
              <Td>
                <div className="flex flex-col">
                  <span className="text-gray-100">0 APT</span>
                  <span className="text-gray-500 text-sm">$0.00</span>
                </div>
              </Td>

              <Td>
                <div className="flex items-center gap-1">
                  <TextButton className="text-green-500 text-base">Deposit</TextButton>
                  <TextButton className="text-red-500 text-base">Withdraw</TextButton>
                </div>
              </Td>
            </Tr>
          </tbody>
        </Table>
      )}
    </div >
  )
}