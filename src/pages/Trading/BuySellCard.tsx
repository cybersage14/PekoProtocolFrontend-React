import { ChangeEvent, useState } from "react";
import MainSelect from "../../components/form/MainSelect";
import { IOption } from "../../utils/interfaces";
import MainInput from "../../components/form/MainInput";
import { REGEX_NUMBER_VALID, TEMP_CRYPTO_LOGO_URL } from "../../utils/constants";
import FilledButton from "../../components/buttons/FilledButton";
import OutlinedButton from "../../components/buttons/OutlinedButton";

// ---------------------------------------------------------------------------------

type TTabValue = 'buy' | 'sell'

// ---------------------------------------------------------------------------------

const ORDER_TYPES: Array<IOption> = [
  {
    id: 1,
    label: 'Limit',
    value: 'limit'
  }
]

// ---------------------------------------------------------------------------------

export default function BuySellCard() {
  const [tabValue, setTabValue] = useState<TTabValue>('buy')
  const [orderType, setOrderType] = useState<IOption>(ORDER_TYPES[0])
  const [price, setPrice] = useState<string>('0')
  const [amount, setAmount] = useState<string>('0')

  const handlePrice = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    if (value.match(REGEX_NUMBER_VALID)) {
      setPrice(value);
    }
  }

  const handleAmount = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    if (value.match(REGEX_NUMBER_VALID)) {
      setAmount(value);
    }
  }

  return (
    <div className="bg-gray-900 rounded-md">
      <div className="grid grid-cols-2">
        <div
          className={`py-2 border-b-2 flex justify-center cursor-pointer ${tabValue === 'buy' ? 'border-green-500' : 'border-transparent'}`}
          onClick={() => setTabValue('buy')}
        >
          <span className={`${tabValue === 'buy' ? 'text-gray-100' : 'text-gray-500'}`}>Buy</span>
        </div>
        <div
          className={`py-2 border-b-2 flex justify-center cursor-pointer ${tabValue === 'sell' ? 'border-red-500' : 'border-transparent'}`}
          onClick={() => setTabValue('sell')}
        >
          <span className={`${tabValue === 'sell' ? 'text-gray-100' : 'text-gray-500'}`}>Sell</span>
        </div>
      </div>

      <div className="p-4 flex flex-col gap-4">
        {/* Order Type */}
        <div className="flex flex-col gap-1">
          <label htmlFor="orderType" className="text-sm text-gray-500">Order Type</label>
          <MainSelect
            id="orderType"
            options={ORDER_TYPES}
            selectedOption={orderType}
            setSelectedOption={setOrderType}
          />
        </div>

        {/* Price */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between text-sm">
            <label htmlFor="price" className="text-gray-500">Price</label>
            <p className="text-gray-500">Min Ask: <span className="text-red-500">8.45</span></p>
          </div>

          <MainInput
            id="price"
            endAdornment={<div className="flex items-center gap-1">
              <img src={TEMP_CRYPTO_LOGO_URL} className="w-5" alt="" />
              <span className="text-gray-100">tUSDC</span>
            </div>}
            placeholder="0"
            value={price}
            onChange={handlePrice}
          />
        </div>

        {/* Amount */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between text-sm">
            <label htmlFor="amount" className="text-gray-500">Amount</label>
            <p className="text-gray-500">Available: <span className="text-green-500">10 tUSDC</span></p>
          </div>
          <MainInput
            id="amount"
            endAdornment={<div className="flex items-center gap-1">
              <img src={TEMP_CRYPTO_LOGO_URL} className="w-5" alt="" />
              <span className="text-gray-100">APT</span>
            </div>}
            placeholder="0"
            value={amount}
            onChange={handleAmount}
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <OutlinedButton>Deposit tUSDC</OutlinedButton>
          <FilledButton>Please input price</FilledButton>
        </div>
      </div>
    </div >
  )
}