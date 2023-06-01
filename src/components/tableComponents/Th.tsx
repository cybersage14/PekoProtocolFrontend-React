import { useState } from 'react';
import { Icon } from '@iconify/react';
import { IPropsOfComponent } from "../../utils/interfaces";

// -------------------------------------------------------------------------------

interface IProps extends IPropsOfComponent {
  label: string;
  sortable?: boolean;
  sortAsc?: Function;
  sortDesc?: Function;
}

// -------------------------------------------------------------------------------

export default function Th({ className = '', label, sortable = false, sortAsc, sortDesc, ...others }: IProps) {
  const [sortedAsc, setSortedAsc] = useState<boolean>(true)

  const handleSort = (_isAsc: boolean) => {
    setSortedAsc(_isAsc)
    if (_isAsc) {
      sortAsc?.()
    } else {
      sortDesc?.()
    }
  }

  return (
    <th
      className={`text-gray-100 px-4 py-4 text-sm ${sortable ? 'cursor-pointer' : ''} ${className}`}
      onClick={() => handleSort(!sortedAsc)} {...others}
    >
      {sortable ? (
        <div className="flex items-center gap-1">
          <span>{label}</span>
          <div className="flex flex-col items-center">
            <Icon
              icon="ep:arrow-up-bold"
              className={`text-[8px] ${sortedAsc ? 'text-gray-100' : 'text-gray-600'}`}
            />
            <Icon
              icon="ep:arrow-down-bold"
              className={`text-[8px] ${!sortedAsc ? 'text-gray-100' : 'text-gray-600'}`}
            />
          </div>
        </div>
      ) : (
        <>{label}</>
      )}
    </th>
  )
}