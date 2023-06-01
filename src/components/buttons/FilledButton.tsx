import { Button } from '@material-tailwind/react';
import { IPropsOfComponent } from '../../utils/interfaces';

export default function FilledButton({ className = '', children, ...others }: IPropsOfComponent) {
  return (
    <Button
      variant="filled"
      className={`rounded-md normal-case text-sm font-normal shadow-none hover:shadow-none px-4 py-2 ${className}`}
      {...others}
    >
      {children}
    </Button>
  )
}