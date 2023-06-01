import { IPropsOfComponent } from "../../utils/interfaces";

export default function Table({ className = '', children, ...others }: IPropsOfComponent) {
  return (
    <table className={`table-auto ${className}`} {...others}>
      {children}
    </table>
  )
}