import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Favorite,
  ShoppingBag,
  Menu,
  Search as MUISearch,
  Login,
} from "@mui/icons-material";
import {
  Badge,
  Box,
  Drawer,
  IconButton,
  Input,
  ListItemText,
  MenuItem,
  Menu as BigMenu,
} from "@mui/material";
import { useTranslation } from "react-i18next";

import logo from "../assets/svg/Serano-Logo.svg";
import CustomButton from "../components/CustomButton";
import CustomSection from "./CustomSection";
import Search from "../components/Search";
import MobileDrawerList from "../components/MobileDrawerList";
import ChangeLanguage from "../utils/ChangeLanguage";

import close from "../assets/svg/close.svg";
import { ReactComponent as Heart } from "../assets/svg/heart.svg";
import { ReactComponent as Basket } from "../assets/svg/basket.svg";

import classes from "./Header.module.css";
import { Grid } from "antd";
const Header = ({ windowSize }) => {
  const [scrollY, setScrollY] = useState(0);
  const [size, setSize] = useState("");
  const [isSmall, setIsSmall] = useState(false);
  const [isExtended, setIsExtended] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const test = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

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
        marginTop: !scrollY === 0 ? "0" : "2rem",
      };
    } else {
      setIsSmall(false);
      return {
        alignItems: scrollY === 0 ? "flex-end" : "center",
        marginTop: scrollY === 0 ? "2rem" : "0",
      };
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
        x: scrollY === 0 ? "31vw" : 0,
        y: scrollY === 0 ? "-20px" : 0,
        width: scrollY === 0 ? "25%" : "20%",
      };
    }
  };

  const closeDrawer = (v) => {
    setDrawerOpen(v);
  };

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <motion.header
      className={classes.main}
      initial={{ y: 0, height: "5rem" }}
      animate={{
        y: scrollY !== 0 ? 0 : "6vh",
        height: scrollY !== 0 ? "4rem" : isSmall ? "5rem" : "5rem",
        backgroundColor: scrollY !== 0 ? "rgba(255,255,255,.5)" : "transparent",
        backdropFilter: scrollY !== 0 ? "blur(20px)" : "none",
      }}
    >
      <CustomSection className={classes.content} card={classes.card}>
        <motion.span
          className={classes.card_action_wrapper}
          initial={{ display: "flex", alignItems: "flex-start" }}
          animate={{
            display:
              scrollY === 0
                ? isSmall
                  ? "flex"
                  : "flex"
                : isSmall
                ? "flex"
                : "none",
            alignItems: scrollY === 0 ? "flex-start" : "center",
          }}
          transition={{ duration: 0 }}
        >
          {isSmall ? (
            ""
          ) : (
            <CustomButton className={classes.login_btn}>
              <a href="#">{t("login")}</a>
            </CustomButton>
          )}

          {isSmall && (
            <span className={classes.icon_pack_wrapper}>
              <IconButton>
                <Login sx={{ width: "30px", height: "30px" }} />
              </IconButton>
            </span>
          )}
          <span className={classes.icon_pack_wrapper}>
            <IconButton>
              <Badge
                badgeContent={4}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              >
                <Heart width={25} height={25} />
              </Badge>
            </IconButton>
          </span>
          <span className={classes.icon_pack_wrapper}>
            <IconButton>
              <Badge
                badgeContent={4}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              >
                <Basket width={25} height={25} />
              </Badge>
            </IconButton>
          </span>
          {!isSmall && (
            <span className={classes.icon_pack_wrapper}>
              <ChangeLanguage className={classes.card_icons} />
            </span>
          )}
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
          initial={{ alignItems: "center", marginTop: "0" }}
          animate={returnButtonStyles}
        >
          {test.map((elem, i) => {
            return (
              <div className={classes.header_btn_wrapper}>
                <motion.button
                  className={classes.header_btn}
                  id="basic-button"
                  aria-controls={open ? "basic-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? "true" : undefined}
                  onMouseEnter={(event) => handleClick(event)} // Pass event to handleClick
                  // onMouseLeave={(event) => handleClose(event)} // Pass event to handleClose
                >
                  {t(`header_button_${i + 1}`)}
                </motion.button>
              </div>
            );
          })}
        </motion.span>
        <motion.span
          className={`${classes.search_container}`}
          initial={{ alignItems: "flex-start" }}
          animate={{ alignItems: scrollY === 0 ? "flex-start" : "center" }}
        >
          {isSmall ? (
            <>
              <ChangeLanguage />
              <IconButton onClick={() => closeDrawer(true)}>
                <Menu className={classes.card_icons} />
              </IconButton>
              <Drawer
                anchor={"right"}
                open={drawerOpen}
                onClose={() => closeDrawer(false)}
              >
                <Box
                  sx={{
                    width: "90vw",
                    height: "100%",
                  }}
                >
                  <div className={classes.drawer_content}>
                    <button
                      className={classes.drawer_close}
                      onClick={() => closeDrawer(false)}
                    >
                      <img
                        className={classes.drawer_close_img}
                        src={close}
                        alt=""
                      />
                    </button>
                    <Input
                      className={classes.menu_input}
                      endAdornment={
                        <>
                          <MUISearch />
                        </>
                      }
                    />
                    <MobileDrawerList />
                  </div>
                </Box>
              </Drawer>
            </>
          ) : (
            <Search />
          )}
        </motion.span>
      </CustomSection>
    </motion.header>
  );
};

export default Header;
