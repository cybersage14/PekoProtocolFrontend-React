import { lazy } from "react";
import PrimaryBoard from "../../../../components/boards/PrimaryBoard";
import Table from "../../../../components/tableComponents/Table";
import Th from "../../../../components/tableComponents/Th";
import { IUserInfo } from "../../../../utils/interfaces";

//  -----------------------------------------------------------------------------------------

const Row = lazy(() => import('./Row'))

//  -----------------------------------------------------------------------------------------

interface IProps {
  userInfo: IUserInfo;
  ethPriceInUsd: number;
  usdcPriceInUsd: number;
}

//  -----------------------------------------------------------------------------------------

export default function LiquidationsBoard({ userInfo, ethPriceInUsd, usdcPriceInUsd }: IProps) {
  return (
    <PrimaryBoard title="Liquidations" className="col-span-2 lg:col-span-1">
      <Table className="w-full">
        <thead>
          <tr>
            <Th label="Borrowed Value" />
            <Th label="Deposited Value" />
            <Th label="Risk Factor" />
            <Th label="Operation" />
          </tr>
        </thead>

        <tbody>
          <Row userInfo={userInfo} ethPriceInUsd={ethPriceInUsd} usdcPriceInUsd={usdcPriceInUsd} />
        </tbody>
      </Table>
    </PrimaryBoard>
  )
}