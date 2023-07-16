import Table from "../../components/tableComponents/Table";
import Th from "../../components/tableComponents/Th";
import Section from "../../components/Section";

export default function DepositsSection() {
  return (
    <Section title="Deposits/Borrows" action={<span className="text-gray-100 text-lg">$0.00</span>}>
      <Table>
        <thead>
          <tr className="bg-gray-900">
            <Th label="Platform" />
            <Th label="Value" sortable />
          </tr>
        </thead>

        <tbody>
          <tr>
            <td colSpan={2} className="py-4">
              <p className="text-center text-gray-500">You have no Depost/Borrow yet.</p>
            </td>
          </tr>
        </tbody>
      </Table>
    </Section>
  )
}