import CloseIcon from "@mui/icons-material/Close";
import FilterListIcon from "@mui/icons-material/FilterList";
import { Skeleton } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Link, useParams, useSearchParams } from "react-router-dom";

import BannerCarousel from "../components/BannerCarousel";
import Breadcrumbs from "../components/common/Breadcrumbs";
import Body from "../components/filters_page/Body";
import Card from "../components/filters_page/Card";
import PortfolioSidebar from "../components/portfolio/PortfolioSidebar";
import Footer from "../layout/Footer";
import Header from "../layout/Header";

import {
  getPorlfolioCategories,
  getPorlfolios,
  getPortfoliosByCategory,
} from "../services/api";
import classes from "./Portfolio.module.css";

const Portfolio = ({ windowSize }) => {
  const [searchParams] = useSearchParams();
  const categoryId = searchParams.get("category");
  console.log(categoryId);

  const lng = useSelector((state) => state.localeStore.lng);

  const { t, i18n } = useTranslation();
  const [portfolioItems, setPortfolioItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeFilter, setActiveFilter] = useState("All");
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const allCategoryString = useMemo(() => {
    return i18n.language === "fa" ? "همه" : "All";
  }, [i18n.language]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const isFa = i18n.language === "fa";

        // 1️⃣ Fetch categories
        const categoriesRes = await getPorlfolioCategories();
        const rawCategories = categoriesRes.result;

        // Build quick lookup for category titles
        const categoryNameMap = new Map();
        rawCategories.forEach((cat) => {
          categoryNameMap.set(cat.id, cat.title);
        });

        // Add children support (if API already provides children, skip this step)
        const processedCategories = rawCategories.map((cat) => ({
          id: cat.id,
          name: cat.title,
          children: cat.children || [], // depends on API structure
          ...cat,
        }));

        setCategories(processedCategories);

        // 2️⃣ If a category is selected
        if (categoryId) {
          const selectedCategory = processedCategories.find(
            (cat) => cat.id === parseInt(categoryId)
          );

          // ✅ If category has children, show children instead of fetching portfolios
          if (selectedCategory && selectedCategory.children?.length > 0) {
            const childItems = selectedCategory.children.map((child) => ({
              ...child,
              slug: child.alias,
              title:
                isFa && child.title
                  ? child.title
                  : child.title_en || child.title,
              image: child.image,
              images: [child.image],
            }));
            setPortfolioItems(childItems);
            setActiveFilter(selectedCategory.name);
            return; // Stop here (don't fetch portfolios yet)
          }

          // ✅ Otherwise, fetch portfolios for this leaf category
          const portfolioRes = await getPortfoliosByCategory(categoryId);
          const rawPortfolios = portfolioRes.result;

          const processedPortfolios = rawPortfolios.map((item) => ({
            id: item.id,
            slug: item.alias,
            title:
              isFa && item.title ? item.title : item.title_en || item.title,
            images: [item.image],
            category_id: item.category_id,
            category: categoryNameMap.get(item.category_id) || "Uncategorized",
          }));

          setPortfolioItems(processedPortfolios);
          setActiveFilter(selectedCategory?.name || allCategoryString);
        } else {
          // 3️⃣ No category selected → load all portfolios
          const portfolioRes = await getPorlfolios();
          const rawPortfolios = portfolioRes.result;

          const processedPortfolios = rawPortfolios.map((item) => ({
            id: item.id,
            slug: item.alias,
            title:
              isFa && item.title ? item.title : item.title_en || item.title,
            images: [item.image],
            category_id: item.category_id,
            category: categoryNameMap.get(item.category_id) || "Uncategorized",
          }));

          setPortfolioItems(processedPortfolios);
          // setActiveFilter(allCategoryString); // Uncomment if needed
        }
      } catch (error) {
        console.error("Failed to fetch portfolio data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [i18n.language, allCategoryString, categoryId]);

  useEffect(() => {
    console.log(portfolioItems);
  }, [portfolioItems]);

  useEffect(() => {
    const fetchData = async () => {
      const { response, result } = await getPortfoliosByCategory(categoryId);
      console.log(response, result);
    };
    if (categoryId) {
      fetchData();
    }
  }, [categoryId]);

  useEffect(() => {
    if (isMobileSidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileSidebarOpen]);

  const filteredItems = useMemo(() => {
    if (activeFilter === allCategoryString) {
      return portfolioItems;
    }

    return portfolioItems.filter((item) => item.category === activeFilter);
  }, [activeFilter, portfolioItems, allCategoryString]);

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    setIsMobileSidebarOpen(false);
  };

  return (
    <section className={classes.main}>
      <BannerCarousel />
      <Header windowSize={windowSize} />
      <Body>
        <Card className={classes.break}>
          <Breadcrumbs
            linkDataProp={[
              { pathname: t("home"), url: "" },
              { pathname: t("portfolio") },
            ]}
          />
          <div
            className={classes.portfolioContainer}
            dir={lng === "fa" ? "rtl" : "ltr"}
          >
            <div className={classes.contentWrapper}>
              <div className={classes.sidebarWrapper}>
                <PortfolioSidebar
                  categories={categories}
                  activeFilter={activeFilter}
                  onFilterChange={setActiveFilter}
                  loading={loading}
                />
              </div>

              {/* --- Main Content --- */}
              <main className={classes.mainContent}>
                <div className={classes.pageHeader}>
                  <h1 className={classes.pageTitle}>{t("our_portfolio")}</h1>
                  <button
                    className={classes.mobileFilterTrigger}
                    onClick={() => setIsMobileSidebarOpen(true)}
                    aria-label="Open filters"
                  >
                    <FilterListIcon />
                    <span>{t("filters", "Filters")}</span>
                  </button>
                </div>
                <div className={classes.portfolioGrid}>
                  {categoryId
                    ? portfolioItems.map((item) => {
                        const hasChildren =
                          item.children && item.children.length > 0;

                        if (!hasChildren) {
                          return (
                            <Link
                              to={`/${lng}/portfolio/${item.slug}`}
                              key={item.id}
                              className={classes.portfolioCard}
                              target="_blank"
                            >
                              <img
                                src={item.images[0]}
                                alt={item.title}
                                className={classes.cardImage}
                              />
                              <div className={classes.cardOverlay}>
                                <h3 className={classes.cardTitle}>
                                  {lng === "fa" ? item.title_fa : item.title}
                                </h3>
                              </div>
                            </Link>
                          );
                        }
                        return (
                          <Link
                            to={`/${lng}/portfolio?category=${item.id}`}
                            key={item.id}
                            className={classes.portfolioCard}
                          >
                            <img
                              src={item.image || null}
                              alt={item.title}
                              className={classes.cardImage}
                            />
                            <div className={classes.cardOverlay}>
                              <h3 className={classes.cardTitle}>
                                {lng === "fa" ? item.title_fa : item.title}
                              </h3>
                            </div>
                          </Link>
                        );
                      })
                    : categories.map((item) => {
                        return (
                          <Link
                            to={`/${lng}/portfolio?category=${item.id}`}
                            key={item.id}
                            className={classes.portfolioCard}
                          >
                            <img
                              src={item.image || null}
                              alt={item.title}
                              className={classes.cardImage}
                            />
                            <div className={classes.cardOverlay}>
                              <h3 className={classes.cardTitle}>
                                {lng === "fa" ? item.title_fa : item.title}
                              </h3>
                            </div>
                          </Link>
                        );
                      })}
                </div>
              </main>
            </div>
          </div>
        </Card>
      </Body>
      <Footer windowSize={windowSize} />

      <div
        className={`${classes.mobileSidebarOverlay} ${
          isMobileSidebarOpen ? classes.open : ""
        }`}
        onClick={() => setIsMobileSidebarOpen(false)}
        role="dialog"
        aria-modal="true"
      >
        <div
          className={`${classes.mobileSidebar} ${
            isMobileSidebarOpen ? classes.open : ""
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className={classes.mobileSidebarHeader}>
            <h2>{t("filters")}</h2>
            <button
              onClick={() => setIsMobileSidebarOpen(false)}
              aria-label="Close filters"
            >
              <CloseIcon />
            </button>
          </div>
          <div className={classes.mobileSidebarBody}>
            <PortfolioSidebar
              categories={categories}
              activeFilter={activeFilter}
              onFilterChange={handleFilterChange}
              isPlain={true}
              loading={loading}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Portfolio;
