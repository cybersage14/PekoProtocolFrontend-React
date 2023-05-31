import { IconButton } from '@material-tailwind/react'
import { IPropsOfComponent } from '../../utils/interfaces'

export default function TextIconButton({ className = '', children, ...others }: IPropsOfComponent) {
  return (
    <IconButton
      variant="text"
      className={`w-8 h-8 p-0 text-white hover:bg-gray-100 hover:bg-opacity-10 active:bg-gray-100 active:bg-opacity-10 ${className}`}
      {...others}
    >
      {children}
    </IconButton>
  )
}