import { lazy } from "react";
import { Navigate, useRoutes } from "react-router-dom";
import Blank from "./pages/Blank";

// ----------------------------------------------------------------------------------

const LandingLayout = lazy(() => import('./layouts/LandingLayout'))
const Lending = lazy(() => import('./pages/Lending'))
const Liquidate = lazy(() => import('./pages/Liquidate'))
const Swap = lazy(() => import('./pages/Swap'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Bridge = lazy(() => import('./pages/Bridge'))
const Trading = lazy(() => import('./pages/Trading'))

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
          path: 'dashboard',
          element: <Dashboard />
        },
        {
          path: 'trading',
          element: <Trading />
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