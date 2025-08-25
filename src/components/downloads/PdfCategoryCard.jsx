import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import classes from "./PdfCategoryCard.module.css";
import Img from "../common/Img";

const PdfCategoryCard = ({ category }) => {
  const lng = useSelector((state) => state.localeStore.lng);
  const { id, title_en, title, image, hasSub } = category;
console.log(category)
  const destination = hasSub
    ? `/${lng}/downloads/categories/files/${id}`
    : `/${lng}/downloads/categories/${id}`;

  return (
    <Link to={destination} className={classes.card}>
      <div className={classes.imageWrapper}>
        <Img
          src={image}
          alt={lng === "fa" ? title : title_en}
          className={classes.image}
        />
      </div>
      <div className={classes.titleWrapper}>
        <h3 className={classes.title}>{lng === "fa" ? title : title_en}</h3>
      </div>
    </Link>
  );
};

export default PdfCategoryCard;
