import { lazy } from "react";
import { Outlet } from "react-router-dom";

// ---------------------------------------------------------------------------------------

const Navbar = lazy(() => import('./Navbar'))
const Footer = lazy(() => import('./Footer'))

// ---------------------------------------------------------------------------------------

export default function LandingLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-[#111111]">
      <Navbar />
      <div className="flex-1">
        <Outlet />
      </div>
      <Footer />
    </div>
  )
}