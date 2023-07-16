import { lazy, useMemo } from "react";
import PrimaryBoard from "../../../../components/boards/PrimaryBoard";
import Table from "../../../../components/tableComponents/Table";
import Th from "../../../../components/tableComponents/Th";
import { IUserInfo } from "../../../../utils/interfaces";
import { ASSETS, USDC_DECIMAL } from "../../../../utils/constants";
import { formatEther, formatUnits } from "viem";

//  ---------------------------------------------------------------------------------------------

const Row = lazy(() => import('./Row'))

//  ---------------------------------------------------------------------------------------------

interface IProps {
  userInfo: IUserInfo;
  ethPriceInUsd: number;
  usdcPriceInUsd: number;
}

//  ---------------------------------------------------------------------------------------------

export default function UserReservesBoard({ userInfo, ethPriceInUsd, usdcPriceInUsd }: IProps) {
  const totalAmountInUsd = useMemo<number>(() => {
    const depositAmountInUsd = Number(formatEther(userInfo.ethDepositAmount)) * ethPriceInUsd + Number(formatUnits(userInfo.usdtDepositAmount, USDC_DECIMAL)) * usdcPriceInUsd;
    const borrowAmountInUsd = Number(formatEther(userInfo.ethBorrowAmount)) * ethPriceInUsd + Number(formatUnits(userInfo.usdtBorrowAmount, USDC_DECIMAL)) * usdcPriceInUsd

    return depositAmountInUsd - borrowAmountInUsd
  }, [userInfo])

  return (
    <PrimaryBoard title="User Reserves" className="col-span-2 lg:col-span-1" action={<span className="text-gray-500">${totalAmountInUsd.toFixed(2)}</span>}>
      {/* <p className="text-gray-100 text-center">You have no profile to deposit or borrow.</p>
            <FilledButton>Create profile</FilledButton> */}
      <Table className="w-full">
        <thead>
          <tr>
            <Th label="Asset" />
            <Th label="APY" />
            <Th label="Amount" />
          </tr>
        </thead>

        <tbody>
          {ASSETS.map(asset => (
            <Row key={asset.id} asset={asset} ethPriceInUsd={ethPriceInUsd} usdcPriceInUsd={usdcPriceInUsd} />
          ))}
        </tbody>
      </Table>
    </PrimaryBoard>
  )
}