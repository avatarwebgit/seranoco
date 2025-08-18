import React, { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import CloseIcon from "@mui/icons-material/Close";
import FilterListIcon from "@mui/icons-material/FilterList";

import Header from "../layout/Header";
import Footer from "../layout/Footer";
import Body from "../components/filters_page/Body";
import Card from "../components/filters_page/Card";
import BannerCarousel from "../components/BannerCarousel";
import Breadcrumbs from "../components/common/Breadcrumbs";
import PortfolioSidebar from "../components/portfolio/PortfolioSidebar";

import classes from "./Portfolio.module.css";
import { getPorlfolioCategories, getPorlfolios } from "../services/api";

// English Data
const portfolioItems = [
  {
    id: 1,
    slug: "project-alpha",
    title: "Modern Kitchen Design",
    images: ["https://picsum.photos/seed/p1/1200/800"],
    category: "Interior Design",
  },
  {
    id: 2,
    slug: "project-beta",
    title: "Corporate Branding",
    images: ["https://picsum.photos/seed/p2/1200/800"],
    category: "Branding",
  },
  {
    id: 3,
    slug: "project-gamma",
    title: "E-commerce Platform",
    images: ["https://picsum.photos/seed/p3/1200/800"],
    category: "Web Development",
  },
  {
    id: 4,
    slug: "project-delta",
    title: "Mobile Banking App",
    images: ["https://picsum.photos/seed/p4/1200/800"],
    category: "UI/UX Design",
  },
  {
    id: 5,
    slug: "project-epsilon",
    title: "Architectural Visualization",
    images: ["https://picsum.photos/seed/p5/1200/800"],
    category: "3D Modeling",
  },
  {
    id: 6,
    slug: "project-zeta",
    title: "Luxury Villa Exterior",
    images: ["https://picsum.photos/seed/p6/1200/800"],
    category: "Architecture",
  },
];

// Farsi (Persian) Data
const portfolioItems_fa = [
  {
    id: 1,
    slug: "project-alpha",
    title: "طراحی آشپزخانه مدرن",
    images: ["https://picsum.photos/seed/p1/1200/800"],
    category: "طراحی داخلی",
  },
  {
    id: 2,
    slug: "project-beta",
    title: "برندسازی شرکتی",
    images: ["https://picsum.photos/seed/p2/1200/800"],
    category: "برندسازی",
  },
  {
    id: 3,
    slug: "project-gamma",
    title: "پلتفرم تجارت الکترونیک",
    images: ["https://picsum.photos/seed/p3/1200/800"],
    category: "توسعه وب",
  },
  {
    id: 4,
    slug: "project-delta",
    title: "اپلیکیشن بانکداری موبایل",
    images: ["https://picsum.photos/seed/p4/1200/800"],
    category: "طراحی UI/UX",
  },
  {
    id: 5,
    slug: "project-epsilon",
    title: "تجسم معماری",
    images: ["https://picsum.photos/seed/p5/1200/800"],
    category: "مدل‌سازی سه‌بعدی",
  },
  {
    id: 6,
    slug: "project-zeta",
    title: "نمای خارجی ویلای لوکس",
    images: ["https://picsum.photos/seed/p6/1200/800"],
    category: "معماری",
  },
];

// --- New Category Structures ---
const categories_en = [
  { name: "All" },
  {
    name: "Design",
    subCategories: [
      { name: "Interior Design" },
      { name: "Branding" },
      { name: "UI/UX Design" },
    ],
  },
  {
    name: "Technology",
    subCategories: [{ name: "Web Development" }, { name: "3D Modeling" }],
  },
  { name: "Architecture" },
];

const categories_fa = [
  { name: "همه" },
  {
    name: "طراحی",
    subCategories: [
      { name: "طراحی داخلی" },
      { name: "برندسازی" },
      { name: "طراحی UI/UX" },
    ],
  },
  {
    name: "تکنولوژی",
    subCategories: [{ name: "توسعه وب" }, { name: "مدل‌سازی سه‌بعدی" }],
  },
  { name: "معماری" },
];

const Portfolio = ({ windowSize }) => {
  const lng = useSelector((state) => state.localeStore.lng);

  const { t, i18n } = useTranslation();
  const [activeFilter, setActiveFilter] = useState("All");
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [portfolioData, setPortfolioData] = useState(null);

  const { currentPortfolioItems, categories, allCategoryString } =
    useMemo(() => {
      const isFa = i18n.language === "fa";
      return {
        currentPortfolioItems: isFa ? portfolioItems_fa : portfolioItems,
        categories: isFa ? categories_fa : categories_en,
        allCategoryString: isFa ? "همه" : "All",
      };
    }, [i18n.language]);

  useEffect(() => {
    setActiveFilter(allCategoryString);
  }, [allCategoryString]);

  // Lock body scroll when mobile sidebar is open
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
      return currentPortfolioItems;
    }

    const parentCategory = categories.find(
      (cat) => cat.name === activeFilter && cat.subCategories
    );

    if (parentCategory) {
      const subCategoryNames = parentCategory.subCategories.map(
        (sub) => sub.name
      );
      return currentPortfolioItems.filter((item) =>
        subCategoryNames.includes(item.category)
      );
    }

    return currentPortfolioItems.filter(
      (item) => item.category === activeFilter
    );
  }, [activeFilter, currentPortfolioItems, allCategoryString, categories]);

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    setIsMobileSidebarOpen(false);
  };

  const handleGetPortfolios = async () => {
    try {
      const { response, result } = await getPorlfolios();
      setPortfolioData(result.data);
      console.log(response, result);
    } catch (error) {
      console.log(error);
    }
    // const {response, result} = await getPorlfolioCategories()
  };

  handleGetPortfolios();

  return (
    <section className={classes.main}>
      <BannerCarousel />
      <Header windowSize={windowSize} />
      <Body>
        <Card className={classes.break}>
          <Breadcrumbs
            linkDataProp={[
              { pathname: t("home"), url: "/" },
              { pathname: t("portfolio") },
            ]}
          />
          <div className={classes.portfolioContainer}>
            <div className={classes.contentWrapper}>
              {/* --- Sticky Sidebar for Desktop --- */}
              <div className={classes.sidebarWrapper}>
                <PortfolioSidebar
                  categories={categories}
                  activeFilter={activeFilter}
                  onFilterChange={setActiveFilter}
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
                  {filteredItems.map((item) => (
                    <Link
                      to={`/${lng}/portfolio/${item.id}`}
                      key={item.id}
                      className={classes.portfolioCard}
                    >
                      <img
                        src={item.images[0]}
                        alt={item.title}
                        className={classes.cardImage}
                      />
                      <div className={classes.cardOverlay}>
                        <h3 className={classes.cardTitle}>{item.title}</h3>
                      </div>
                    </Link>
                  ))}
                </div>
              </main>
            </div>
          </div>
        </Card>
      </Body>
      <Footer windowSize={windowSize} />

      {/* --- Mobile Sidebar --- */}
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
            <h2>{t("filters", "Filters")}</h2>
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
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Portfolio;
