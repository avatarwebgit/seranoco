import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import search from "../assets/svg/search.svg";
import classes from "./Search.module.css";

const Search = () => {
  const [isFullSize, setIsFullSize] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const handleMouseEnter = () => {
    setIsFullSize(true);
  };

  const handleMouseLeave = () => {
    if (!isFocused) {
      setIsFullSize(false);
    } else {
      setIsFullSize(true)
    }
  };

  const handleFocus = () => {
    // setIsFullSize(true);
    setIsFocused(true);
  };

  const handleBlur = () => {
    // setIsFullSize(false);
    setIsFocused(true);
  };

  const initial = {
    width: 0,
  };

  return (
    <motion.div
      className={classes.main}
      initial={initial}
      animate={{ width: isFullSize ? "100%" : 0 }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      transition={{ duration: 0.25, type: "tween" }}
    >
      <motion.input
        className={classes.search_input}
        type="text"
        placeholder={isFullSize ? "Search..." : ""}
        onFocus={handleFocus}
        onBlur={handleMouseLeave}
        whileHover={handleMouseEnter}
        style={{ backgroundColor: isFullSize ? "white" : "transparent" }}
        transition={{ duration: 0.25, type: "tween" }}
      />
      <motion.div
        className={classes.search_logo_wrapper}
        initial={{ border: "1px solid transparent" }}
        animate={{
          border: !isFullSize ? "1px solid black" : "1px solid transparent",
        }}
      >
        <motion.img
          className={classes.search_logo}
          src={search}
          alt="search logo"
          initial={{ width: "40%", height: "40%" }}
          animate={{
            width: isFullSize ? "50%" : "40%",
            height: isFullSize ? "50%" : "40%",
          }}
          transition={{ duration: 0.25, type: "tween" }}
        />
      </motion.div>
    </motion.div>
  );
};

export default Search;
