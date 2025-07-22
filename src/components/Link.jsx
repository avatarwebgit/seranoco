import React from "react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";

import classes from "./Link.module.css";

const Link = ({
  title,
  href,
  imgUrl,
  alt,
  className,
  helper_className,
  hepler_text,
  type = "category",
}) => {
  const lng = useSelector((state) => state.localeStore.lng);

  if (type !== "category") {
    return (
      <motion.a
        className={classes.main}
        initial={{ y: 0, boxShadow: "0px 10px 5px rgb(238, 238, 238)" }}
        whileHover={{
          boxShadow: [
            "0px 10px 5px rgb(238, 238, 238)",
            "0px 10px 8px rgb(209, 209, 209)",
            "0px 10px 5px rgb(224, 224, 224)",
          ],
        }}
        transition={{ type: "tween", duration: 0.5 }}
        href={`/${lng}/${href}`}
        target="_blank"
      >
        <div className={classes.image_wrapper}>
          <img src={imgUrl} alt={alt} />
        </div>
        <div className={classes.caption}>{title}</div>
      </motion.a>
    );
  }

  return (
    <motion.a
      className={classes.main}
      initial={{ y: 0, boxShadow: "0px 10px 5px rgb(238, 238, 238)" }}
      whileHover={{
        boxShadow: [
          "0px 10px 5px rgb(238, 238, 238)",
          "0px 10px 8px rgb(209, 209, 209)",
          "0px 10px 5px rgb(224, 224, 224)",
        ],
      }}
      transition={{ type: "tween", duration: 0.5 }}
      href={`/${lng}/${href}`}
      target="_blank"
    >
      <span className={classes.title}>
        <p>{title}</p>
      </span>
      <span className={`${classes.img_container} ${className}`}>
        {imgUrl && <img className={`${classes.img} `} src={imgUrl} alt={alt} />}
      </span>
      <p className={helper_className}>{hepler_text}</p>
    </motion.a>
  );
};

export default Link;
