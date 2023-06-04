import { lazy, useState } from "react";
import Container from "../../components/containers/Container";
import { TEMP_LPS } from "../../utils/constants";
import { ILP } from "../../utils/interfaces";
import { TBuySellTabValue } from "../../utils/types";
import OrdersCard from "./OrdersCard";
import MarketCard from "./MarketCard";

// ---------------------------------------------------------------------------------------------

const SelectLP = lazy(() => import('../../components/form/SelectLP'))
const BuySellCard = lazy(() => import('./BuySellCard'))
const BidCard = lazy(() => import('./BidCard'))

// ---------------------------------------------------------------------------------------------

export default function Trading() {
  const [lp, setLp] = useState<ILP | null>(TEMP_LPS[0])
  const [buySellTabValue, setBuySellTabValue] = useState<TBuySellTabValue>('buy')

  return (
    <Container className="my-8 flex flex-col gap-8">
      <div className="grid grid-cols-4">
        <div>
          <SelectLP
            lps={TEMP_LPS}
            selectedLP={lp}
            setSelectedLP={setLp}
          />
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2">
        <div className="col-span-2 bg-gray-900 flex flex-col justify-center">
          <p className="text-gray-100 text-center">Trading View</p>
        </div>
        <BuySellCard tabValue={buySellTabValue} setTabValue={setBuySellTabValue} />
        <BidCard setBuySellTabValue={setBuySellTabValue} />
        <OrdersCard className="col-span-3" />
        <MarketCard />
      </div>
    </Container>
  )
}