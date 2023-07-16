import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Icon } from '@iconify/react';
import { useWeb3Modal } from "@web3modal/react"
import { useAccount, useDisconnect, useSwitchNetwork, useNetwork } from "wagmi"
import { Drawer, List, ListItem } from "@material-tailwind/react";
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
    id: 4,
    label: 'Dashboard',
    iconName: 'material-symbols:dashboard',
    to: '/dashboard'
  },
  {
    id: 1,
    label: 'Lending',
    iconName: 'cryptocurrency:lend',
    to: '/lending'
  },
  // {
  //   id: 2,
  //   label: 'Swap',
  //   iconName: 'ph:swap-bold',
  //   to: '/swap'
  // },
  // {
  //   id: 3,
  //   label: 'Bridge',
  //   iconName: 'mdi:bridge',
  //   to: '/bridge'
  // },

  // {
  //   id: 5,
  //   label: 'Trading',
  //   iconName: 'ep:histogram',
  //   to: '/trading'
  // },
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
  const navigate = useNavigate()

  const [visibleDrawer, setVisibleDrawer] = useState<boolean>(false)

  const closeDrawer = () => {
    setVisibleDrawer(false)
  }

  const navigateToPage = (to: string) => {
    navigate(to)
    closeDrawer()
  }

  return (
    <nav className="sticky top-0 bg-gray-900 border-b border-gray-800 z-[99]">
      <Container className="justify-between p-4 hidden lg:flex">
        <div className="flex items-center gap-8">
          <Link to="/">
            <img src="/assets/images/logo.png" alt="logo" className="w-8" />
          </Link>

          <div className="flex items-center gap-4">
            {NAV_LINKS.map(linkItem => (
              <Link key={linkItem.id} to={linkItem.to}>
                <TextButton className={`flex items-center gap-2 ${pathname === linkItem.to ? 'text-gray-100' : 'text-gray-500'}`} >
                  <Icon icon={linkItem.iconName} className="text-lg" />
                  {linkItem.label}
                </TextButton>
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-8">
          {/* <TextIconButton>
            <Icon icon="octicon:question-16" className="text-xl" />
          </TextIconButton> */}

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

      <Container className="justify-between items-center p-4 flex lg:hidden">
        <Link to="/">
          <img src="/assets/images/logo.png" alt="logo" className="w-8" />
        </Link>

        <TextIconButton onClick={() => setVisibleDrawer(true)}>
          <Icon icon="ion:menu" className="text-xl" />
        </TextIconButton>

        <Drawer open={visibleDrawer} onClose={closeDrawer} className="p-4 bg-gray-900">
          <div className="flex flex-col gap-8">
            <div className="flex items-center justify-between">
              <Link to="/">
                <img src="/assets/images/logo.png" alt="logo" className="w-8" />
              </Link>

              <TextIconButton onClick={closeDrawer}>
                <Icon icon="akar-icons:cross" className="text-xl" />
              </TextIconButton>
            </div>

            <List>
              {NAV_LINKS.map(linkItem => (
                <ListItem key={linkItem.id} onClick={() => navigateToPage(linkItem.to)} className={`gap-4 ${pathname === linkItem.to ? 'text-gray-100' : 'text-gray-500'}`} disabled={!isConnected}>
                  <Icon icon={linkItem.iconName} className="text-lg" />
                  {linkItem.label}
                </ListItem>
              ))}
            </List>

            <List>
              {isConnected ? chain?.id === Number(chainId) ? (
                <ListItem className="gap-4 text-gray-100" onClick={() => disconnect()}>
                  <Icon icon="mdi:wallet-outline" className="text-xl" />
                  Disconnect
                </ListItem>
              ) : (
                <ListItem className="gap-4 text-gray-100" onClick={() => switchNetwork?.(Number(chainId))}>
                  <Icon icon="mdi:wallet-outline" className="text-xl" />
                  Switch network
                </ListItem>
              ) : (
                <ListItem className="gap-4 text-gray-100" onClick={() => open()}>
                  <Icon icon="mdi:wallet-outline" className="text-xl" />
                  Connect Wallet
                </ListItem>
              )}
            </List>
          </div>
        </Drawer>
      </Container>
    </nav>
  )
}