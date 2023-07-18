import { useState } from "react";
import CustomDialog from "../../components/dialogs/CustomDialog";
import SelectTokenWithPrice from "../../components/form/SelectTokenWithPrice";
import OutlinedButton from "../../components/buttons/OutlinedButton";
import { IAsset, ILiquidation } from "../../utils/interfaces";
import FilledButton from "../../components/buttons/FilledButton";
import { USDC_CONTRACT_ADDRESS, USDC_DECIMAL, WETH_CONTRACT_ADDRESS, WETH_DECIMAL } from "../../utils/constants";

// ---------------------------------------------------------------------------------------------

interface IProps {
  liquidation: ILiquidation | null;
  visible: boolean;
  setVisible: Function;
  closeLiquidateDialog: Function;
}

// ---------------------------------------------------------------------------------------------

const ASSETS: Array<IAsset> = [
  {
    id: 1,
    name: "Ethereum",
    symbol: "eth",
    imgSrc: "/assets/images/ethereum.png",
    contractAddress: WETH_CONTRACT_ADDRESS,
    decimals: WETH_DECIMAL
  },
  {
    id: 2,
    name: "USD Coin",
    symbol: "usdc",
    imgSrc: "/assets/images/usdc.png",
    contractAddress: USDC_CONTRACT_ADDRESS,
    decimals: USDC_DECIMAL
  }
]

// ---------------------------------------------------------------------------------------------

export default function LiquidateDialog({ visible, setVisible, closeLiquidateDialog, liquidation }: IProps) {
  const [payToken, setPayToken] = useState<IAsset>(ASSETS[0])
  const [payTokenAmount, setPayTokenAmount] = useState<string>('0')
  const [receiveToken, setReceiveToken] = useState<IAsset>(ASSETS[1])
  const [receiveTokenAmount, setReceiveTokenAmount] = useState<string>('0')

  //  ---------------------------------------------------------------------------

  return (
    <CustomDialog title="Liquidate" visible={visible} setVisible={setVisible}>
      {/* You pay */}
      <div className="pb-6 bg-gray-900 rounded-md flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg text-gray-100">You Pay</h2>
            <span className="text-gray-500 text-sm">Needless repay will return to your wallet</span>
          </div>

          <SelectTokenWithPrice
            tokens={ASSETS}
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
          tokens={ASSETS}
          selectedToken={receiveToken}
          setSelectedToken={setReceiveToken}
          tokenAmount={receiveTokenAmount}
          setTokenAmount={setReceiveTokenAmount}
        />
      </div>

      <FilledButton
        className="w-full text-base py-3 font-semibold"

      >
        Repay
      </FilledButton>
    </CustomDialog>
  )
}