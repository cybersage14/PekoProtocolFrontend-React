import { lazy } from "react";
import PrimaryBoard from "../../../components/boards/PrimaryBoard";
import Section from "../../../components/Section";
import { IUserInfo } from "../../../utils/interfaces";

// --------------------------------------------------------------------------------------------

const UserReservesBoard = lazy(() => import('./UserReservesBoard'))
const LiquidationsBoard = lazy(() => import('./LiquidationsBoard'))

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

        <LiquidationsBoard userInfo={userInfo} ethPriceInUsd={ethPriceInUsd} usdcPriceInUsd={usdcPriceInUsd} />
      </div>
    </Section>
  )
}