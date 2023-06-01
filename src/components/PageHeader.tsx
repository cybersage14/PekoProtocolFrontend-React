import { IPropsOfComponent } from "../utils/interfaces";
import Container from "./containers/Container";

interface IProps extends IPropsOfComponent {
  title: string;
  description: string;
}

export default function PageHeader({ className = '', title, description }: IProps) {
  return (
    <header className={`bg-gradient-to-b from-[#111111] to-gray-800 pt-12 pb-14 ${className}`}>
      <Container className="flex flex-col gap-4">
        <h1 className="text-gray-100 text-3xl text-center">{title}</h1>
        <p className="text-gray-500 text-center">{description}</p>
      </Container>
    </header>
  )
}