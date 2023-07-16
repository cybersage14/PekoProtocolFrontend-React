import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import Section from "../../components/Section";

ChartJS.register(ArcElement, Tooltip, Legend);

export const data = {
  labels: ['Wallet', 'LP token', 'Farms', 'Main Account'],
  datasets: [
    {
      label: '# of Votes',
      data: [12, 19, 3, 5],
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
      ],
      borderWidth: 1,
    },
  ],
};

export default function AccountStatusSection() {
  return (
    <Section title="Account Status">
      <div className="grid grid-cols-4 gap-4 lg:gap-8">
        <div className="col-sapn-4 lg:col-span-3 bg-gray-900 flex flex-col justify-center items-center">
          <span className="text-gray-100">History</span>
        </div>
        <div className="col-span-4 lg:col-span-1 bg-gray-900 flex flex-col gap-4 p-3">
          <h5 className="text-gray-100 text-xl font-bold">Composition</h5>
          <Doughnut data={data} />
        </div>
      </div>
    </Section>
  )
}