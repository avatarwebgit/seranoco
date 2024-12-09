import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

import logo from "../assets/svg/Serano-Logo.svg";

import classes from "./Header.module.css";
import Search from "../components/Search";
const Header = () => {
  const [scrollY, setScrollY] = useState(0);
    const [isExtended, setIsExtended] = useState(false);

  const test = [1, 2, 3, 4];

  useEffect(() => {
    window.addEventListener("load", () => setScrollY(window.scrollY));
    window.addEventListener("scroll", () => setScrollY(window.scrollY));

    return () => {
      window.removeEventListener("load", () => setScrollY(window.scrollY));
      window.removeEventListener("scroll", () => setScrollY(window.scrollY));
    };
  }, []);

  useEffect(() => {
    console.log(scrollY);
  }, [scrollY]);

  const initialState = {};

  return (
    <motion.header
      className={classes.main}
      initial={initialState}
      animate={{ y: scrollY !== 0 ? 0 : "6vh", height: scrollY !== 0 ? "5rem" : '15rem' }}
    >
      <div className={classes.content}>
        <span className={classes.card_action_wrapper}></span>
        <span className={classes.logo_container}>
          <img className={classes.logo_img} src={logo} alt="Seranoco Logo" />
        </span>
        <span className={classes.navigation_container}>
          {test.map((elem) => {
            return (
              <div>
                <button
                  className={classes.header_btn}
                  onClick={() => setIsExtended(!isExtended)}
                >
                  header button
                </button>
                <motion.div
                  className={classes.mega_menu}
                  animate={{ opacity: isExtended ? 1 : 0 }}
                  transition={{ duration: 1 }}
                >
                  d
                </motion.div>
              </div>
            );
          })}
        </span>
        <span className={classes.search_container}>
          <Search/>
        </span>
      </div>
    </motion.header>
  );
};

export default Header;
