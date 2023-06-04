import { Icon } from "@iconify/react";
import { useOnClickOutside } from 'usehooks-ts';
import { IOption, IPropsOfComponent } from "../../utils/interfaces";
import { useRef, useState } from "react";

// --------------------------------------------------------------------------------

interface IProps extends IPropsOfComponent {
  options: Array<IOption>;
  selectedOption: IOption;
  setSelectedOption: Function;
}

// --------------------------------------------------------------------------------

export default function MainSelect({ className = '', options, selectedOption, setSelectedOption, ...others }: IProps) {
  const ref = useRef(null)
  const [listVisible, setListVisible] = useState<boolean>(false)

  useOnClickOutside(ref, () => setListVisible(false))

  const handleSelectOption = (_option: IOption) => {
    setSelectedOption(_option)
    setListVisible(false)
  }

  return (
    <div className="relative h-fit" ref={ref}>
      <div
        className={`rounded-md text-gray-100 border border-gray-800 bg-gray-900 px-3 py-2 flex items-center justify-between cursor-pointer ${className}`}
        onClick={() => setListVisible(!listVisible)}
        {...others}
      >
        <span>{selectedOption.label}</span>
        <Icon
          icon={listVisible ? 'ep:arrow-up-bold' : 'ep:arrow-down-bold'}
          className="text-gray-500 text-md"
        />
      </div>
      {listVisible && (
        <div className="absolute z-50 w-full rounded-md bg-gray-900 border border-gray-800">
          {options.map(optionItem => (
            <p
              key={optionItem.id}
              className="p-2 text-gray-100 cursor-pointer hover:bg-gray-800 transition"
              onClick={() => handleSelectOption(optionItem)}
            >
              {optionItem.label}
            </p>
          ))}
        </div>
      )}
    </div>

  )
}