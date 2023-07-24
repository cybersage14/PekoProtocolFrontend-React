import { useState } from "react";
import { useAccount, useBalance } from "wagmi";
import { useMediaQuery } from "react-responsive";
import { formatUnits } from "viem";
import Table from "../../../components/tableComponents/Table";
import Th from "../../../components/tableComponents/Th";
import Section from "../../../components/Section";
import Tr from "../../../components/tableComponents/Tr";
import Td from "../../../components/tableComponents/Td";
import { IUserInfo } from "../../../utils/interfaces";
import { PEKO_CONTRACT_ADDRESS, PEKO_DECIMAL } from "../../../utils/constants";
import FilledButton from "../../../components/buttons/FilledButton";
import ClaimPekoDialog from "./ClaimPekoDialog";

//  ------------------------------------------------------------------------------------------------------

interface IProps {
  userInfo: IUserInfo;
}

//  ------------------------------------------------------------------------------------------------------

export default function PekoSection({ userInfo }: IProps) {
  const isMobile = useMediaQuery({ maxWidth: 640 })
  const { address } = useAccount()

  const [dialogVisible, setDialogVisible] = useState<boolean>(false)

  //  --------------------------------------------------------------------

  const { data: pekoBalanceDataOfWallet } = useBalance({
    address,
    token: PEKO_CONTRACT_ADDRESS,
    watch: true
  })

  //  --------------------------------------------------------------------

  return (
    <Section title="Peko">
      {isMobile ? (
        <div className="flex flex-col text-sm gap-4">
          <div
            className="flex flex-col gap-4 text-gray-100 border-b border-gray-800 rounded-none pb-6"
          >
            {/* Symbol */}
            <div className="flex justify-between w-full">
              <span className="text-gray-500 font-bold">Symbol: </span>
              <div className="flex items-center gap-2">
                <img src="/assets/images/logo.png" alt="" className="w-8" />
                <span className="font-semibold uppercase">PEKO</span>
              </div>
            </div>

            {/* Unclaimed Peko */}
            <div className="flex justify-between w-full">
              <span className="text-gray-500 font-bold">Unclaimed Peko: </span>
              <span>{formatUnits(userInfo.pekoRewardAmount, PEKO_DECIMAL)} PEKO</span>
            </div>

            {/* Wallet Balance */}
            <div className="flex justify-between w-full">
              <span className="text-gray-500 font-bold">Wallet Balance: </span>
              <span className="text-gray-500">{Number(pekoBalanceDataOfWallet?.formatted).toFixed(2)} PEKO</span>
            </div>

            {/* Operation */}
            <div className="flex justify-between w-full">
              <span className="text-gray-500 font-bold">Oepration: </span>
              <FilledButton
                className="w-32"
                onClick={() => setDialogVisible(true)}
              >
                Claim
              </FilledButton>
            </div>
          </div>
        </div>
      ) : (
        <Table>
          <thead>
            <tr className="bg-gray-900">
              <Th label="Symbol" />
              <Th label="Unclaimed Peko" />
              <Th label="Wallet Balance" />
              <Th label="Operation" />
            </tr>
          </thead>

          <tbody>
            <Tr>
              <Td>
                <div className="flex items-center gap-2">
                  <img src="/assets/images/logo.png" alt="" className="w-8" />
                  <span className="font-semibold uppercase">PEKO</span>
                </div>
              </Td>
              <Td className="text-gray-100 font-bold">
                {formatUnits(userInfo.pekoRewardAmount, PEKO_DECIMAL)} PEKO
              </Td>
              <Td className="text-gray-100 font-bold">
                {Number(pekoBalanceDataOfWallet?.formatted).toFixed(2)} PEKO
              </Td>
              <Td>
                <FilledButton
                  className="w-32"
                  onClick={() => setDialogVisible(true)}
                >
                  Claim
                </FilledButton>
              </Td>
            </Tr>
          </tbody>
        </Table>
      )}
      <ClaimPekoDialog userInfo={userInfo} visible={dialogVisible} setVisible={setDialogVisible} />
    </Section>
  )
}