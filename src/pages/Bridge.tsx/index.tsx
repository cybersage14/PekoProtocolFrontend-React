import { lazy, useState } from "react";
import PageHeader from "../../components/PageHeader";
import { IChain } from "../../utils/interfaces";
import { TEMP_CHAINS } from "../../utils/constants";
import { Icon } from "@iconify/react";

// ---------------------------------------------------------------------------------------------

const SelectChain = lazy(() => import('../../components/form/SelectChain'))

// ---------------------------------------------------------------------------------------------

export default function Bridge() {
  const [sourceChain, setSourceChain] = useState<IChain | null>(null)
  const [targetChain, setTargetChain] = useState<IChain | null>(null)

  return (
    <div className="flex flex-col gap-8 mb-8">
      <PageHeader title="Transfer tokens across chains" description="Simply and safely, powered by Wormhole" />
      <div className="container max-w-lg p-4 bg-gray-900 rounded-md">
        <h1 className="text-gray-100 text-xl">Bridge</h1>
        <div className="flex flex-col gap-4 mt-4">
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
        </div>
      </div>
    </div>
  )
}