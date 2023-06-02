import { ReactNode } from 'react';
import { IPropsOfComponent } from "../../utils/interfaces";

// ----------------------------------------------------------------------------------------

interface IProps extends IPropsOfComponent {
  title: string;
  action?: ReactNode;
}

// ----------------------------------------------------------------------------------------

export default function PrimaryBoard({ className = '', title = '', action, children }: IProps) {

  return (
    <div className={`border border-gray-900 rounded-lg flex flex-col ${className}`}>
      <div className="bg-gray-900 py-3 px-4 flex items-center justify-between rounded-t-lg">
        <h3 className="text-gray-100 text-lg font-bold">{title}</h3>
        {action || <></>}
      </div>
      <div className="flex-1">
        {children}
      </div>
    </div>
  )
}