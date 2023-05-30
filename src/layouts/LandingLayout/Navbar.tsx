import { Link, useLocation } from "react-router-dom";
import { Icon } from '@iconify/react';
import Container from "../../components/Container";
import TextButton from "../../components/buttons/TextButton";

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
    label: 'Trending',
    iconName: 'icon-park-solid:trend',
    to: '/trending'
  },
]

// -----------------------------------------------------------------------------------------

export default function Navbar() {
  const { pathname } = useLocation()

  return (
    <nav className="bg-gray-900 border-b border-gray-800">
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
      </Container>
    </nav>
  )
}