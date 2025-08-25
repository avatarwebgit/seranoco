import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Skeleton, Tabs, Tab, Box } from "@mui/material";
import { motion } from "framer-motion";

import Header from "../layout/Header";
import Footer from "../layout/Footer";
import BannerCarousel from "../components/BannerCarousel";
import Body from "../components/filters_page/Body";
import Card from "../components/filters_page/Card";
import Breadcrumbs from "../components/common/Breadcrumbs";
import PdfDownloadItem from "../components/downloads/PdfDownloadItem";
import { getDownloadFiles } from "../services/api";

import classes from "./PdfDownloads.module.css";

const containerVariants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
  },
};

const PdfDownloads = ({ windowSize }) => {
  const { t } = useTranslation();
  const { id } = useParams();
  const lng = useSelector((state) => state.localeStore.lng);

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryName, setCategoryName] = useState("");
  const [activeTab, setActiveTab] = useState(null);

  useEffect(() => {
    const fetchPdfs = async () => {
      setLoading(true);
      try {
        const { response, result } = await getDownloadFiles(id);
        if (response.ok) {
          setData(result.data);
          if (result.data.length > 0) {
            setActiveTab(result.data[0].id);
          }
          setCategoryName(
            lng === "fa" ? result.category_name_fa : result.category_name
          );
        }
      } catch (error) {
        console.error("Failed to fetch PDFs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPdfs();
  }, [id, lng]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const breadcrumbLinks = [
    { pathname: t("home"), url: "" },
    { pathname: t("titles.information"), url: "downloads/categories" },
  ];
  if (categoryName) {
    breadcrumbLinks.push({ pathname: categoryName });
  }

  const activeCategory = data.find((cat) => cat.id === activeTab);

  return (
    <section className={classes.main}>
      <BannerCarousel />
      <Header windowSize={windowSize} />
      <Body>
        <Card className={classes.card}>
          <Breadcrumbs linkDataProp={breadcrumbLinks} />
          {loading ? (
            <Box sx={{ width: "100%", mt: 2 }}>
              <Skeleton variant="rectangular" height={48} />
              <div className={classes.grid}>
                {Array.from({ length: 8 }).map((_, index) => (
                  <Skeleton
                    key={index}
                    variant="rectangular"
                    animation="wave"
                    className={classes.skeletonItem}
                  />
                ))}
              </div>
            </Box>
          ) : (
            <Box sx={{ width: "100%", mt: 2 }}>
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <Tabs
                  value={activeTab}
                  onChange={handleTabChange}
                  aria-label="pdf categories tabs"
                  variant="scrollable"
                  scrollButtons="auto"
                >
                  {data.map((category) => (
                    <Tab
                      label={
                        lng === "fa"
                          ? category.title
                          : category.title_en || category.title
                      }
                      value={category.id}
                      key={category.id}
                    />
                  ))}
                </Tabs>
              </Box>
              <motion.div
                className={classes.grid}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {activeCategory &&
                  activeCategory.files.map((pdfFile) => (
                    <PdfDownloadItem
                      key={pdfFile.id}
                      pdf={{
                        title: pdfFile.title_en || pdfFile.title,
                        title_fa: pdfFile.title,
                        file: pdfFile.link_download,
                      }}
                      variants={itemVariants}
                    />
                  ))}
              </motion.div>
            </Box>
          )}
        </Card>
      </Body>
      <Footer />
    </section>
  );
};

export default PdfDownloads;
