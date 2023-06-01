import { ReactNode } from "react";

interface IProps {
  className?: string;
  children: ReactNode;
}

export default function Container({ className = '', children }: IProps) {
  return (
    <div className={`px-6 ${className}`}>
      {children}
    </div>
  )
}