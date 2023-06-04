import { IPropsOfComponent } from "../../utils/interfaces";

export default function Tr({ className = '', children, ...others }: IPropsOfComponent) {
  return (
    <tr className={`bg-transparent hover:bg-gray-800 transition cursor-pointer ${className}`} {...others}>
      {children}
    </tr>
  )
}