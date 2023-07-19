import { Icon } from "@iconify/react";
import Container from "../../components/containers/Container";
import TextIconButton from "../../components/buttons/TextIconButton";

export default function Footer() {
  return (
    <footer className="bg-gray-900">
      <Container className="hidden lg:flex justify-between items-center my-5">
        <div className="flex items-center gap-2">
          <span className="text-gray-600">Audited by:</span>
        </div>

        <span className="text-gray-200">
          Copyrights © {new Date().getFullYear()} Peko
        </span>

        <div className="flex items-center gap-4">
          <a href="https://discord.gg/MXR36KK8" target="_blank" rel="noreferrer" className="text-gray-500 transition hover:text-gray-100">
            <Icon icon="ic:baseline-discord" className="text-2xl" />
          </a>
          <a href="https://twitter.com/pekoprotocol" target="_blank" rel="noreferrer" className="text-gray-500 transition hover:text-gray-100">
            <Icon icon="mdi:twitter" className="text-2xl" />
          </a>
        </div>
      </Container>

      <Container className="flex lg:hidden flex-col my-4">
        <p className="text-gray-200 text-center">
          Copyrights © {new Date().getFullYear()} Peko
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-gray-600">Audited by:</span>
          </div>
          <div className="flex items-center gap-2">
            <a href="https://discord.gg/MXR36KK8" target="_blank" rel="noreferrer" className="text-gray-500 transition hover:text-gray-100">
              <Icon icon="ic:baseline-discord" className="text-2xl" />
            </a>
            <a href="https://twitter.com/pekoprotocol" target="_blank" rel="noreferrer" className="text-gray-500 transition hover:text-gray-100">
              <Icon icon="mdi:twitter" className="text-2xl" />
            </a>
          </div>
        </div>
      </Container>
    </footer>
  )
}