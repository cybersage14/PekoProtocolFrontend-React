import { IPropsOfComponent } from "../utils/interfaces";

export default function CardsField({ children }: IPropsOfComponent) {
  return (
    <div className="relative">
      <div className="absolute top-[-2rem] w-full">
        {children}
      </div>
    </div>
  )
}