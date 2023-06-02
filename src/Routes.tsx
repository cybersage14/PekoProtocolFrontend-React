import { lazy } from "react";
import { Navigate, useRoutes } from "react-router-dom";
import Blank from "./pages/Blank";
import Bridge from "./pages/Bridge.tsx";

// ----------------------------------------------------------------------------------

const LandingLayout = lazy(() => import('./layouts/LandingLayout'))
const Lending = lazy(() => import('./pages/Lending'))
const Liquidate = lazy(() => import('./pages/Liquidate'))
const Swap = lazy(() => import('./pages/Swap'))

// ----------------------------------------------------------------------------------

export default function Routes() {
  return useRoutes([
    {
      element: <LandingLayout />,
      path: '/',
      children: [
        {
          path: 'lending',
          element: <Lending />
        },
        {
          path: 'liquidate',
          element: <Liquidate />
        },
        {
          path: 'swap',
          element: <Swap />
        },
        {
          path: 'bridge',
          element: <Bridge />
        },
        {
          path: '/',
          element: <Navigate to="/lending" replace />
        },
        {
          path: '404',
          element: <Blank />
        },
        {
          path: '*',
          element: <Navigate to="/404" replace />
        }
      ]
    }
  ])
}