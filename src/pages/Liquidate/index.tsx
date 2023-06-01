import { useState } from "react";
import { Switch } from "@material-tailwind/react";
import Container from "../../components/Container";
import Table from "../../components/tableComponents/Table";
import Th from "../../components/tableComponents/Th";
import Tr from "../../components/tableComponents/Tr";
import Td from "../../components/tableComponents/Td";
import { getVisibleWalletAddress } from "../../utils/functions";
import { TEMP_CRYPTO_LOGO_URL } from "../../utils/constants";
import FilledButton from "../../components/buttons/FilledButton";

// -----------------------------------------------------------------------------------

const TEMP_INDEXES_OF_TABLE: Array<number> = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

// -----------------------------------------------------------------------------------

export default function Liquidate() {
  const [visible, setVisible] = useState<boolean>(true)

  return (
    <Container className="container my-8 flex flex-col gap-8">
      <header className="flex flex-col items-center gap-4">
        <h1 className="text-gray-100 text-3xl text-center">Liquidate</h1>
        <p className="text-center text-base text-gray-500">
          Liquidate to earn extra reward!
        </p>
        <div className="flex items-center gap-4">
          <label htmlFor="ignore" className="text-gray-100 cursor-pointer">Ignore small debt</label>
          <Switch
            id="ignore"
            className="bg-gray-800"
            checked={!visible}
            onChange={() => setVisible(!visible)}
          />
        </div>
      </header>

      <Table>
        <thead>
          <tr className="bg-gray-900">
            <Th label="User" />
            <Th label="Profile" />
            <Th label="Borrowed Asset(s)" />
            <Th label="Borrowed Value" sortable />
            <Th label="Deposited Asset(s)" />
            <Th label="Deposited Value" sortable />
            <Th label="Risk Factor" sortable />
            <Th label="Operation" />
          </tr>
        </thead>
        {visible && (
          <tbody>
            {TEMP_INDEXES_OF_TABLE.map(index => (
              <Tr key={index}>
                <Td className="!text-blue-500">{getVisibleWalletAddress('0x5da095266ec7ec1d979f01a9d7e4ee902e0182bc')}</Td>
                <Td>Main Account</Td>
                <Td>
                  <div className="flex justify-center">
                    <img src={TEMP_CRYPTO_LOGO_URL} alt="" className="w-10" />
                  </div>
                </Td>
                <Td>$0.08213020982964468</Td>
                <Td>
                  <div className="flex justify-center">
                    <img src={TEMP_CRYPTO_LOGO_URL} alt="" className="w-10" />
                  </div>
                </Td>
                <Td>$0.00046209994186645765</Td>
                <Td className="text-red-500">23691%</Td>
                <Td>
                  <FilledButton>Liquidate</FilledButton>
                </Td>
              </Tr>
            ))}
          </tbody>
        )}
      </Table>
    </Container>
  )
}