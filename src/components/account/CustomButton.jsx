import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";

import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";

import classes from "./CustomButton.module.css";
export const CustomButton = ({ children, onClick, isActive, className }) => {
  const [isHovering, setIsHovering] = useState(false);
  const [active, setActive] = useState(false);

  const lng = useSelector((state) => state.localeStore.lng);

  useEffect(() => {
    if (isActive) {
      setActive(true);
    } else {
      setActive(false);
    }
  }, [isActive]);

  return (
    <div
      className={`${classes.main} ${isActive && classes.active} ${className}`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onClick={onClick}
    >
      <motion.i
        className={classes.icon}
        initial={{ x: lng === "fa" ? 15 : -15 }}
        animate={{ x: isHovering || isActive ? 0 : lng === "fa" ? 15 : -15 }}
      >
        {lng === "fa" ? (
          <ArrowBackIos sx={{ width: "10px", height: "10px" }} />
        ) : (
          <ArrowForwardIos sx={{ width: "10px", height: "10px" }} />
        )}
      </motion.i>
      {children}
    </div>
  );
};
