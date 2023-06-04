import { ChangeEvent, ReactNode, useEffect, useRef, useState } from "react";
import { Icon } from "@iconify/react";
import { useDebounce, useOnClickOutside } from "usehooks-ts";
import { IPropsOfComponent, IToken } from "../../utils/interfaces";
import MainInput from "./MainInput";
import TextIconButton from "../buttons/TextIconButton";
import Table from "../tableComponents/Table";
import Th from "../tableComponents/Th";
import Tr from "../tableComponents/Tr";
import Td from "../tableComponents/Td";
import { REGEX_NUMBER_VALID } from "../../utils/constants";

/* --------------------------------------------------------------------------- */

interface IProps extends IPropsOfComponent {
  classNameOfInput?: string;
  startAdornment?: ReactNode;
  tokens: Array<IToken>;
  selectedToken: IToken | null;
  setSelectedToken: Function;
  error?: boolean;
  tokenAmount: string;
  setTokenAmount: Function;
}

/* --------------------------------------------------------------------------- */

export default function SelectTokenWithPrice({
  className = '',
  classNameOfInput = '',
  startAdornment,
  error,
  tokens = [],
  selectedToken,
  setSelectedToken,
  tokenAmount,
  setTokenAmount,
  ...others
}: IProps) {
  const ref = useRef(null)

  const [listVisible, setListVisible] = useState<boolean>(false)
  const [filteredTokens, setFilteredTokens] = useState<Array<IToken>>(tokens)
  const [searchKeyword, setSearchKeyword] = useState<string>('')
  const debouncedSearchKeyword = useDebounce<string>(searchKeyword, 500)

  useOnClickOutside(ref, () => setListVisible(false))

  useEffect(() => {
    const _filteredTokens = tokens.filter(tokenItem => tokenItem.name.includes(debouncedSearchKeyword) || tokenItem.symbol.includes(debouncedSearchKeyword))
    setFilteredTokens(_filteredTokens)
  }, [debouncedSearchKeyword])

  const handleTokenAmount = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    if (value.match(REGEX_NUMBER_VALID)) {
      setTokenAmount(value);
    }
  }

  return (
    <div className="relative h-fit" ref={ref}>
      <div
        className={`flex items-center gap-2 px-3 py-2 rounded bg-gray-900 border border-gray-800 ${className} ${error ? '!border-red-500' : ''}`}
        {...others}
      >
        {startAdornment ? (
          <div>{startAdornment}</div>
        ) : (<></>)}
        <input
          className={`flex-1 focus:outline-none w-full bg-gray-900 text-gray-100 placeholder:text-gray-700 ${classNameOfInput}`}
          {...others}
          value={tokenAmount}
          onChange={handleTokenAmount}
        />
        <div className="flex items-center gap-2">
          {selectedToken && (
            <div className="flex items-center gap-2">
              <img src={selectedToken.imgSrc} alt={selectedToken.symbol} className="w-8" />
              <span className="text-gray-100 font-semibold">{selectedToken.symbol}</span>
            </div>
          )}

          <TextIconButton onClick={() => setListVisible(!listVisible)}>
            <Icon
              icon={listVisible ? 'ep:arrow-up-bold' : 'ep:arrow-down-bold'}
              className="text-gray-500 text-md"
            />
          </TextIconButton>
        </div>
      </div>

      {listVisible && (
        <div className="absolute z-50 w-full top-14 bg-gray-900 border border-gray-800 p-4 flex flex-col gap-2 rounded-b-md">
          <MainInput
            startAdornment={<Icon icon="material-symbols:search" className="text-gray-700 text-lg" />}
            placeholder="Search by symbol or name"
            value={searchKeyword}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchKeyword(e.target.value)}
          />

          <Table>
            <thead>
              <tr>
                <Th className="text-left" label="Token" />
                <Th className="text-left" label="Deposit" />
              </tr>
            </thead>
            <tbody>
              {filteredTokens.map(tokenItem => (
                <Tr className="hover:bg-gray-800" key={tokenItem.id} onClick={() => setSelectedToken(tokenItem)}>
                  <Td className="!py-2">
                    <div className="flex items-center gap-3">
                      <img src={tokenItem.imgSrc} alt={tokenItem.symbol} className="w-10" />
                      <div className="flex flex-col">
                        <span className="font-semibold">{tokenItem.symbol}</span>
                        <span className="text-sm text-gray-500">{tokenItem.name}</span>
                      </div>
                    </div>
                  </Td>
                  <Td>0</Td>
                </Tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
    </div>
  )
}