import { Button } from "@material-tailwind/react";
import { IPropsOfComponent } from "../../utils/interfaces";

export default function TextButton({ className = '', children, ...others }: IPropsOfComponent) {
  return (
    <Button variant="text" className={`normal-case text-sm font-normal text-gray-100 px-4 py-2 ${className}`} {...others}>
      {children}
    </Button>
  )
}