import { useRef, useState } from "react";
import { Icon } from "@iconify/react";
import { useOnClickOutside } from 'usehooks-ts'
import { IPropsOfComponent, IChain } from "../../utils/interfaces";

// -------------------------------------------------------------------------------------------------------

interface IProps extends IPropsOfComponent {
  chains: Array<IChain>;
  selectedChain: IChain | null;
  setSelectedChain: Function;
}

// -------------------------------------------------------------------------------------------------------

export default function SelectChain({ className = '', chains, selectedChain, setSelectedChain, ...others }: IProps) {
  const ref = useRef(null)
  const [listVisible, setListVisible] = useState<boolean>(false)

  useOnClickOutside(ref, () => setListVisible(false))

  const handleSelectChain = (chain: IChain) => {
    setSelectedChain(chain)
    setListVisible(false)
  }

  return (
    <div ref={ref} className="relative h-fit">
      <div
        className={`border border-gray-800 rounded-md py-2 px-3 flex items-center justify-between cursor-pointer ${className}`}
        {...others}
        onClick={() => setListVisible(!listVisible)}
      >
        <div className="flex items-center gap-2">
          {selectedChain && (
            <>
              <img src={selectedChain.imgSrc} alt={selectedChain.name} className="w-6" />
              <span className="text-gray-100">{selectedChain.name}</span>
            </>
          )}

        </div>
        <Icon
          icon={listVisible ? 'ep:arrow-up-bold' : 'ep:arrow-down-bold'}
          className="text-gray-500 text-md"
        />
      </div>

      {listVisible && (
        <div className="absolute z-50 w-full rounded-md bg-gray-900 border border-gray-800">
          {chains.map(chainItem => (
            <div
              key={chainItem.id}
              className="p-2 hover:bg-gray-800 transition flex items-center gap-2 cursor-pointer"
              onClick={() => handleSelectChain(chainItem)}
            >
              <img src={chainItem.imgSrc} alt={chainItem.name} className="w-6" />
              <span className="text-gray-100">{chainItem.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}