import React, { Suspense, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import Loading from "./layout/Loading";
import { cartActions } from "./store/store";

import Drawer from "./layout/Drawer";
import FixedNavigation from "./layout/FixedNavigation";

import "./App.css";

import i18next from "i18next";
import FavoritesDrawer from "./layout/FavoritesDrawer";
import { useBasicInformation } from "./services/api";
function App() {
  const [windowSize, setWindowSize] = useState(() => {
    const width = window.innerWidth;
    if (width <= 480) return "xs";
    if (width > 481 && width <= 768) return "s";
    if (width > 768 && width <= 1024) return "m";
    if (width > 1024 && width <= 1200) return "l";
    if (width > 1200) return "xl";
  });

  const Home = React.lazy(() => import("./pages/Home"));
  const FilterByColor = React.lazy(() => import("./pages/FilterByColor"));
  const FilterByShape = React.lazy(() => import("./pages/FilterByShape"));
  const Products = React.lazy(() => import("./pages/Products"));
  const Profile = React.lazy(() => import("./pages/Profile"));
  const PreCheckout = React.lazy(() => import("./pages/PreCheckout"));
  const PayByCart = React.lazy(() => import("./pages/PayByCart"));
  const New = React.lazy(() => import("./pages/New"));
  const Special = React.lazy(() => import("./pages/SpecialStones"));
  const Categories = React.lazy(() => import("./pages/Categories"));
  const SubCategory = React.lazy(() => import("./pages/SubCategory"));
  const NotFound = React.lazy(() => import("./pages/NotFound"));
  const ContactUs = React.lazy(() => import("./pages/ContactUs"));
  const Blog = React.lazy(() => import("./pages/Blog"));
  const SingleBlog = React.lazy(() => import("./pages/SingleBlog"));
  const Page = React.lazy(() => import("./pages/AdminPanelPage"));
  const Factor = React.lazy(() => import("./pages/Factor"));
  const ResetPassword = React.lazy(() => import("./pages/ResetPassword"));
  const ProductsFilter = React.lazy(() => import("./pages/ProductsFilter"));
  const DynamicFilterByColor = React.lazy(() =>
    import("./pages/dynamicFilterPages/FilterByColor")
  );
  const DynamicFilterByShape = React.lazy(() =>
    import("./pages/dynamicFilterPages/FilterByShape")
  );

  const lng = useSelector((state) => state.localeStore.lng);
  const token = useSelector((state) => state.userStore.token);

  const { data: basicData } = useBasicInformation();

  const dispatch = useDispatch();

  const RequireAuth = ({ children }) => {
    return token ? children : <Navigate to={`/${lng}`} replace />;
  };

  useEffect(() => {
    const calculeSize = () => {
      const width = window.innerWidth;
      if (width <= 480) {
        return "xs";
      }
      if (width > 481 && width <= 768) {
        return "s";
      }
      if (width > 768 && width <= 1024) {
        return "m";
      }
      if (width > 1024 && width <= 1200) {
        return "l";
      }
      if (width > 1200) {
        return "xl";
      }
    };

    window.addEventListener("resize", () => setWindowSize(calculeSize));

    return () => {
      window.removeEventListener("resize", () => setWindowSize(calculeSize));
    };
  }, []);

  useEffect(() => {
    document.body.className = lng === "fa" ? "fa" : "en";
  }, [lng]);

  useEffect(() => {
    if (basicData) {
      dispatch(cartActions?.setEuro(basicData?.data[0].price_euro));
    }
  }, [basicData]);

  useEffect(() => {
    const updateMetaTag = () => {
      const lang = i18next.language;
      const existingMeta = document.querySelector('meta[name="enamad"]');

      if (lang === "fa") {
        if (!existingMeta) {
          const meta = document.createElement("meta");
          meta.name = "enamad";
          meta.content = "39218540";
          document.head.appendChild(meta);
        }
      } else {
        if (existingMeta) {
          document.head.removeChild(existingMeta);
        }
      }
    };

    updateMetaTag();

    const handleLangChanged = () => {
      updateMetaTag();
    };

    i18next.on("languageChanged", handleLangChanged);

    return () => {
      i18next.off("languageChanged", handleLangChanged);
    };
  }, [lng]);

  window.addEventListener("storage", (event) => {
    if (event.key === "persist:root") {
      window.location.reload();
    }
  });

  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path={`/:lng`} element={<Home windowSize={windowSize} />} />
        <Route path={"/"} element={<Navigate to={`/${lng}`} replace />} />
        <Route path={` `} element={<Navigate to={`/${lng}`} replace />} />
        <Route
          path={`/:lng/shopByColor`}
          element={<FilterByColor windowSize={windowSize} />}
        />
        <Route
          path={`/:lng/shopByShape`}
          element={<FilterByShape windowSize={windowSize} />}
        />
        <Route
          path={`/:lng/categories`}
          element={<Categories windowSize={windowSize} />}
        />
        <Route
          path={`/:lng/categories/:id`}
          element={<SubCategory windowSize={windowSize} />}
        />
        <Route
          path={`/:lng/products/:id/:variation`}
          element={<Products windowSize={windowSize} />}
        />
        <Route
          path={`/:lng/myaccount`}
          element={
            <RequireAuth>
              <Profile windowSize={windowSize} />
            </RequireAuth>
          }
        />
        <Route
          path={`/:lng/precheckout`}
          element={
            <RequireAuth>
              <PreCheckout windowSize={windowSize} />
            </RequireAuth>
          }
        />
        <Route
          path={`/:lng/order/pay/:id`}
          element={
            <RequireAuth>
              <PayByCart widnowSize={windowSize} />
            </RequireAuth>
          }
        />
        <Route
          path={`/:lng/new-products`}
          element={<New windowSize={windowSize} />}
        />
        <Route
          path={`/:lng/contact-us`}
          element={<ContactUs windowSize={windowSize} />}
        />
        <Route
          path={`/:lng/special/:id`}
          element={<Special windowSize={windowSize} />}
        />
        <Route path={`/:lng/Blog`} element={<Blog windowSize={windowSize} />} />
        <Route
          path={`/:lng/Blog/:alias`}
          element={<SingleBlog windowSize={windowSize} />}
        />
        <Route
          path={`/:lng/page/:alias`}
          element={<Page windowSize={windowSize} />}
        />
        <Route
          path={`/:lng/factor/:id`}
          element={<Factor windowSize={windowSize} />}
        />

        <Route
          path={`/:lng/reset-password`}
          element={<ResetPassword windowSize={windowSize} />}
        />
        <Route
          path={`/:lng/products/filter`}
          element={<ProductsFilter windowSize={windowSize} />}
        />
        <Route
          path={`/:lng/filters/color/:id`}
          element={<DynamicFilterByColor windowSize={windowSize} />}
        />
        <Route
          path={`/:lng/filters/shape/:id`}
          element={<DynamicFilterByShape windowSize={windowSize} />}
        />

        <Route path={`/*`} element={<NotFound windowSize={windowSize} />} />
      </Routes>

      {windowSize === "xs" &&  <FixedNavigation />}
      {windowSize === "s" &&  <FixedNavigation />}
      <Drawer size={windowSize} />
      <FavoritesDrawer size={windowSize} />
      <ToastContainer
        theme="dark"
        className={"toast"}
        autoClose={5000}
        newestOnTop={true}
        closeButton={false}
        rtl={lng === "fa" ? true : false}
        pauseOnFocusLoss={false}
        pauseOnHover={true}
      />
    </Suspense>
  );
}

export default App;
