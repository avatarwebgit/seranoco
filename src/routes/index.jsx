import React, { lazy } from "react";

const Home = lazy(() => import("../pages/Home"));
const FilterByColor = lazy(() => import("../pages/FilterByColor"));
const FilterByShape = lazy(() => import("../pages/FilterByShape"));
const Products = lazy(() => import("../pages/Products"));
const Profile = lazy(() => import("../pages/Profile"));
const PreCheckout = lazy(() => import("../pages/PreCheckout"));
const PayByCart = lazy(() => import("../pages/PayByCart"));
const New = lazy(() => import("../pages/New"));
const Special = lazy(() => import("../pages/SpecialStones"));
const Categories = lazy(() => import("../pages/Categories"));
const SubCategory = lazy(() => import("../pages/SubCategory"));
const ContactUs = lazy(() => import("../pages/ContactUs"));
const Blog = lazy(() => import("../pages/Blog"));
const SingleBlog = lazy(() => import("../pages/SingleBlog"));
const Page = lazy(() => import("../pages/AdminPanelPage"));
const Factor = lazy(() => import("../pages/Factor"));
const ResetPassword = lazy(() => import("../pages/ResetPassword"));
const ProductsFilter = lazy(() => import("../pages/ProductsFilter"));
const DynamicFilterByColor = lazy(() =>
  import("../pages/dynamicFilterPages/FilterByColor")
);
const DynamicFilterByShape = lazy(() =>
  import("../pages/dynamicFilterPages/FilterByShape")
);

export const NotFoundPage = lazy(() => import("../pages/NotFound"));

export const publicRoutes = [
  { index: true, element: <Home /> },
  { path: "shopByColor", element: <FilterByColor /> },
  { path: "shopByShape", element: <FilterByShape /> },
  { path: "categories", element: <Categories /> },
  { path: "categories/:id", element: <SubCategory /> },
  { path: "products/:id/:variation", element: <Products /> },
  { path: "new-products", element: <New /> },
  { path: "contact-us", element: <ContactUs /> },
  { path: "special/:id", element: <Special /> },
  { path: "Blog", element: <Blog /> },
  { path: "Blog/:alias", element: <SingleBlog /> },
  { path: "page/:alias", element: <Page /> },
  { path: "factor/:id", element: <Factor /> },
  { path: "reset-password", element: <ResetPassword /> },
  { path: "products/filter", element: <ProductsFilter /> },
  { path: "filters/color/:id", element: <DynamicFilterByColor /> },
  { path: "filters/shape/:id", element: <DynamicFilterByShape /> },
];

export const authRoutes = [
  { path: "myaccount", element: <Profile /> },
  { path: "precheckout", element: <PreCheckout /> },
  { path: "order/pay/:id", element: <PayByCart /> },
];
