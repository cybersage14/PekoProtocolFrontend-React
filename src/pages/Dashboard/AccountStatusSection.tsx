import Section from "./Section";

export default function AccountStatusSection() {
  return (
    <Section title="Account Status">
      <div className="grid grid-cols-4 gap-8 h-64">
        <div className="col-span-3 bg-gray-900 flex flex-col justify-center items-center">
          <span className="text-gray-100">History</span>
        </div>
        <div className="bg-gray-900 flex flex-col justify-center items-center">
          <span className="text-gray-100">Composition</span>
        </div>
      </div>
    </Section>
  )
}