import { lazy, useEffect, useMemo, useRef, useState } from "react";
import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";
import { formatEther, formatUnits, parseEther, parseUnits } from "viem";
import { useCopyToClipboard, useOnClickOutside } from 'usehooks-ts';
import { useAccount, useBalance, useContractRead } from "wagmi";
import FilledButton from "../../components/buttons/FilledButton";
import { POOL_CONTRACT_ABI, POOL_CONTRACT_ADDRESS, USDC_CONTRACT_ADDRESS, USDC_DECIMAL, WETH_CONTRACT_ADDRESS } from "../../utils/constants";
import { getVisibleWalletAddress } from "../../utils/functions";
import { IReturnValueOfBalance, IReturnValueOfCalcTokenPrice, IReturnValueOfUserInfo } from "../../utils/interfaces";

// -----------------------------------------------------------------------------------------------------

const UserProfileSection = lazy(() => import('./UserProfileSection'))
const DepositsSection = lazy(() => import('./DepositsSection'))
const DialogClaimPeko = lazy(() => import('./DialogClaimPeko'))

// -----------------------------------------------------------------------------------------------------

export default function Dashboard() {
  const ref = useRef(null)
  const [copiedValue, copy] = useCopyToClipboard()
  useOnClickOutside(ref, () => copy(''))

  const { address } = useAccount()

  const [walletBalanceInUsd, setWalletBalanceInUsd] = useState<number>(0)
  const [dialogClaimPekoOpened, setDialogClaimPekoOpened] = useState<boolean>(false)

  //  ------------------------------------------------------------------------------
  //  Get ethereum balance of wallet
  const { data: ethBalanceData }: IReturnValueOfBalance = useBalance({ address })

  //  Get usdc balance of wallet
  const { data: usdcBalanceData }: IReturnValueOfBalance = useBalance({
    address,
    token: USDC_CONTRACT_ADDRESS
  })

  //  Get the price of ethereum in USD.
  const { data: ethPriceInBigInt }: IReturnValueOfCalcTokenPrice = useContractRead({
    address: POOL_CONTRACT_ADDRESS,
    abi: POOL_CONTRACT_ABI,
    args: [WETH_CONTRACT_ADDRESS, parseEther('1')],
    functionName: 'calcTokenPrice',
  })

  //  Get the price of ethereum in USD.
  const { data: usdcPriceInBigInt }: IReturnValueOfCalcTokenPrice = useContractRead({
    address: POOL_CONTRACT_ADDRESS,
    abi: POOL_CONTRACT_ABI,
    args: [USDC_CONTRACT_ADDRESS, parseUnits('1', USDC_DECIMAL)],
    functionName: 'calcTokenPrice',
  })

  //  Get Userinfo
  const { data: userInfo }: IReturnValueOfUserInfo = useContractRead({
    address: POOL_CONTRACT_ADDRESS,
    abi: POOL_CONTRACT_ABI,
    functionName: 'getUserInfo',
    args: [address],
    watch: true
  });

  //  ------------------------------------------------------------------------------

  const handleDialogClaimPeko = () => {
    setDialogClaimPekoOpened(!dialogClaimPekoOpened)
  }

  //  ------------------------------------------------------------------------------

  const ethPriceInUsd = useMemo<number>(() => {
    if (ethPriceInBigInt) {
      return Number(formatUnits(ethPriceInBigInt, USDC_DECIMAL))
    }
    return 0
  }, [ethPriceInBigInt])

  const usdcPriceInUsd = useMemo<number>(() => {
    if (usdcPriceInBigInt) {
      return Number(formatUnits(usdcPriceInBigInt, USDC_DECIMAL))
    }
    return 0
  }, [usdcPriceInBigInt])

  const riskFactor = useMemo<number>(() => {
    if (userInfo) {
      const depositedValueInUsd = Number(formatEther(userInfo.ethDepositAmount + userInfo.ethRewardAmount)) * ethPriceInUsd + Number(formatUnits(userInfo.usdtDepositAmount + userInfo.usdtDepositAmount, USDC_DECIMAL)) * usdcPriceInUsd
      const borrowedValueInUsd = Number(formatEther(userInfo.ethBorrowAmount + userInfo.ethInterestAmount)) * ethPriceInUsd + Number(formatUnits(userInfo.usdtBorrowAmount + userInfo.usdtInterestAmount, USDC_DECIMAL)) * usdcPriceInUsd

      if (depositedValueInUsd > 0) {
        return borrowedValueInUsd / (depositedValueInUsd * 0.9) * 100
      }
    }
    return 0
  }, [userInfo, ethPriceInUsd, usdcPriceInUsd])

  //  ------------------------------------------------------------------------------

  useEffect(() => {
    let balanceInUsd = 0;

    if (ethBalanceData) {
      balanceInUsd += Number(ethBalanceData.formatted) * ethPriceInUsd
    }

    if (usdcBalanceData) {
      balanceInUsd += Number(usdcBalanceData.formatted) * usdcPriceInUsd
    }

    setWalletBalanceInUsd(balanceInUsd)
  }, [ethBalanceData, usdcBalanceData])

  //  ------------------------------------------------------------------------------

  return (
    <div className="container max-w-8xl my-8 flex flex-col gap-8 px-4 lg:px-0">
      {/* <MainInput
        startAdornment={<Icon icon="material-symbols:search" className="text-gray-500 text-lg" />}
        className="bg-gray-900"
        classNameOfInput="bg-gray-900"
        placeholder="Search a wallet address"
      /> */}

      <header className="flex flex-col gap-2 lg:gap-4">
        <h2 className="text-gray-500 text-lg">Networth</h2>

        <div className="flex items-center justify-between">
          <div className="flex items-center justify-between w-full lg:justify-start lg:gap-16">
            <span className="text-gray-100 text-4xl">${walletBalanceInUsd.toFixed(2)}</span>
            <div className="flex items-center gap-2">
              {/* <div className="rounded-md border border-gray-800 py-2 px-2 w-24 flex flex-col gap-1 items-center">
                <span className="text-gray-500 text-xs">APY</span>
                <span className="text-green-500 font-semibold">0.00%</span>
              </div> */}
              <div className="rounded-md border border-gray-800 py-2 px-2 w-24 flex flex-col gap-1 items-center">
                <span className="text-gray-500 text-xs">Risk Factor</span>
                <span className="text-green-500 font-semibold">{riskFactor.toFixed(2)}%</span>
              </div>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-2">
            <Link to="/lending">
              <FilledButton className="">Lending</FilledButton>
            </Link>
            <FilledButton
              className="w-32"
              onClick={handleDialogClaimPeko}
            >Claim $Peko</FilledButton>
            {/* <Link to="/swap">
              <FilledButton className="">Swap</FilledButton>
            </Link> */}
          </div>
        </div>

        <div className="flex items-center gap-2" ref={ref}>
          <span className="text-gray-500">{getVisibleWalletAddress(address || '', 10, 6)}</span>
          {copiedValue === address ? (
            <Icon icon="material-symbols:check" className="text-lg text-blue-500 cursor-pointer" />
          ) : (
            <Icon
              icon="ant-design:copy-outlined"
              className="text-lg text-blue-500 cursor-pointer"
              onClick={() => copy(address || '')}
            />
          )}
        </div>
      </header>

      {/* <AccountStatusSection /> */}
      {userInfo && (<UserProfileSection userInfo={userInfo} ethPriceInUsd={ethPriceInUsd} usdcPriceInUsd={usdcPriceInUsd} />)}
      {/* <TokensSection />
      <LPTokensSection />
      <FarmsSection /> */}
      <DepositsSection ethPriceInUsd={ethPriceInUsd} usdcPriceInUsd={usdcPriceInUsd} />

      {userInfo && (
        <DialogClaimPeko
          visible={dialogClaimPekoOpened}
          setVisible={setDialogClaimPekoOpened}
          userInfo={userInfo}
        />
      )}

    </div>
  )
}