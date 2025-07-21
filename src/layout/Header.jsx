import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search as MUISearch, Menu } from "@mui/icons-material";
import {
  Badge,
  Box,
  Drawer as MuiDrawer,
  IconButton,
  Input,
  Tooltip,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { Skeleton } from "@mui/material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { nanoid } from "@reduxjs/toolkit";

import close from "../assets/svg/close.svg";

import {
  accesModalActions,
  cartActions,
  drawerActions,
  favoriteActions,
  walletActions,
} from "../store/store";

import CustomSection from "./CustomSection";
import Search from "../components/Search";
import MobileDrawerList from "../components/MobileDrawerList";
import ChangeLanguage from "../utils/ChangeLanguage";
import Body from "../components/filters_page/Body";
import Card from "../components/filters_page/Card";

import {
  useBasicInformation,
  getHeaderMenus,
  getShoppingCart,
  getAllFavorites,
} from "../services/api";

import { ReactComponent as Heart } from "../assets/svg/heart_white.svg";
import { ReactComponent as Basket } from "../assets/svg/basket_white.svg";
import { ReactComponent as Heart_black } from "../assets/svg/heart.svg";
import { ReactComponent as Basket_black } from "../assets/svg/basket.svg";
import { ReactComponent as Signin } from "../assets/svg/signin.svg";
import { ReactComponent as Signin_White } from "../assets/svg/signin_white.svg";

import AccessAccount from "./AccessAccount";
import LoginButton from "../components/header/LoginButton";

import classes from "./Header.module.css";
const Header = ({ windowSize }) => {
  const lng = useSelector((state) => state.localeStore.lng);
  const { data: basicInformation } = useBasicInformation(lng);

  const [scrollY, setScrollY] = useState(0);
  const [size, setSize] = useState("");
  const [isSmall, setIsSmall] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isFixed, setIsFixed] = useState(true);
  const [headerData, setHeaderData] = useState(null);
  const [logo, setLogo] = useState(null);
  const [isHomePage, setIsHomePage] = useState(true);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const test = [1, 2, 3, 4, 5, 6, 7];

  const cart = useSelector((state) => state.cartStore);
  const token = useSelector((state) => state.userStore.token);
  const modalOpen = useSelector((state) => state.accessModalStore.modalOpen);
  const favoritsCount = useSelector((state) => state.favoriteStore.count);

  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

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
    setIsFixed(location.pathname.split("/").length <= 2 ? true : false);
  }, [windowSize, location.pathname]);

  const initialLogoState = {
    y: 0,
    x: 0,
  };

  const returnButtonStyles = () => {
    let style = {};

    if (size === "xs" || size === "s" || size === "m") {
      setIsSmall(true);
      style = {
        opacity: scrollY === 0 ? "0" : 1,
      };
    } else {
      setIsSmall(false);
      style = {
        alignItems: scrollY === 0 ? "flex-end" : "flex-end",
      };
    }

    return style;
  };

  const returnLogoStyles = () => {
    if (size === "xs") {
      setIsSmall(true);
      return {
        left: scrollY === 0 ? "50%" : "50%",
      };
    } else if (size === "s") {
      setIsSmall(true);
      return {
        left: scrollY === 0 ? "50%" : "50%",
      };
    } else if (size === "m") {
      return {
        left: scrollY === 0 ? "50%" : "50%",
      };
    } else if (size === "l") {
      return {
        left: scrollY === 0 ? "50%" : "50%",
      };
    } else {
      setIsSmall(false);
      return {
        left: scrollY === 0 ? "50%" : "50%",
      };
    }
  };

  const closeDrawer = (v) => {
    setDrawerOpen(v);
  };

  const handleOpenCart = () => {
    dispatch(drawerActions.open());
  };

  const handleOpenModal = () => {
    dispatch(accesModalActions.login());
  };

  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  useEffect(() => {
    if (location.pathname === `/${lng}`) {
      setIsHomePage(true);
    } else {
      setIsHomePage(false);
    }
  }, [location.pathname]);

  useEffect(() => {
    if (isHomePage && basicInformation && basicInformation !== undefined) {
      setLogo(basicInformation?.data.at(0)?.image);
    } else {
      setLogo(basicInformation?.data.at(0)?.image_white);
    }
  }, [basicInformation, isHomePage]);

  const handleGetShoppingCart = async (token) => {
    try {
      const serverRes = await getShoppingCart(token);

      if (serverRes.response.ok) {
        dispatch(cartActions.set(serverRes.result.cart));
        dispatch(walletActions.setBalance(serverRes.result.wallet_balance));
      }
    } catch (error) {}
  };

  const getFavoriteItems = async (token) => {
    const serverRes = await getAllFavorites(token);
    if (serverRes.response.ok) {
      dispatch(favoriteActions.setFetchedProducts(serverRes.result.wishlist));
      dispatch(favoriteActions.setCount(serverRes.result.wishlist.length));
    }
  };

  useEffect(() => {
    if (!token) {
      dispatch(cartActions.set([]));
      dispatch(favoriteActions.setFetchedProducts([]));
    }
    if (token) {
      handleGetShoppingCart(token);
      getFavoriteItems(token);
    }
  }, [token]);

  // API calls
  const getHeaderLinks = async () => {
    setHeaderData(null);
    const serverRes = await getHeaderMenus(lng);

    if (serverRes.response.ok) {
      setHeaderData(serverRes.result);
    }
  };

  useEffect(() => {
    getHeaderLinks();
  }, [lng]);

  const handleCloseModal = () => {
    dispatch(accesModalActions.close());
  };

  const handleOpenFavoritesDrawer = () => {
    dispatch(drawerActions.favoritesOpen());
  };

  return (
    <motion.header
      className={classes.main}
      initial={{ y: 0, height: "5rem" }}
      animate={{
        y: isHomePage && scrollY === 0 ? (isSmall ? "20px" : "50px") : 0,
        height:
          scrollY !== 0
            ? isSmall
              ? "4rem"
              : "5.5rem"
            : isSmall
            ? "4rem"
            : "5rem",
        backgroundColor:
          scrollY !== 0 ? "rgba(255,255,255,0.6)" : "rgba(0, 0, 0, 0)",
        backdropFilter: scrollY !== 0 ? "blur(20px)" : "blur(0px)",
      }}
      style={{ position: isFixed ? "fixed" : "sticky" }}
      transition={{
        type: "spring",
        duration: 0.3,
        ease: "linear",
      }}
    >
      <CustomSection
        className={classes.content}
        card={`${classes.card} ${
          isHomePage ? classes.transparent : classes.black
        }`}
      >
        <motion.span
          className={classes.card_action_wrapper}
          transition={{ duration: 0 }}
        >
          {}
          {!isSmall && (
            <>
              {token ? (
                <span className={classes.icon_pack_wrapper}>
                  <LoginButton />
                </span>
              ) : (
                <>
                  <IconButton
                    className={classes.login_btn}
                    onClick={handleOpenModal}
                  >
                    <Tooltip title={t("login")} placement="top" arrow>
                      {isHomePage ? (
                        <Signin width={30} height={30} />
                      ) : (
                        <Signin_White width={30} height={30} />
                      )}
                    </Tooltip>
                  </IconButton>
                </>
              )}
            </>
          )}

          {!isSmall && (
            <>
              {token && (
                <span className={classes.icon_pack_wrapper}>
                  <Tooltip title={t("profile.favorites")} placement="top" arrow>
                    <IconButton onClick={handleOpenFavoritesDrawer}>
                      <Badge
                        badgeContent={favoritsCount}
                        anchorOrigin={{
                          vertical: "bottom",
                          horizontal: "right",
                        }}
                      >
                        {isHomePage ? (
                          <Heart_black
                            width={isSmall ? "0px" : "28px"}
                            height={isSmall ? "0px" : "28px"}
                          />
                        ) : (
                          <Heart
                            width={isSmall ? "0px" : "28px"}
                            height={isSmall ? "0px" : "28px"}
                          />
                        )}
                      </Badge>
                    </IconButton>
                  </Tooltip>
                </span>
              )}
              <span className={classes.icon_pack_wrapper}>
                <IconButton onClick={handleOpenCart}>
                  <Badge
                    badgeContent={
                      token ? cart?.products.length : cart?.temporaryCart.length
                    }
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  >
                    <Tooltip title={t("profile.basket")} placement="top" arrow>
                      {isHomePage ? (
                        <Basket_black
                          width={isSmall ? "0px" : "30px"}
                          height={isSmall ? "0px" : "30px"}
                        />
                      ) : (
                        <Basket
                          width={isSmall ? "0px" : "30px"}
                          height={isSmall ? "0px" : "30px"}
                        />
                      )}
                    </Tooltip>
                  </Badge>
                </IconButton>
              </span>
            </>
          )}
          {!isSmall && (
            <span className={classes.icon_pack_wrapper}>
              <ChangeLanguage
                className={classes.card_icons}
                ishomepage={isHomePage}
              />
            </span>
          )}
        </motion.span>
        <motion.a
          className={classes.logo_container}
          initial={initialLogoState}
          animate={returnLogoStyles}
          transition={{ duration: 0.1, type: "tween" }}
          href={`/${lng}`}
        >
          {logo && (
            <motion.img
              className={classes.logo_img}
              src={logo}
              alt="Seranoco Logo"
              initial={{ opacity: 0 }}
              animate={{ opacity: logo ? 1 : 1 }}
            />
          )}
        </motion.a>
        <motion.span
          className={classes.navigation_container}
          initial={{ alignItems: "center" }}
          animate={returnButtonStyles}
        >
          {/* Header buttons  */}
          {headerData
            ? headerData.map((elem, i) => {
                let isFullUrl;
                if (elem.url) {
                  isFullUrl = elem.url.charAt(0) === "/" ? false : true;
                } else {
                  isFullUrl = null;
                }

                return (
                  <div className={classes.header_btn_wrapper} key={nanoid()}>
                    {elem.url ? (
                      <Link
                        className={classes.header_btn}
                        style={{ color: isHomePage ? "#000000" : "#ffffff" }}
                        target={"_blank"}
                        href={elem.url}
                        to={elem.url}
                        key={nanoid()}
                      >
                        {elem.label}
                      </Link>
                    ) : (
                      <>
                        <motion.div
                          className={classes.header_btn}
                          id="basic-button"
                          style={{ color: isHomePage ? "#000000" : "#ffffff" }}
                        >
                          {elem.label}
                        </motion.div>
                        {/* Mega menu paper */}
                        {elem.children && (
                          <motion.div className={classes.mega_paper}>
                            <Body parentClass={classes.body}>
                              <Card className={classes.mega_card}>
                                <div className={classes.sub_menu_wrapper}>
                                  <div className={classes.link_part}>
                                    {elem.children.map((el, i) => {
                                      const id = nanoid();
                                      return (
                                        <div
                                          key={el.id}
                                          className={classes.header_sub}
                                        >
                                          <input
                                            type="radio"
                                            name="mega-menu"
                                            id={id}
                                            className={classes.label_radio}
                                            defaultChecked={i === 0}
                                          />
                                          {el.url ? (
                                            <Link
                                              className={classes.mega_title}
                                              to={el.url}
                                              target="_blank"
                                            >
                                              {el.label}
                                            </Link>
                                          ) : (
                                            <label
                                              className={classes.mega_title}
                                              id={id}
                                              htmlFor={id}
                                            >
                                              {el.label}
                                            </label>
                                          )}

                                          <div
                                            className={
                                              classes.link_menu_wrapper
                                            }
                                          >
                                            <div
                                              className={
                                                classes.link_sub_wrapper
                                              }
                                            >
                                              {el.children &&
                                                el.children.map((elc) => {
                                                  return (
                                                    <div
                                                      className={
                                                        classes.menu_item
                                                      }
                                                      key={elc.id}
                                                    >
                                                      {elc.label}
                                                    </div>
                                                  );
                                                })}
                                            </div>
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                  {elem.image && elem.image !== "" && (
                                    <div className={classes.mega_img_primary}>
                                      <img src={elem.image} alt="" />
                                    </div>
                                  )}
                                </div>
                              </Card>
                            </Body>
                          </motion.div>
                        )}
                      </>
                    )}
                  </div>
                );
              })
            : test.map((_, i) => {
                return (
                  <Skeleton
                    className={classes.header_btn_skeleton}
                    variant="text"
                    key={nanoid()}
                  />
                );
              })}
        </motion.span>
        <motion.span
          className={`${classes.search_container}`}
          transition={{ type: "spring", damping: 100, stiffness: 1000 }}
        >
          {isSmall ? (
            <div className={classes.mobile_actions_wrapper}>
              <ChangeLanguage width={30} height={30} ishomepage={isHomePage} />
              <IconButton onClick={() => closeDrawer(true)}>
                <Menu
                  className={classes.card_icons}
                  sx={{
                    width: "25px",
                    height: "25px",
                    color: isHomePage
                      ? "#000000 !important"
                      : "#ffffff !important",
                  }}
                />
              </IconButton>
              <MuiDrawer
                anchor={lng === "fa" ? "right" : "left"}
                dir={lng === "fa" ? "rtl" : "ltr"}
                open={drawerOpen}
                onClose={() => closeDrawer(false)}
                sx={{
                  "& .MuiDrawer-paper": {
                    ...(lng === "fa" && {
                      right: 0,
                    }),
                    ...(lng !== "fa" && {
                      left: 0,
                      transform: drawerOpen
                        ? "translateX(0)"
                        : "translateX(-100%)",
                    }),
                    width: "300px",
                    height: "100%",
                    transition:
                      "transform 225ms cubic-bezier(0, 0, 0.2, 1) 0ms",
                  },
                }}
              >
                <Box
                  sx={{
                    width: "100%",
                    height: "100%",
                  }}
                >
                  <div className={classes.drawer_content}>
                    <button
                      className={classes.drawer_close}
                      onClick={() => closeDrawer(false)}
                      style={{
                        [lng === "fa" ? "left" : "right"]: "10px",
                      }}
                    >
                      <img
                        className={classes.drawer_close_img}
                        src={close}
                        alt=""
                      />
                    </button>
                    <Search isHomePage={true} isMobile={true} />
                    <br />
                    <MobileDrawerList />
                  </div>
                </Box>
              </MuiDrawer>
            </div>
          ) : (
            <Search isHomePage={isHomePage} />
          )}
        </motion.span>
      </CustomSection>
      <AccessAccount open={modalOpen} onClose={handleCloseModal} />
    </motion.header>
  );
};

export default Header;
