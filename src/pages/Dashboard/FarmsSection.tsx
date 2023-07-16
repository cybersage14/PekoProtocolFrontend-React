import Table from "../../components/tableComponents/Table";
import Th from "../../components/tableComponents/Th";
import Section from "../../components/Section";

export default function FarmsSection() {
  return (
    <Section title="Farms" action={<span className="text-gray-100 text-lg">$0.00</span>}>
      <Table>
        <thead>
          <tr className="bg-gray-900">
            <Th label="Platform" sortable />
            <Th label="Asset" />
            <Th label="Balance" sortable />
            <Th label="APR" sortable />
            <Th label="Pending" sortable />
            <Th label="Value" sortable />
          </tr>
        </thead>

        <tbody>
          <tr>
            <td colSpan={6} className="py-4">
              <p className="text-center text-gray-500">You have no Farms Record yet.</p>
            </td>
          </tr>
        </tbody>
      </Table>
    </Section>
  )
}