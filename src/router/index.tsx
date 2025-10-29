import { createBrowserRouter, RouteObject } from "react-router-dom";

import App from '../App';
import HomePage from "@features/Home";
import Clothing from "@features/Clothing";
import Electronics from "@features/Electronics";
import OfficeSupplies from "@features/OfficeSupplies";
import PetSupplies from "@features/PetSupplies";
import Rentals from "@features/Rentals";
import SportingGoods from "@features/SportingGoods";
import ToysAndGames from "@features/ToysAndGames";
import Vehicles from "@features/Vehicles";
import ListingPage from "@features/ListingPage";
import Buying from "@features/Buying";
import Selling from "@features/Selling";
import Messages from "@features/Messages";
import Notifications from "@features/Notifications";

export const routes: RouteObject[] = [
  {
    element: <App />,
    children: [
      { index: true, element: <HomePage /> },
      { path: '/products/:productSlug', element: <ListingPage /> },
      { path: '/buying', element: <Buying /> },
      { path: '/selling', element: <Selling /> },
      { path: '/clothing', element: <Clothing /> },
      { path: '/electronics', element: <Electronics /> },
      { path: '/office-supplies', element: <OfficeSupplies /> },
      { path: '/pet-supplies', element: <PetSupplies /> },
      { path: '/rentals', element: <Rentals /> },
      { path: '/sporting-goods', element: <SportingGoods /> },
      { path: '/toys-and-games', element: <ToysAndGames /> },
      { path: '/vehicles', element: <Vehicles /> },
      { path: '/notifications', element: <Notifications /> },
      { path: '/messages', element: <Messages /> },

    ],
  },
]

export const router = createBrowserRouter(routes);