interface IProps {
  label: string;
  value: string | number;
  unit?: string;
  className?: string;
}

export default function InfoCard({ label = '', value = '', unit = '', className = '' }: IProps) {
  return (
    <div className={`rounded-md text-sm border border-gray-800 bg-gray-900 py-2 px-4 flex flex-col md:flex-row items-start md:items-center gap-2 ${className}`}>
      <span className="text-gray-500">{label}: </span>
      <span className="text-gray-100">{unit}{value}</span>
    </div>
  )
}