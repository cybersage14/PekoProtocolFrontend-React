import Table from "../../components/tableComponents/Table";
import Td from "../../components/tableComponents/Td";
import Th from "../../components/tableComponents/Th";
import Tr from "../../components/tableComponents/Tr";
import { IPropsOfComponent } from "../../utils/interfaces";

export default function MarketCard({ className = '' }: IPropsOfComponent) {
  return (
    <div className={`bg-gray-900 rounded-md p-4 ${className}`}>
      <p className="text-sm text-gray-100">Market Trades</p>
      <Table className="w-full">
        <thead>
          <tr>
            <Th label="Side" />
            <Th label="Size(USDC)" />
            <Th label="Price(tUSDC)" />
            <Th label="Version" />
          </tr>
        </thead>
        <tbody>
          <Tr>
            <Td className="!py-1 text-red-500">ASK</Td>
            <Td className="!py-1">0.1</Td>
            <Td className="!py-1">6</Td>
            <Td className="!py-1 text-gray-500">4844444</Td>
          </Tr>
        </tbody>
      </Table>
    </div>
  )
}