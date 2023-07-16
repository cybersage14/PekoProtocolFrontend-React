import PrimaryBoard from "../../../components/boards/PrimaryBoard";
import Section from "../../../components/Section";
import { IUserInfo } from "../../../utils/interfaces";
import UserReservesBoard from "./UserReservesBoard";

// --------------------------------------------------------------------------------------------

interface IProps {
  userInfo: IUserInfo;
  ethPriceInUsd: number;
  usdcPriceInUsd: number;
}

// --------------------------------------------------------------------------------------------

export default function UserProfileSection({ userInfo, ethPriceInUsd, usdcPriceInUsd }: IProps) {

  return (
    <Section title="User Profile">
      <div className="grid grid-cols-2 gap-4 h-fit lg:h-64">
        <UserReservesBoard userInfo={userInfo} ethPriceInUsd={ethPriceInUsd} usdcPriceInUsd={usdcPriceInUsd} />

        <PrimaryBoard title="Liquidations" className="col-span-2 lg:col-span-1">
          <div className="py-4 flex flex-col justify-center h-full">
            <p className="text-gray-100 text-center">No Actions</p>
          </div>
        </PrimaryBoard>
      </div>
    </Section>
  )
}