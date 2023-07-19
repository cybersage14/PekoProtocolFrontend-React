import { toast } from "react-toastify";
import { useAccount, useBalance, useContractWrite, usePrepareContractWrite, useWaitForTransaction } from "wagmi";
import Table from "../../../components/tableComponents/Table";
import Th from "../../../components/tableComponents/Th";
import Section from "../../../components/Section";
import Tr from "../../../components/tableComponents/Tr";
import Td from "../../../components/tableComponents/Td";
import { IUserInfo } from "../../../utils/interfaces";
import { IN_PROGRESS, PEKO_CONTRACT_ADDRESS, PEKO_DECIMAL, POOL_CONTRACT_ABI, POOL_CONTRACT_ADDRESS } from "../../../utils/constants";
import FilledButton from "../../../components/buttons/FilledButton";
import { formatUnits } from "viem";
import { useMediaQuery } from "react-responsive";
import { List, ListItem } from "@material-tailwind/react";

//  ------------------------------------------------------------------------------------------------------

interface IProps {
  userInfo: IUserInfo;
}

//  ------------------------------------------------------------------------------------------------------

export default function PekoSection({ userInfo }: IProps) {
  const isMobile = useMediaQuery({ maxWidth: 640 })
  const { address } = useAccount()

  //  --------------------------------------------------------------------

  const { data: pekoBalanceDataOfWallet } = useBalance({
    address,
    token: PEKO_CONTRACT_ADDRESS,
    watch: true
  })

  //  Claim Peko
  const { config: depositConfig } = usePrepareContractWrite({
    address: POOL_CONTRACT_ADDRESS,
    abi: POOL_CONTRACT_ABI,
    functionName: 'claimPeko',
  })
  const { write: claimPeko, data: claimPekoData } = useContractWrite(depositConfig);
  const { isLoading: claimPekoIsLoading } = useWaitForTransaction({
    hash: claimPekoData?.hash,
    onSuccess: () => {
      toast.success('Peko Claimed.')
    },
    onError: () => {
      toast.error('Claim occured error.')
    }
  })

  //  --------------------------------------------------------------------

  return (
    <Section title="Peko">
      {isMobile ? (
        <List className="block lg:hidden text-sm">
          <ListItem
            className="flex-col gap-2 text-gray-100 border-b border-gray-800 rounded-none"
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
              <span className="text-gray-500">{claimPekoIsLoading ? IN_PROGRESS : "Claim $Peko"}</span>
            </div>
          </ListItem>
        </List>
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
                  disabled={!claimPeko || claimPekoIsLoading}
                  onClick={() => claimPeko?.()}
                >
                  {claimPekoIsLoading ? IN_PROGRESS : "Claim $Peko"}
                </FilledButton>
              </Td>
            </Tr>
          </tbody>
        </Table>
      )}

    </Section>
  )
}