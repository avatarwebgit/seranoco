import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Download, PictureAsPdf, CheckCircle } from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";

import classes from "./PdfDownloadItem.module.css";

const PdfDownloadItem = ({ pdf, variants }) => {
  const { t } = useTranslation();
  const lng = useSelector((state) => state.localeStore.lng);
  const { id, title, title_en, link_download } = pdf;

  const [isDownloaded, setIsDownloaded] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const downloadedPdfs =
      JSON.parse(localStorage.getItem("downloadedPdfs")) || [];
    if (downloadedPdfs.includes(id)) {
      setIsDownloaded(true);
    }
  }, [id]);

  const handleDownloadClick = (e) => {
    e.preventDefault();
    if (isAnimating || isDownloaded) return;

    setIsAnimating(true);

    setTimeout(() => {
      const downloadedPdfs =
        JSON.parse(localStorage.getItem("downloadedPdfs")) || [];
      if (!downloadedPdfs.includes(id)) {
        downloadedPdfs.push(id);
        localStorage.setItem("downloadedPdfs", JSON.stringify(downloadedPdfs));
      }
      setIsDownloaded(true);
      setIsAnimating(false);
    }, 100);
  };

  return (
    <motion.div
      className={`${classes.card} ${isDownloaded ? classes.downloaded : ""}`}
      variants={variants}
      whileHover={
        !isDownloaded && !isAnimating
          ? { y: -5, boxShadow: "0 10px 20px rgba(0,0,0,0.08)" }
          : {}
      }
    >
      <div className={classes.iconWrapper}>
        <PictureAsPdf sx={{ fontSize: "3rem", color: "#d32f2f" }} />
      </div>

      <span className={classes.title}>
        {lng === "fa" ? title : title_en || title}
      </span>

      {/* Animation elements */}
      <AnimatePresence>
        {isAnimating && (
          <>
            <motion.div
              className={classes.flyingDoc}
              initial={{ y: -60, opacity: 0, scale: 0.7 }}
              animate={{ y: 45, opacity: 1, scale: 0.4 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ duration: 0.8, ease: "circIn", delay: 0.1 }}
            />
            <motion.div
              className={classes.folderIcon}
              animate={{ rotate: [0, -2, 2, -2, 0] }}
              transition={{
                delay: 1,
                duration: 0.5,
                type: "spring",
                stiffness: 400,
                damping: 10,
              }}
            >
              <div className={classes.folderBack}></div>
              <div className={classes.folderCover}>
                <motion.div
                  className={classes.folderFront}
                  initial={{ rotateX: 0 }}
                  animate={{ rotateX: -140 }}
                  transition={{ delay: 0.6, duration: 0.4, ease: "easeOut" }}
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <a
        href={link_download}
        download
        rel="noopener noreferrer"
        className={`${classes.downloadButton} ${
          isAnimating ? classes.disabled : ""
        }`}
        onClick={handleDownloadClick}
      >
        {isDownloaded ? (
          <CheckCircle sx={{ fontSize: "1rem" }} />
        ) : (
          <Download sx={{ fontSize: "1rem" }} />
        )}
        <span>{isDownloaded ? t("Downloaded") : t("factor.download_pdf")}</span>
      </a>
    </motion.div>
  );
};

export default PdfDownloadItem;
