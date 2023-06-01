import { useState } from "react";
import { Switch } from "@material-tailwind/react";
import { Icon } from "@iconify/react";
import PageHeader from "../../components/PageHeader";
import CardsField from "../../components/CardsField";
import TextButton from "../../components/buttons/TextButton";
import SelectToken from "../../components/form/SelectToken";
import { IToken } from "../../utils/interfaces";

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
  },
  {
    id: 6,
    name: 'Aptos Coin',
    symbol: 'APT',
    imgSrc: 'https://cryptologos.cc/logos/aptos-apt-logo.svg?v=025',
    depositedAmount: 0
  }
]

// ---------------------------------------------------------------------------------------------

export default function Swap() {
  const [visibleBorrowCard, setVisibleBorrowCard] = useState<boolean>(false)
  const [payToken, setPayToken] = useState<IToken | null>(null)
  const [payTokenAmount, setPayTokenAmount] = useState<string>('0')
  const [receiveToken, setReceiveToken] = useState<IToken | null>(null)
  const [receiveTokenAmount, setReceiveTokenAmount] = useState<string>('0')

  return (
    <div>
      <PageHeader title="Aries Swap" description="Leverage-enabled swap, quickly and safely." />

      <CardsField>
        <div className="relative">
          {/* You pay */}
          <div className="container max-w-lg py-6 px-4 bg-gray-900 rounded-md">
            <div className="flex items-center justify-between">
              <h2 className="text-lg text-gray-100">You Pay</h2>
              <div className="flex items-center gap-2">
                <Switch
                  label={<span className="text-gray-300 text-xs">Allow Borrowing</span>}
                  checked={visibleBorrowCard}
                  onChange={() => setVisibleBorrowCard(!visibleBorrowCard)}
                  className="bg-gray-800"
                />

                <TextButton className="flex items-center gap-2">
                  <Icon icon="ant-design:control-outlined" className="text-blue-500 text-lg" />
                  0.5%
                </TextButton>
              </div>
            </div>

            <SelectToken
              tokens={TOKENS}
              selectedToken={payToken}
              setSelectedToken={setPayToken}
              tokenAmount={payTokenAmount}
              setTokenAmount={setPayTokenAmount}
            />
          </div>
        </div>
      </CardsField>
    </div>
  )
}