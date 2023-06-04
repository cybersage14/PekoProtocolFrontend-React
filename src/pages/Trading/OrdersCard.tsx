import { useState } from "react";
import TextButton from "../../components/buttons/TextButton";
import { IPropsOfComponent } from "../../utils/interfaces";

type TTabValue = 'orders' | 'balances';

export default function OrdersCard({ className = '' }: IPropsOfComponent) {
  const [tabValue, setTabValue] = useState<TTabValue>('orders')

  return (
    <div className={`bg-gray-900 rounded-md py-4 ${className}`}>
      <div className="flex">
        <TextButton className={`border-b-2 border-transparent rounded-none py-4 px-8 text-base ${tabValue === 'orders' ? 'border-blue-500' : 'border'}`}>Orders</TextButton>
        <TextButton className={`border-b-2 border-transparent rounded-none py-4 px-8 text-base ${tabValue === 'orders' ? 'border-blue-500' : 'border'}`}>Balances</TextButton>
      </div>
    </div>
  )
}