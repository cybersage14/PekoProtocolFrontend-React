import { lazy } from "react";
import { useRoutes } from "react-router-dom";

// ----------------------------------------------------------------------------------

const LandingLayout = lazy(() => import('./layouts/LandingLayout'))
const Lending = lazy(() => import('./pages/Lending'))

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
        }
      ]
    }
  ])
}