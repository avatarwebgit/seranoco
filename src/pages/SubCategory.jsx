import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import Guid from "../components/Guid";
import PromotionalShopCard from "../components/PromotionalShopCard";
import Breadcrumbs from "../components/common/Breadcrumbs";
import Body from "../components/filters_page/Body";
import Card from "../components/filters_page/Card";
import Footer from "../layout/Footer";
import Header from "../layout/Header";

import { Skeleton } from "@mui/material";
import { useParams } from "react-router-dom";
import BannerCarousel from "../components/BannerCarousel";
import Link from "../components/Link";
import { getSubCategories } from "../services/api";
import classes from "./SubCategory.module.css";

const SubCategory = ({ windowSize }) => {
  const { id: subCategoryId } = useParams();
  const [subCategories, setSubCategories] = useState(null);
  const { t } = useTranslation();

  const handleGetSubcategories = async (id) => {
    try {
      const response = await getSubCategories(id);
      setSubCategories(response.result.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    document.title = t("categories");
    handleGetSubcategories(subCategoryId);
  }, [subCategoryId]);

  return (
    <section className={classes.main}>
      <BannerCarousel />
      <Header windowSize={windowSize} />
      <main>
        <Body className={classes.body} parentClass={classes.body}>
          <Card className={classes.card}>
            <Breadcrumbs
              linkDataProp={[
                { pathname: t("home"), url: " " },
                { pathname: t("categories"), url: "categories" },
              ]}
            />
          </Card>
          <center>
            <h1>{t("shop_by_type")}</h1>
          </center>
          <Card className={classes.card}>
            <div className={classes.grid}>
              {subCategories
                ? subCategories.map((category, i) => {
                    return (
                      <Link imgUrl={category.image} title={category.name} />
                    );
                  })
                : Array.from({ length: 4 }, (_, i) => {
                    return (
                      <Skeleton
                        variant="rectangular"
                        animation="wave"
                        sx={{ aspectRatio: 1, width: "100%", height: "100%" }}
                      />
                    );
                  })}
            </div>
          </Card>
        </Body>
      </main>
      <PromotionalShopCard />
      <Guid />

      <Footer />
    </section>
  );
};

export default SubCategory;
