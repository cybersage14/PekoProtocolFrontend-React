import { useRef, useState } from "react";
import { Icon } from "@iconify/react";
import { useOnClickOutside, useCopyToClipboard } from 'usehooks-ts'
import { IPropsOfComponent, IToken } from "../../utils/interfaces";
import { getVisibleWalletAddress } from "../../utils/functions";

// -------------------------------------------------------------------------------------------------------

interface IProps extends IPropsOfComponent {
  tokens: Array<IToken>;
  selectedToken: IToken | null;
  setSelectedToken: Function;
}

// -------------------------------------------------------------------------------------------------------

export default function SelectTokenWithDetail({ className = '', tokens, selectedToken, setSelectedToken, ...others }: IProps) {
  const ref = useRef(null)

  const [listVisible, setListVisible] = useState<boolean>(false)

  const [copiedValue, copy] = useCopyToClipboard()

  useOnClickOutside(ref, () => setListVisible(false))

  const handleSelectChain = (token: IToken) => {
    setSelectedToken(token)
    setListVisible(false)
  }

  return (
    <div ref={ref} className={`relative h-fit ${className}`} {...others}>
      <div
        className="border border-gray-800 rounded-md py-2 px-3 flex items-center justify-between cursor-pointer"
        onClick={() => setListVisible(!listVisible)}
      >
        <div className="flex items-center gap-2">
          {selectedToken && (
            <>
              <img src={selectedToken.imgSrc} alt={selectedToken.name} className="w-10" />
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-gray-100 font-semibold">{selectedToken.symbol}</span>
                  <div className="flex items-center gap-1 text-blue-500">
                    <span className="text-xs">{getVisibleWalletAddress(selectedToken.tokenAddress || '')}</span>

                    {copiedValue === selectedToken.tokenAddress ? (
                      <Icon icon="material-symbols:check" className="text-sm" />
                    ) : (
                      <Icon
                        icon="ant-design:copy-outlined"
                        className="text-sm"
                        onClick={() => copy(selectedToken.tokenAddress || '')}
                      />
                    )}
                  </div>
                </div>
                <span className="text-sm text-gray-500">{selectedToken.name}</span>
              </div>
            </>
          )}
        </div>
        <Icon
          icon={listVisible ? 'ep:arrow-up-bold' : 'ep:arrow-down-bold'}
          className="text-gray-500 text-xl"
        />
      </div>

      {listVisible && (
        <div className="absolute z-50 w-full rounded-md bg-gray-900 border border-gray-800">
          {tokens.map(tokenItem => (
            <div
              key={tokenItem.id}
              className="p-2 hover:bg-gray-800 transition flex items-center gap-2 cursor-pointer"
              onClick={() => handleSelectChain(tokenItem)}
            >
              <img src={tokenItem.imgSrc} alt={tokenItem.name} className="w-10" />
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-gray-100 font-semibold">{tokenItem.symbol}</span>
                  <span className="text-xs text-gray-500">{getVisibleWalletAddress(tokenItem.tokenAddress || '')}</span>
                </div>
                <span className="text-sm text-gray-500">{tokenItem.name}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}