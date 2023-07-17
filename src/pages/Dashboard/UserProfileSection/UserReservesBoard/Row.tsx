import { useEffect, useState } from "react";
import { formatUnits } from "viem";
import { useContractRead } from "wagmi";
import Td from "../../../../components/tableComponents/Td";
import Tr from "../../../../components/tableComponents/Tr";
import { IAsset, IReturnValueOfPoolInfo, IUserInfo } from "../../../../utils/interfaces";
import { APY_DECIMAL, POOL_CONTRACT_ABI, POOL_CONTRACT_ADDRESS } from "../../../../utils/constants";

//  ----------------------------------------------------------------------------------------------------

interface IProps {
  asset: IAsset;
  ethPriceInUsd: number;
  usdcPriceInUsd: number;
  userInfo: IUserInfo;
}

//  ----------------------------------------------------------------------------------------------------

export default function Row({ asset, ethPriceInUsd, usdcPriceInUsd, userInfo }: IProps) {
  const [assetPriceInUsd, setAssetPriceInUsd] = useState<number>(0)
  const [depositApy, setDepositApy] = useState<number>(0)
  const [borrowApy, setBorrowApy] = useState<number>(0)
  const [depositAmount, setDepositAmount] = useState<number>(0)
  const [borrowAmount, setBorrowAmount] = useState<number>(0)
  const [depositAmountInUsd, setDepositAmountInUsd] = useState<number>(0)
  const [borrowAmountInUsd, setBorrowAmountInUsd] = useState<number>(0)

  //  ----------------------------------------------------------------------------

  const { data: poolInfo }: IReturnValueOfPoolInfo = useContractRead({
    address: POOL_CONTRACT_ADDRESS,
    abi: POOL_CONTRACT_ABI,
    functionName: 'getPoolInfo',
    args: [asset.contractAddress],
    watch: true
  })

  //  ----------------------------------------------------------------------------

  useEffect(() => {
    if (asset.symbol === 'eth') {
      setAssetPriceInUsd(ethPriceInUsd)
    } else if (asset.symbol === 'usdc') {
      setAssetPriceInUsd(usdcPriceInUsd)
    }
  }, [asset])

  useEffect(() => {
    if (userInfo) {
      let _depositAmount = 0;
      let _borrowAmount = 0;

      if (asset.symbol === 'eth') {
        _depositAmount = Number(formatUnits(userInfo.ethDepositAmount + userInfo.ethRewardAmount, asset.decimals))
        _borrowAmount = Number(formatUnits(userInfo.ethBorrowAmount + userInfo.ethInterestAmount, asset.decimals))
      } else {
        _depositAmount = Number(formatUnits(userInfo.usdtDepositAmount + userInfo.usdtRewardAmount, asset.decimals))
        _borrowAmount = Number(formatUnits(userInfo.usdtBorrowAmount + userInfo.usdtInterestAmount, asset.decimals))
      }

      setDepositAmount(_depositAmount)
      setBorrowAmount(_borrowAmount)

      if (asset.symbol === 'eth') {
        setDepositAmountInUsd(_depositAmount * ethPriceInUsd)
        setBorrowAmountInUsd(_borrowAmount * ethPriceInUsd)
      } else if (asset.symbol === 'usdc') {
        setDepositAmountInUsd(_depositAmount * usdcPriceInUsd)
        setBorrowAmountInUsd(_borrowAmount * usdcPriceInUsd)
      }
    }
  }, [userInfo, asset])

  useEffect(() => {
    if (poolInfo) {
      setDepositApy(Number(formatUnits(poolInfo.depositApy, APY_DECIMAL)))
      setBorrowApy(Number(formatUnits(poolInfo.borrowApy, APY_DECIMAL)))
    }
  }, [poolInfo])

  //  ----------------------------------------------------------------------------

  return (
    <>
      {depositAmount > 0 && (
        <Tr>
          {/* Asset */}
          <Td>
            <div className="flex items-center gap-2">
              <img src={asset.imgSrc} alt="" className="w-10" />
              <div className="flex flex-col">
                <span className="font-semibold text-green-500">{asset.name}(deposit)</span>
                <span className="text-sm text-gray-500">
                  ${assetPriceInUsd.toFixed(2)}
                </span>
              </div>
            </div>
          </Td>

          {/* APY */}
          <Td className="text-green-500">
            {depositApy.toFixed(2)}%
          </Td>

          {/* Amount */}
          <Td>
            <div className="flex flex-col">
              <span className="font-semibold uppercase">{depositAmount.toFixed(4)} {asset.symbol}</span>
              <span className="text-sm text-gray-500">${depositAmountInUsd.toFixed(2)}</span>
            </div>
          </Td>
        </Tr>
      )}

      {borrowAmount > 0 && (
        <Tr>
          {/* Asset */}
          <Td>
            <div className="flex items-center gap-2">
              <img src={asset.imgSrc} alt="" className="w-10" />
              <div className="flex flex-col">
                <span className="font-semibold text-red-500">{asset.name}(borrow)</span>
                <span className="text-sm text-gray-500">
                  ${assetPriceInUsd.toFixed(2)}
                </span>
              </div>
            </div>
          </Td>

          {/* APY */}
          <Td className="text-green-500">
            {borrowApy.toFixed(2)}%
          </Td>

          {/* Amount */}
          <Td>
            <div className="flex flex-col">
              <span className="font-semibold uppercase">{borrowAmount.toFixed(4)} {asset.symbol}</span>
              <span className="text-sm text-gray-500">${borrowAmountInUsd.toFixed(2)}</span>
            </div>
          </Td>
        </Tr>
      )}
    </>
  )
}