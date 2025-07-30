import React, { useEffect, useState } from "react";
import Dropdown from "@mui/joy/Dropdown";
import Menu from "@mui/joy/Menu";
import MenuButton from "@mui/joy/MenuButton";
import MenuItem from "@mui/joy/MenuItem";
import { Avatar, IconButton } from "@mui/material";
import classes from "./LoginButton.module.css";
import { AccountCircle, Grading, Logout } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { cartActions, userActions } from "../../store/store";

const LoginButton = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t } = useTranslation();
  const lng = useSelector((state) => state.localeStore.lng);
  const dispatch = useDispatch();

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
    setIsMenuOpen(true);
  };

  const handleMenuClose = () => {
    if (isMenuOpen) {
      setIsMenuOpen(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (isMenuOpen) {
        handleMenuClose();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isMenuOpen]);

  const handleLogout = () => {
    dispatch(userActions.reset());
    dispatch(cartActions.set([]));
    dispatch(cartActions.setTotalPrice(0));
  };

  return (
    <div style={{ marginTop: "8px" }}>
      <Dropdown>
        <MenuButton className={classes.avatar_p} onClick={handleMenuOpen}>
          <Avatar className={classes.avatar} />
        </MenuButton>
        <Menu
          size="sm"
          sx={{ padding: "0", direction: lng === "fa" ? "rtl" : "ltr" }}
          anchorEl={anchorEl}
          open={isMenuOpen}
          onClose={handleMenuClose}
          onMouseLeave={handleMenuClose}
        >
          <MenuItem sx={{ padding: "3px 10px" }} onClick={handleMenuClose}>
            <Link
              to={`/${lng}/myaccount`}
              state={{ activeAccordion: 0, activeButton: 0 }}
              style={{
                display: "flex",
                alignItems: "center",
                color: "#000",
                textDecoration: "none",
                fontSize: ".6rem",
              }}
            >
              <AccountCircle sx={{ fontSize: "20px", marginRight: "8px" }} />
              {t("profile.account")}
            </Link>
          </MenuItem>

          <MenuItem sx={{ padding: "3px 10px" }} onClick={handleMenuClose}>
            <Link
              to={`/${lng}/myaccount`}
              state={{ activeAccordion: 1, activeButton: 0 }}
              style={{
                display: "flex",
                alignItems: "center",
                color: "#000",
                textDecoration: "none",
                fontSize: ".6rem",
              }}
            >
              <Grading sx={{ fontSize: "20px", marginRight: "8px" }} />
              {t("profile.orders")}
            </Link>
          </MenuItem>

          <MenuItem
            sx={{ fontSize: ".6rem", padding: "3px 10px" }}
            onClick={handleLogout}
          >
            <Logout sx={{ fontSize: "20px", marginRight: "8px" }} />
            {t("profile.log_out")}
          </MenuItem>
        </Menu>
      </Dropdown>
    </div>
  );
};

export default LoginButton;
