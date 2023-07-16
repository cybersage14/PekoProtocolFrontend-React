import { lazy } from "react";
import Table from "../../../components/tableComponents/Table";
import Th from "../../../components/tableComponents/Th";
import Section from "../../../components/Section";
import { ASSETS } from "../../../utils/constants";

//  ------------------------------------------------------------------------------------------------------

const Row = lazy(() => import('./Row'))

//  ------------------------------------------------------------------------------------------------------

interface IProps {
  ethPriceInUsd: number;
  usdcPriceInUsd: number;
}

//  ------------------------------------------------------------------------------------------------------

export default function DepositsSection({ ethPriceInUsd, usdcPriceInUsd }: IProps) {
  return (
    <Section title="Tokens">
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
            <Row key={asset.id} asset={asset} ethPriceInUsd={ethPriceInUsd} usdcPriceInUsd={usdcPriceInUsd} />
          ))}
        </tbody>
      </Table>
    </Section>
  )
}