interface IBidData {
  id: number;
  amount: number;
  price: number;
}

interface IProps {
  setBuySellTabValue: Function;
}

// -----------------------------------------------------------------------------------------

const BIDS: Array<IBidData> = [
  {
    id: 1,
    amount: 1,
    price: 8.41
  },
  {
    id: 2,
    amount: 1,
    price: 8.41
  },
  {
    id: 3,
    amount: 1,
    price: 8.41
  },
  {
    id: 4,
    amount: 1,
    price: 8.41
  },
  {
    id: 5,
    amount: 1,
    price: 8.41
  },
  {
    id: 6,
    amount: 1,
    price: 8.41
  },
  {
    id: 7,
    amount: 1,
    price: 8.41
  },
  {
    id: 8,
    amount: 1,
    price: 8.41
  }
]

// -----------------------------------------------------------------------------------------

export default function BidCard({ setBuySellTabValue }: IProps) {
  return (
    <div className="bg-gray-900 rounded-md p-4 flex flex-col gap-2">
      <div className="flex items-center justify-between text-sm text-gray-100">
        <span>BID</span>
        <span>ASK</span>
      </div>
      <div className="flex items-center justify-between text-sm text-gray-500">
        <span>Amount(USDC)</span>
        <span>Price(tUSDC)</span>
        <span>Amount(USDC)</span>
      </div>
      <div className="grid grid-cols-2 text-sm gap-1">
        <div className="flex flex-col cursor-pointer" onClick={() => setBuySellTabValue('buy')}>
          {BIDS.map(bidItem => (
            <div key={bidItem.id} className="flex items-center justify-between p-1">
              <span className="text-gray-100">{bidItem.amount}</span>
              <span className="text-green-500">{bidItem.price}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-col cursor-pointer" onClick={() => setBuySellTabValue('sell')}>
          {BIDS.map(bidItem => (
            <div key={bidItem.id} className="flex items-center justify-between p-1">
              <span className="text-red-500">{bidItem.price}</span>
              <span className="text-gray-100">{bidItem.amount}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}