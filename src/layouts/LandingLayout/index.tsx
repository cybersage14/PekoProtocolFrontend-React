import { lazy, useEffect } from "react";
import { useMediaQuery } from "react-responsive";
import { Outlet } from "react-router-dom";
import useDialogSize from "../../hooks/useDialogSize";
import useLoading from "../../hooks/useLoading";
import Loading from "../../components/Loading";

// ---------------------------------------------------------------------------------------

const Navbar = lazy(() => import('./Navbar'))
const Footer = lazy(() => import('./Footer'))

// ---------------------------------------------------------------------------------------

export default function LandingLayout() {
  const isMobile = useMediaQuery({ maxWidth: 480 });
  const isTablet = useMediaQuery({ minWidth: 480, maxWidth: 768 });
  const isLaptop = useMediaQuery({ minWidth: 768, maxWidth: 1024 });
  const isDesktop = useMediaQuery({ minWidth: 1024, maxWidth: 1280 });
  const { isLoading } = useLoading()
  const { setDialogSizeAct } = useDialogSize()

  useEffect(() => {
    if (isMobile) {
      setDialogSizeAct('xxl')
    } else if (isTablet) {
      setDialogSizeAct('xl')
    } else if (isLaptop) {
      setDialogSizeAct('md')
    } else if (isDesktop) {
      setDialogSizeAct('sm')
    } else {
      setDialogSizeAct('sm')
    }
  }, [isMobile, isTablet, isLaptop, isDesktop])

  return (
    <>
      {isLoading ? <Loading /> : (
        <div className="min-h-screen flex flex-col bg-[#111111]">
          <Navbar />
          <div className="flex-1">
            <Outlet />
          </div>
          <Footer />
        </div>)}
    </>

  )
}