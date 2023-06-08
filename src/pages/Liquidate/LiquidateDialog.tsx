import { useState } from "react";
import CustomDialog from "../../components/dialogs/CustomDialog";
import SelectTokenWithPrice from "../../components/form/SelectTokenWithPrice";
import OutlinedButton from "../../components/buttons/OutlinedButton";
import { IToken } from "../../utils/interfaces";
import FilledButton from "../../components/buttons/FilledButton";

// ---------------------------------------------------------------------------------------------

interface IProps {
  visible: boolean;
  setVisible: Function;
}

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

export default function LiquidateDialog({ visible, setVisible }: IProps) {
  const [payToken, setPayToken] = useState<IToken | null>(null)
  const [payTokenAmount, setPayTokenAmount] = useState<string>('0')
  const [receiveToken, setReceiveToken] = useState<IToken | null>(null)
  const [receiveTokenAmount, setReceiveTokenAmount] = useState<string>('0')

  return (
    <CustomDialog title="Liquidate" visible={visible} setVisible={setVisible}>
      {/* You pay */}
      <div className="py-6 bg-gray-900 rounded-md flex flex-col gap-16">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg text-gray-100">You Pay</h2>
            <span className="text-gray-500 text-sm">Needless repay will return to your wallet</span>
          </div>

          <SelectTokenWithPrice
            tokens={TOKENS}
            selectedToken={payToken}
            setSelectedToken={setPayToken}
            tokenAmount={payTokenAmount}
            setTokenAmount={setPayTokenAmount}
          />

          <div className="flex items-center justify-between text-sm">
            <span className="text-red-500">Insufficient Unknown balance</span>
            <OutlinedButton className="text-xs p-2">max</OutlinedButton>
          </div>
        </div>
      </div>

      <div className="py-6 bg-gray-900 rounded-md flex flex-col gap-4">
        <h2 className="text-lg text-gray-100">Gain up to</h2>

        <SelectTokenWithPrice
          tokens={TOKENS}
          selectedToken={receiveToken}
          setSelectedToken={setReceiveToken}
          tokenAmount={receiveTokenAmount}
          setTokenAmount={setReceiveTokenAmount}
        />
      </div>

      <FilledButton className="w-full text-base py-3 font-semibold">
        Repay
      </FilledButton>
    </CustomDialog>
  )
}