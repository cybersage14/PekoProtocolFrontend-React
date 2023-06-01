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
    <div className={`border border-gray-900 rounded-lg flex flex-col gap-6 ${className}`}>
      <div className="bg-gray-900 py-3 px-4 flex items-center justify-between rounded-t-lg">
        <h1 className="text-gray-100 text-lg font-bold">{title}</h1>
        {action || <></>}
      </div>
      <div>
        {children}
      </div>
    </div>
  )
}