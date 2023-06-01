import { Icon } from "@iconify/react";
import Container from "../../components/containers/Container";
import TextIconButton from "../../components/buttons/TextIconButton";

export default function Footer() {
  return (
    <footer className="bg-gray-900">
      <Container className="flex justify-between items-center my-5">
        <div className="flex items-center gap-2">
          <span className="text-gray-600">Audited by:</span>
        </div>

        <span className="text-gray-200">
          Copyrights © {new Date().getFullYear()} Peko
        </span>

        <div className="flex items-center gap-2">
          <TextIconButton>
            <Icon icon="ic:baseline-discord" className="text-2xl" />
          </TextIconButton>
          <TextIconButton>
            <Icon icon="mdi:twitter" className="text-2xl" />
          </TextIconButton>
        </div>
      </Container>
    </footer>
  )
}