import { ChangeEvent, lazy, useState } from "react";
import { useCopyToClipboard } from 'usehooks-ts';
import { Icon } from "@iconify/react";
import PageHeader from "../../components/PageHeader";
import { IChain, IToken } from "../../utils/interfaces";
import { REGEX_NUMBER_VALID, TEMP_CHAINS } from "../../utils/constants";
import MainInput from "../../components/form/MainInput";
import { getVisibleWalletAddress } from "../../utils/functions";
import OutlinedButton from "../../components/buttons/OutlinedButton";
import FilledButton from "../../components/buttons/FilledButton";

// ---------------------------------------------------------------------------------------------

const SelectChain = lazy(() => import('../../components/form/SelectChain'))
const SelectTokenWithDetail = lazy(() => import('../../components/form/SelectTokenWithDetail'))

// ---------------------------------------------------------------------------------------------

const TOKENS: Array<IToken> = [
  {
    id: 1,
    name: "USDC(Wormhole)",
    symbol: "USDC",
    imgSrc: "https://cryptologos.cc/logos/usd-coin-usdc-logo.svg?v=025",
    depositedAmount: 0,
    tokenAddress: '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d'
  },
  {
    id: 2,
    name: "Wormhole Solana USDC",
    symbol: "USDC",
    imgSrc: "https://cryptologos.cc/logos/usd-coin-usdc-logo.svg?v=025",
    depositedAmount: 0,
    tokenAddress: '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d'
  },
]

// ---------------------------------------------------------------------------------------------

export default function Bridge() {
  const [sourceChain, setSourceChain] = useState<IChain | null>(null)
  const [targetChain, setTargetChain] = useState<IChain | null>(null)
  const [token, setToken] = useState<IToken | null>(null)
  const [amount, setAmount] = useState<string>('0')

  const [copiedValue, copy] = useCopyToClipboard()

  const handleAmount = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    if (value.match(REGEX_NUMBER_VALID)) {
      setAmount(value);
    }
  }

  return (
    <div className="flex flex-col gap-8 mb-8">
      <PageHeader title="Transfer tokens across chains" description="Simply and safely, powered by Wormhole" />

      <div className="container max-w-lg p-4 bg-gray-900 rounded-md flex flex-col gap-8">
        <h1 className="text-gray-100 text-xl">Bridge</h1>

        <div className="flex flex-col gap-4">
          <div className="flex justify-between">
            {/* Source chain */}
            <div className="flex flex-col gap-1 w-[45%]">
              <label htmlFor="sourceChain" className="text-sm text-gray-500">Source Chain</label>
              <SelectChain
                id="sourceChain"
                chains={TEMP_CHAINS}
                selectedChain={sourceChain}
                setSelectedChain={setSourceChain}
              />
            </div>

            <Icon icon="mingcute:arrow-right-fill" className="text-gray-500 mt-9" />

            {/* Target chain */}
            <div className="flex flex-col gap-1 w-[45%]">
              <label htmlFor="targetChain" className="text-sm text-gray-500">Target Chain</label>
              <SelectChain
                id="targetChain"
                chains={TEMP_CHAINS}
                selectedChain={targetChain}
                setSelectedChain={setTargetChain}
              />
            </div>
          </div>

          {/* Token */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-500" htmlFor="token">Token</label>
            {token ? (
              <div className="flex items-center justify-between">
                <div className="w-[45%]">
                  <SelectTokenWithDetail
                    id="token"
                    tokens={TOKENS}
                    selectedToken={token}
                    setSelectedToken={setToken}
                  />
                </div>

                <Icon icon="mingcute:arrow-right-fill" className="text-gray-500" />

                <div className="w-[45%] flex items-center gap-2">
                  <img src={token.imgSrc} alt={token.name} className="w-10" />
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-100 font-semibold">{token.symbol}</span>
                      <div className="flex items-center gap-1 text-blue-500">
                        <span className="text-xs">{getVisibleWalletAddress(token.tokenAddress || '')}</span>

                        {copiedValue === token.tokenAddress ? (
                          <Icon icon="material-symbols:check" className="text-sm" />
                        ) : (
                          <Icon
                            icon="ant-design:copy-outlined"
                            className="text-sm"
                            onClick={() => copy(token.tokenAddress || '')}
                          />
                        )}
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">{token.name}</span>
                  </div>
                </div>

              </div>
            ) : (
              <SelectTokenWithDetail
                id="token"
                tokens={TOKENS}
                selectedToken={token}
                setSelectedToken={setToken}
              />
            )}
          </div>

          {/* Amount */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-500" htmlFor="amount">Amount</label>
            <MainInput
              id="amount"
              endAdornment={<span className="text-gray-500">{token?.symbol}</span>}
              value={amount}
              onChange={handleAmount}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-gray-500 text-sm">{sourceChain?.name} Balance: 0 {token?.symbol}</span>
              <span className="text-gray-500 text-sm">{targetChain?.name} Balance: 0 {token?.symbol}</span>
            </div>
            <div className="flex items-center gap-1">
              <OutlinedButton className="text-xs">half</OutlinedButton>
              <OutlinedButton className="text-xs">max</OutlinedButton>
            </div>
          </div>
        </div>

        <p className="text-center text-amber-500 text-sm">
          * You will get wormhole wrapped token on Fantom, you can swap them to native token manually.
        </p>

        <FilledButton className="text-base py-3 font-semibold">Connect Wallet</FilledButton>
      </div>
    </div>
  )
}