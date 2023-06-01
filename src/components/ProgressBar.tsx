import { ReactNode } from 'react';
import { Progress } from '@material-tailwind/react'
import { IPropsOfComponent } from "../utils/interfaces";
import { color } from '@material-tailwind/react/types/components/progress';

// -----------------------------------------------------------------------------------

interface IProps extends IPropsOfComponent {
  label: string;
  value: number;
  valueNode?: ReactNode;
  color?: color;
}

// -----------------------------------------------------------------------------------

export default function ProgressBar({ label, value, valueNode, children, color = 'blue', ...others }: IProps) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <span className="text-gray-100">{label}</span>
        {valueNode || <></>}
      </div>
      <Progress value={value} color={color} className="bg-gray-900" />
    </div>
  )
}