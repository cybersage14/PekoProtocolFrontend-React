import { Link, useLocation } from "react-router-dom";
import { Icon } from '@iconify/react';
import { useWeb3Modal } from "@web3modal/react"
import { useAccount, useDisconnect, useSwitchNetwork, useNetwork } from "wagmi"
import Container from "../../components/containers/Container";
import TextButton from "../../components/buttons/TextButton";
import TextIconButton from "../../components/buttons/TextIconButton";
import FilledButton from "../../components/buttons/FilledButton";

// -----------------------------------------------------------------------------------------

interface INavLink {
  id: number;
  label: string;
  iconName: string;
  to: string;
}

// -----------------------------------------------------------------------------------------

const NAV_LINKS: Array<INavLink> = [
  {
    id: 1,
    label: 'Lending',
    iconName: 'cryptocurrency:lend',
    to: '/lending'
  },
  {
    id: 2,
    label: 'Swap',
    iconName: 'ph:swap-bold',
    to: '/swap'
  },
  {
    id: 3,
    label: 'Bridge',
    iconName: 'mdi:bridge',
    to: '/bridge'
  },
  {
    id: 4,
    label: 'Dashboard',
    iconName: 'material-symbols:dashboard',
    to: '/dashboard'
  },
  {
    id: 5,
    label: 'Trading',
    iconName: 'ep:histogram',
    to: '/trading'
  },
]

const chainId = process.env.REACT_APP_CHAIN_ID

// -----------------------------------------------------------------------------------------

export default function Navbar() {
  const { pathname } = useLocation()
  const { open } = useWeb3Modal()
  const { isConnected } = useAccount()
  const { disconnect } = useDisconnect()
  const { switchNetwork } = useSwitchNetwork()
  const { chain } = useNetwork()

  return (
    <nav className="sticky top-0 bg-gray-900 border-b border-gray-800">
      <Container className="flex justify-between p-4">
        <div className="flex items-center gap-8">
          <Link to="/">
            <img src="/assets/images/logo.png" alt="logo" className="w-8" />
          </Link>

          <div className="flex items-center gap-4">
            {NAV_LINKS.map(linkItem => (
              <Link key={linkItem.id} to={linkItem.to}>
                <TextButton className={`flex items-center gap-2 ${pathname === linkItem.to ? 'text-gray-100' : 'text-gray-500'}`}>
                  <Icon icon={linkItem.iconName} className="text-lg" />
                  {linkItem.label}
                </TextButton>
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-8">
          <TextIconButton>
            <Icon icon="octicon:question-16" className="text-xl" />
          </TextIconButton>

          {isConnected ? chain?.id === Number(chainId) ? (
            <FilledButton className="flex items-center gap-1" onClick={() => disconnect()}>
              <Icon icon="mdi:wallet-outline" className="text-xl" />
              Disconnect
            </FilledButton>
          ) : (
            <FilledButton className="flex items-center gap-1" onClick={() => switchNetwork?.(Number(chainId))}>
              <Icon icon="mdi:wallet-outline" className="text-xl" />
              Switch network
            </FilledButton>
          ) : (
            <FilledButton className="flex items-center gap-1" onClick={() => open()}>
              <Icon icon="mdi:wallet-outline" className="text-xl" />
              Connect Wallet
            </FilledButton>
          )}
        </div>
      </Container>
    </nav>
  )
}