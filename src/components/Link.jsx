import React from "react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";

import classes from "./Link.module.css";

const Link = ({ title, href, imgUrl, alt }) => {
  const lng = useSelector((state) => state.localeStore.lng);
  return (
    <motion.div
      className={classes.main}
      initial={{ y: 0 }}
      whileHover={{
        boxShadow: [
          "0px 5px 5px rgb(194, 194, 194)",
          "0px 5px 20px rgb(96, 96, 96)",
          "0px 5px 15px rgb(150, 150, 150)",
        ],
        y: [0, -20, -10],
      }}
      transition={{ type: "tween", duration: 0.3 }}
    >
      <a href={`/${lng}/category`}>
        <span className={classes.title}>
          <p>{title}</p>
        </span>
        <span className={classes.img_container}>
          <img src={imgUrl} alt={alt} />
        </span>
      </a>
    </motion.div>
  );
};

export default Link;
