import Table from "../../components/tableComponents/Table";
import Th from "../../components/tableComponents/Th";
import Section from "../../components/Section";

export default function TokensSection() {
  return (
    <Section title="Tokens" action={<span className="text-gray-100 text-lg">$0.00</span>}>
      <Table>
        <thead>
          <tr className="bg-gray-900">
            <Th label="Symbol" sortable />
            <Th label="Balance" sortable />
            <Th label="Price" sortable />
            <Th label="Value" sortable />
          </tr>
        </thead>

        <tbody>
          <tr>
            <td colSpan={4} className="py-4">
              <p className="text-center text-gray-500">You have no token in your wallet.</p>
            </td>
          </tr>
        </tbody>
      </Table>
    </Section>
  )
}