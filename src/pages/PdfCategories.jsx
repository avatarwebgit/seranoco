import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Skeleton } from "@mui/material";

import Header from "../layout/Header";
import Footer from "../layout/Footer";
import BannerCarousel from "../components/BannerCarousel";
import Body from "../components/filters_page/Body";
import Card from "../components/filters_page/Card";
import Breadcrumbs from "../components/common/Breadcrumbs";
import PdfCategoryCard from "../components/downloads/PdfCategoryCard";

import {
  getDownloadCategoriesById,
  getInitialDownloadCategories,
} from "../services/api";

import classes from "./PdfCategories.module.css";

const PdfCategories = ({ windowSize }) => {
  const { t } = useTranslation();
  const { "*": id } = useParams();

  const lng = useSelector((state) => state.localeStore.lng);

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryName, setCategoryName] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const apiCall = id
          ? getDownloadCategoriesById(id)
          : getInitialDownloadCategories();
        const { response, result } = await apiCall;

        if (response.ok) {
          setCategories(result.data);
          if (id && result.category_name) {
            setCategoryName(
              lng === "fa" ? result.category_name_fa : result.category_name
            );
          }
        }
      } catch (error) {
        console.error("Failed to fetch PDF categories:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, [id, lng]);

  const breadcrumbLinks = [
    { pathname: t("home"), url: "" },
    { pathname: t("titles.information"), url: "downloads/categories" },
  ];

  if (id && categoryName) {
    breadcrumbLinks.push({ pathname: categoryName, url: "" });
  }

  return (
    <section className={classes.main}>
      <BannerCarousel />
      <Header windowSize={windowSize} />
      <Body>
        <Card className={classes.card}>
          <Breadcrumbs linkDataProp={breadcrumbLinks} />
          {loading ? (
            <div className={classes.grid}>
              {Array.from({ length: 8 }).map((_, index) => (
                <Skeleton
                  key={index}
                  variant="rectangular"
                  animation="wave"
                  width={250}
                  height={250}
                  className={classes.skeletonCard}
                />
              ))}
            </div>
          ) : (
            <div className={classes.grid}>
              {categories.map((category) => (
                <PdfCategoryCard key={category.id} category={category} />
              ))}
            </div>
          )}
        </Card>
      </Body>
      <Footer />
    </section>
  );
};

export default PdfCategories;
