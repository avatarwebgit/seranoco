// src/components/TitleManager.jsx
import { useEffect } from "react";
import { useLocation, matchPath } from "react-router-dom";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";



// Route → Title mapping
const routeTitles = {
  "/:lng": (params, t) => t("titles.home"),
  "/:lng/shopByColor": (params, t) => t("titles.shopByColor"),
  "/:lng/shopByShape": (params, t) => t("titles.shopByShape"),
  "/:lng/categories": (params, t) => t("titles.categories"),
  "/:lng/categories/:id": (params, t) =>
    t("titles.subcategory", { name: params.id }),
  "/:lng/products/:id/:variation": (params, t) =>
    t("titles.products", { name: params.id }),
  "/:lng/myaccount": (params, t) => t("titles.profile"),
  "/:lng/precheckout": (params, t) => t("titles.precheckout"),
  "/:lng/order/pay/:id": (params, t) =>
    t("titles.payByCart", { id: params.id }),
  "/:lng/new-products": (params, t) => t("titles.newProducts"),
  "/:lng/contact-us": (params, t) => t("titles.contactUs"),
  "/:lng/special/:id": (params, t) => t("titles.special", { name: params.id }),
  "/:lng/Blog": (params, t) => t("titles.blog"),
  "/:lng/Blog/:alias": (params, t) =>
    t("titles.singleBlog", { title: params.alias }),
  "/:lng/page/:alias": (params, t) => t("titles.page", { alias: params.alias }),
  "/:lng/factor/:id": (params, t) => t("titles.factor", { id: params.id }),
  "/:lng/reset-password": (params, t) => t("titles.resetPassword"),
  "/:lng/portfolio": (params, t) => t("titles.portfolio"),
  "/:lng/portfolio/:id": (params, t) =>
    t("titles.singlePortfolio", { title: params.id }),
  "/:lng/filters/color/:id": (params, t) =>
    t("titles.filtersColor", { name: params.id }),
  "/:lng/filters/shape/:id": (params, t) =>
    t("titles.filtersShape", { name: params.id }),
  "/*": (params, t) => t("titles.notFound"),
};

export default function TitleManager() {
  const location = useLocation();
  const { t } = useTranslation();
  const lng = useSelector((state) => state.localeStore.lng);

    
  const DEFAULT_TITLE = t("seranoco");
  const TITLE_SEPARATOR = " - ";

  useEffect(() => {
    const matchedRoute = Object.entries(routeTitles).find(([path]) =>
      matchPath(path, location.pathname)
    );

    let title = DEFAULT_TITLE;

    if (matchedRoute) {
      const [path, titleConfig] = matchedRoute;
      const match = matchPath(path, location.pathname);

      if (typeof titleConfig === "function") {
        title = titleConfig(match?.params || {}, t);
      } else {
        title = titleConfig;
      }
    }

    document.title = `${title}${TITLE_SEPARATOR}${DEFAULT_TITLE}`;

    return () => {
      document.title = DEFAULT_TITLE;
    };
  }, [location.pathname, lng, t]);

  return null;
}
