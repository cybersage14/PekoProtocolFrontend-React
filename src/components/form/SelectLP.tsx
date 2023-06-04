import { useRef, useState } from "react";
import { Icon } from "@iconify/react";
import { useOnClickOutside } from 'usehooks-ts'
import { IPropsOfComponent, ILP } from "../../utils/interfaces";

// -------------------------------------------------------------------------------------------------------

interface IProps extends IPropsOfComponent {
  lps: Array<ILP>;
  selectedLP: ILP | null;
  setSelectedLP: Function;
}

// -------------------------------------------------------------------------------------------------------

export default function SelectLP({ className = '', lps, selectedLP, setSelectedLP, ...others }: IProps) {
  const ref = useRef(null)
  const [listVisible, setListVisible] = useState<boolean>(false)

  useOnClickOutside(ref, () => setListVisible(false))

  const handleSelectChain = (lp: ILP) => {
    setSelectedLP(lp)
    setListVisible(false)
  }

  return (
    <div ref={ref} className="relative h-fit">
      <div
        className={`border border-gray-800 bg-gray-900 rounded-md py-3 px-3 flex items-center justify-between cursor-pointer ${className}`}
        {...others}
        onClick={() => setListVisible(!listVisible)}
      >
        {selectedLP ? (
          <>
            <div className="flex items-center gap-6">
              <div className="relative w-fit h-fit">
                <img src={selectedLP.token.imgSrc} alt={selectedLP.token.symbol} className="w-6" />
                <img src={selectedLP.coin.imgSrc} alt={selectedLP.coin.symbol} className="w-6 absolute z-10 top-0 left-[60%]" />
              </div>
              <span className="text-gray-100">{selectedLP.token.symbol}-{selectedLP.coin.symbol}</span>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <div className="flex items-center gap-1">
                  <Icon icon="gg:check-o" className="text-green-500 text-xs" />
                  <span className="text-gray-500 text-xs">POWERED BY</span>
                </div>
                <img src={selectedLP.powererBrandSrc} alt="" className="w-20" />
              </div>

              <Icon
                icon={listVisible ? 'ep:arrow-up-bold' : 'ep:arrow-down-bold'}
                className="text-gray-500 text-md"
              />
            </div>
          </>
        ) : (
          <>
            <div />
            <Icon
              icon={listVisible ? 'ep:arrow-up-bold' : 'ep:arrow-down-bold'}
              className="text-gray-500 text-md"
            />
          </>
        )}

      </div>

      {listVisible && (
        <div className="absolute z-50 w-full rounded-b-md bg-gray-900 border border-gray-800">
          {lps.map(lpItem => (
            <div
              key={lpItem.id}
              className="p-3 hover:bg-gray-800 transition flex items-center justify-between gap-2 cursor-pointer"
              onClick={() => handleSelectChain(lpItem)}
            >
              <div className="flex items-center gap-6">
                <div className="relative w-fit h-fit">
                  <img src={lpItem.token.imgSrc} alt={lpItem.token.symbol} className="w-6" />
                  <img src={lpItem.coin.imgSrc} alt={lpItem.coin.symbol} className="w-6 absolute z-10 top-0 left-[80%]" />
                </div>
                <span className="text-gray-100">{lpItem.token.symbol}-{lpItem.coin.symbol}</span>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <div className="flex items-center gap-1">
                    <Icon icon="gg:check-o" className="text-green-500 text-xs" />
                    <span className="text-gray-500 text-xs">POWERED BY</span>
                  </div>
                  <img src={lpItem.powererBrandSrc} alt="" className="w-20" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}