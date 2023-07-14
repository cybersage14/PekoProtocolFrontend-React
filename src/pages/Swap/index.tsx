import { lazy, useState } from "react";
import { Switch } from "@material-tailwind/react";
import { Icon } from "@iconify/react";
import Slider from "rc-slider";
import 'rc-slider/assets/index.css';
import PageHeader from "../../components/PageHeader";
import TextButton from "../../components/buttons/TextButton";
import { IToken } from "../../utils/interfaces";
import OutlinedButton from "../../components/buttons/OutlinedButton";
import FilledButton from "../../components/buttons/FilledButton";

// ---------------------------------------------------------------------------------------------

const BorrowPanel = lazy(() => import('./BorrowPanel'))
const SelectTokenWithPrice = lazy(() => import('../../components/form/SelectTokenWithPrice'))

// ---------------------------------------------------------------------------------------------

const TOKENS: Array<IToken> = [
  {
    id: 1,
    name: 'Bitcoin',
    symbol: 'BTC',
    imgSrc: 'https://cryptologos.cc/logos/bitcoin-btc-logo.svg?v=025',
    depositedAmount: 0
  },
  {
    id: 2,
    name: 'BNB',
    symbol: 'BNB',
    imgSrc: 'https://cryptologos.cc/logos/bnb-bnb-logo.svg?v=025',
    depositedAmount: 0
  },
  {
    id: 3,
    name: 'USD Coin',
    symbol: 'USDC',
    imgSrc: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.svg?v=025',
    depositedAmount: 0
  },
  {
    id: 4,
    name: 'Ethereum',
    symbol: 'ETH',
    imgSrc: 'https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=025',
    depositedAmount: 0
  },
  {
    id: 5,
    name: 'Solana',
    symbol: 'SOL',
    imgSrc: 'https://cryptologos.cc/logos/solana-sol-logo.svg?v=025',
    depositedAmount: 0
  }
]

// ---------------------------------------------------------------------------------------------

export default function Swap() {
  const [payToken, setPayToken] = useState<IToken | null>(null)
  const [payTokenAmount, setPayTokenAmount] = useState<string>('0')
  const [receiveToken, setReceiveToken] = useState<IToken | null>(null)
  const [receiveTokenAmount, setReceiveTokenAmount] = useState<string>('0')
  const [borrowAllowed, setBorrowAllowed] = useState<boolean>(false)

  return (
    <div className="flex flex-col gap-8 mb-8">
      <PageHeader title="Aries Swap" description="Leverage-enabled swap, quickly and safely." />

      <div className="flex justify-center h-fit">
        <div className="relative w-fit h-fit">
          <div className="container max-w-lg">
            {/* You pay */}
            <div className="py-6 px-6 bg-gray-900 rounded-md flex flex-col gap-16">
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg text-gray-100">You Pay</h2>
                  <div className="flex items-center gap-2">
                    <Switch
                      label={<span className="text-gray-300 text-xs">Allow Borrowing</span>}
                      checked={borrowAllowed}
                      onChange={() => setBorrowAllowed(!borrowAllowed)}
                      className="bg-gray-800"
                    />

                    <TextButton className="flex items-center gap-2">
                      <Icon icon="ant-design:control-outlined" className="text-blue-500 text-lg" />
                      0.5%
                    </TextButton>
                  </div>
                </div>

                {/* <SelectTokenWithPrice
                  tokens={TOKENS}
                  selectedToken={payToken}
                  setSelectedToken={setPayToken}
                  tokenAmount={payTokenAmount}
                  setTokenAmount={setPayTokenAmount}
                /> */}

                <div className="px-2">
                  <Slider
                    marks={{
                      0: '0%',
                      25: '25%',
                      50: '50%',
                      75: '75%',
                      100: '100%'
                    }}
                    className="bg-gray-900"
                    railStyle={{ backgroundColor: '#3F3F46' }}
                    trackStyle={{ backgroundColor: '#3B82F6' }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-red-500">Select target token to see borrow ability</span>
                <div className="flex items-center gap-2">
                  <OutlinedButton className="text-xs">half</OutlinedButton>
                  <OutlinedButton className="text-xs">max</OutlinedButton>
                </div>
              </div>
            </div>

            {/* Swap button */}
            <div className="h-2 relative">
              <div className="absolute top-[-18px] w-full flex justify-center">
                <button className="bg-gray-900 w-12 h-12 flex flex-col justify-center items-center rounded-full border-4 border-[#111111] transition hover:bg-gray-800 text-gray-500">
                  <Icon icon="iconamoon:swap" className="text-3xl" />
                </button>
              </div>
            </div>

            {/* You Receive */}
            <div className="py-6 px-6 bg-gray-900 rounded-md flex flex-col gap-4">
              <h2 className="text-lg text-gray-100">You Receive</h2>

              {/* <SelectTokenWithPrice
                tokens={TOKENS}
                selectedToken={receiveToken}
                setSelectedToken={setReceiveToken}
                tokenAmount={receiveTokenAmount}
                setTokenAmount={setReceiveTokenAmount}
              /> */}

              <label className="text-gray-500">Select a token</label>
            </div>

            {/* Button */}
            <div className="mt-8">
              <FilledButton className="w-full text-base py-3 font-semibold">
                Select a token to swap
              </FilledButton>
            </div>
          </div>

          {borrowAllowed && (
            <BorrowPanel className="absolute right-[101%] top-0" />
          )}
        </div>
      </div>
    </div>
  )
}