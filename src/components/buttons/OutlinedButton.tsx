import { Button } from '@material-tailwind/react'
import { IPropsOfComponent } from '../../utils/interfaces'

export default function OutlinedButton({ className = '', children, ...others }: IPropsOfComponent) {
  return (
    <Button
      variant="outlined"
      className={`rounded-md normal-case text-sm font-normal px-4 py-2 ${className}`}
      {...others}
    >
      {children}
    </Button>
  )
}