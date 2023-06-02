import { ReactNode } from "react";
import { IPropsOfComponent } from "../../utils/interfaces";

interface IProps extends IPropsOfComponent {
  title: string;
  action?: ReactNode;
}

export default function Section({ className = '', children, title, action, ...others }: IProps) {
  return (
    <section className={`flex flex-col gap-4 ${className}`} {...others}>
      <div className="flex items-center justify-between">
        <h2 className="text-gray-100 text-2xl">{title}</h2>
        {action && <>{action}</>}
      </div>
      {children}
    </section>
  )
}