import { lazy, useRef } from "react";
import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";
import { useCopyToClipboard, useOnClickOutside } from 'usehooks-ts';
import FilledButton from "../../components/buttons/FilledButton";
import MainInput from "../../components/form/MainInput";
import { TEMP_WALLET_ADDRESS } from "../../utils/constants";
import { getVisibleWalletAddress } from "../../utils/functions";

// -----------------------------------------------------------------------------------------------------

const AccountStatusSection = lazy(() => import('./AccountStatusSection'))
const UserProfileSection = lazy(() => import('./UserProfileSection'))
// const TokensSection = lazy(() => import('./TokensSection'))
// const LPTokensSection = lazy(() => import('./LPTokensSection'))
// const FarmsSection = lazy(() => import('./FarmsSection'))
const DepositsSection = lazy(() => import('./DepositsSection'))

// -----------------------------------------------------------------------------------------------------

export default function Dashboard() {
  const ref = useRef(null)
  const [copiedValue, copy] = useCopyToClipboard()

  useOnClickOutside(ref, () => copy(''))

  return (
    <div className="container max-w-8xl my-8 flex flex-col gap-8 px-4 lg:px-0">
      <MainInput
        startAdornment={<Icon icon="material-symbols:search" className="text-gray-500 text-lg" />}
        className="bg-gray-900"
        classNameOfInput="bg-gray-900"
        placeholder="Search a wallet address"
      />

      <header className="flex flex-col gap-2 lg:gap-4">
        <h2 className="text-gray-500 text-lg">Networth</h2>

        <div className="flex items-center justify-between">
          <div className="flex items-center justify-between w-full lg:justify-start lg:gap-16">
            <span className="text-gray-100 text-4xl">$0.00</span>
            <div className="flex items-center gap-2">
              <div className="rounded-md border border-gray-800 py-2 px-2 w-24 flex flex-col gap-1 items-center">
                <span className="text-gray-500 text-xs">APY</span>
                <span className="text-green-500 font-semibold">0.00%</span>
              </div>
              <div className="rounded-md border border-gray-800 py-2 px-2 w-24 flex flex-col gap-1 items-center">
                <span className="text-gray-500 text-xs">Risk Factor</span>
                <span className="text-green-500 font-semibold">0.00%</span>
              </div>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-2">
            <Link to="/lending">
              <FilledButton className="">Lending</FilledButton>
            </Link>
            {/* <Link to="/swap">
              <FilledButton className="">Swap</FilledButton>
            </Link> */}
          </div>
        </div>

        <div className="flex items-center gap-2" ref={ref}>
          <span className="text-gray-500">{getVisibleWalletAddress(TEMP_WALLET_ADDRESS, 10, 6)}</span>
          {copiedValue === TEMP_WALLET_ADDRESS ? (
            <Icon icon="material-symbols:check" className="text-lg text-blue-500 cursor-pointer" />
          ) : (
            <Icon
              icon="ant-design:copy-outlined"
              className="text-lg text-blue-500 cursor-pointer"
              onClick={() => copy(TEMP_WALLET_ADDRESS || '')}
            />
          )}
        </div>
      </header>

      <AccountStatusSection />
      <UserProfileSection />
      {/* <TokensSection />
      <LPTokensSection />
      <FarmsSection /> */}
      <DepositsSection />
    </div>
  )
}