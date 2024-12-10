import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Favorite, ShoppingBag } from "@mui/icons-material";
import { Badge, IconButton } from "@mui/material";
import { useSSR, useTranslation } from "react-i18next";

import logo from "../assets/svg/Serano-Logo.svg";
import CustomButton from "../components/CustomButton";
import CustomSection from "./CustomSection";
import Search from "../components/Search";

import classes from "./Header.module.css";
import ChangeLanguage from "../utils/ChangeLanguage";
const Header = ({ windowSize }) => {
  const [scrollY, setScrollY] = useState(0);
  const [size, setSize] = useState("");
  const [isSmall, setIsSmall] = useState(false);
  const [isExtended, setIsExtended] = useState(false);

  const test = [1, 2, 3, 4, 5, 6, 7];

  const { t } = useTranslation();

  useEffect(() => {
    window.addEventListener("load", () => setScrollY(window.scrollY));
    window.addEventListener("scroll", () => setScrollY(window.scrollY));

    return () => {
      window.removeEventListener("load", () => setScrollY(window.scrollY));
      window.removeEventListener("scroll", () => setScrollY(window.scrollY));
    };
  }, []);

  useEffect(() => {
    setSize(windowSize);
    console.log(windowSize);
  }, [windowSize]);

  const initialLogoState = {
    y: 0,
    x: 0,
  };

  const returnButtonStyles = () => {
    if (size === "xs" || size === "s" || size === "m") {
      setIsSmall(true);
      return {
        opacity: scrollY === 0 ? "0" : "1",
      };
    } else {
      setIsSmall(false);
      return { alignItems: scrollY === 0 ? "flex-end" : "center" };
    }
  };
  const returnLogoStyles = () => {
    if (size === "xs" || size === "s" || size === "m") {
      setIsSmall(true);
      return {
        x: "25vw",
        y: 0,
        width: scrollY === 0 ? "50%" : "50%",
      };
    } else {
      setIsSmall(false);
      return {
        x: scrollY === 0 ? "32vw" : 0,
        y: scrollY === 0 ? "-20px" : 0,
        width: scrollY === 0 ? "25%" : "20%",
      };
    }
  };

  return (
    <motion.header
      className={classes.main}
      initial={{ y: 0, height: "5rem" }}
      animate={{
        y: scrollY !== 0 ? 0 : "6vh",
        height: scrollY !== 0 ? "5rem" : "9rem",
        backgroundColor: scrollY !== 0 ? "rgba(255,255,255,.1)" : "transparent",
        backdropFilter: scrollY !== 0 ? "blur(20px)" : "none",
      }}
    >
      <CustomSection className={classes.content} card={classes.card}>
        <motion.span
          className={classes.card_action_wrapper}
          initial={{ display: "none" }}
          animate={{ display: scrollY === 0 ? "flex" : "none" }}
          transition={{ duration: 0 }}
        >
          {!isSmall && (
            <CustomButton className={classes.login_btn}>
              <a href="#">{t("login")}</a>
            </CustomButton>
          )}
          <span className={classes.icon_pack_wrapper}>
            <IconButton>
              <Badge
                badgeContent={4}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              >
                <Favorite color="action" className={classes.card_icons} />
              </Badge>
            </IconButton>
          </span>
          <span className={classes.icon_pack_wrapper}>
            <IconButton>
              <Badge
                badgeContent={4}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              >
                <ShoppingBag color="action" className={classes.card_icons} />
              </Badge>
            </IconButton>
          </span>
          {<span className={classes.icon_pack_wrapper}>
            <ChangeLanguage className={classes.card_icons} />
          </span>}
        </motion.span>
        <motion.span
          className={classes.logo_container}
          initial={initialLogoState}
          animate={returnLogoStyles}
          transition={{ duration: 0.25, type: "tween" }}
        >
          <img className={classes.logo_img} src={logo} alt="Seranoco Logo" />
        </motion.span>
        <motion.span
          className={classes.navigation_container}
          initial={{ alignItems: "center" }}
          animate={returnButtonStyles}
        >
          {test.map((elem, i) => {
            return (
              <div className={classes.header_btn_wrapper}>
                <button
                  className={classes.header_btn}
                  onClick={() => setIsExtended(!isExtended)}
                >
                  {t(`header_button_${i + 1}`)}
                </button>
                {/* <motion.div
                  className={classes.mega_menu}
                  animate={{ opacity: isExtended ? 1 : 0 }}
                  transition={{ duration: 1 }}
                >
                  d
                </motion.div> */}
              </div>
            );
          })}
        </motion.span>
        <span className={classes.search_container}>
          <Search />
        </span>
      </CustomSection>
    </motion.header>
  );
};

export default Header;
