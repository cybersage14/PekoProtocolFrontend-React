import { lazy } from "react";
import Table from "../../../components/tableComponents/Table";
import Th from "../../../components/tableComponents/Th";
import Section from "../../../components/Section";
import { ASSETS } from "../../../utils/constants";
import { useMediaQuery } from "react-responsive";
import { List } from "@material-tailwind/react";

//  ------------------------------------------------------------------------------------------------------

const DPRow = lazy(() => import('./DPRow'))
const MBRow = lazy(() => import('./MBRow'))

//  ------------------------------------------------------------------------------------------------------

interface IProps {
  ethPriceInUsd: number;
  usdcPriceInUsd: number;
}

//  ------------------------------------------------------------------------------------------------------

export default function DepositsSection({ ethPriceInUsd, usdcPriceInUsd }: IProps) {
  const isMobile = useMediaQuery({ maxWidth: 640 });

  return (
    <Section title="Tokens">
      {isMobile ? (
        <List className="block lg:hidden text-sm">
          {ASSETS.map(asset => (
            <MBRow key={asset.id} asset={asset} ethPriceInUsd={ethPriceInUsd} usdcPriceInUsd={usdcPriceInUsd} />
          ))}
        </List>
      ) : (
        <Table>
          <thead>
            <tr className="bg-gray-900">
              <Th label="Symbol" />
              <Th label="Balance" />
              <Th label="Price" />
              <Th label="Value" />
            </tr>
          </thead>

          <tbody>
            {ASSETS.map(asset => (
              <DPRow key={asset.id} asset={asset} ethPriceInUsd={ethPriceInUsd} usdcPriceInUsd={usdcPriceInUsd} />
            ))}
          </tbody>
        </Table>
      )}

    </Section>
  )
}