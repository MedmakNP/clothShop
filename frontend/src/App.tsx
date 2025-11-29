// src/App.tsx (або де в тебе роутер)

import React from "react";
import HomePage from "./Pages/homePage";
import ShopPage from "./Pages/shopPage";
import BuyersPage from "./Pages/buyersPage";
import BlogPage from "./Pages/blogPage";
import ContactsPage from "./Pages/contactsPage";
import AdminDbPage from "./Pages/adminPage";
import "./i18n";
import { createHashRouter } from "react-router-dom";
import ProductPage from "./Pages/product";

interface RouteConfig {
  path: string;
  element: React.ReactNode;
}

const routerConfig: RouteConfig[] = [
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/shopPage",
    element: <ShopPage />,
  },
  {
    path: "/buyersPage",
    element: <BuyersPage />,
  },
  {
    path: "/blogPage",
    element: <BlogPage />,
  },
  {
    path: "/contactsPage",
    element: <ContactsPage />,
  },
  {
    path: "/product/:slug",
    element: <ProductPage />,
  },
  {
    path: "/admin",
    element: <AdminDbPage />,
  },
];

const router = createHashRouter(routerConfig);

export default router;