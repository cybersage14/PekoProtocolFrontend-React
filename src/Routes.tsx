import { lazy } from "react";
import { Navigate, useRoutes } from "react-router-dom";
import Blank from "./pages/Blank";

// ----------------------------------------------------------------------------------

const LandingLayout = lazy(() => import('./layouts/LandingLayout'))
const Lending = lazy(() => import('./pages/Lending'))
const Liquidate = lazy(() => import('./pages/Liquidate'))

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