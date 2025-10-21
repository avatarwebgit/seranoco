import React, { useEffect, useState } from "react";
import { Menu } from "antd";

import classes from "./MobileDrawerList.module.css";
import { getHeaderMenus, useHeaderMenus } from "../services/api";
import { useSelector, useDispatch } from "react-redux";

import { userActions } from "../store/store";
import { useTranslation } from "react-i18next";
import { Logout } from "@mui/icons-material";
import { Link } from "react-router-dom";

const MobileDrawerList = () => {
  const lng = useSelector((state) => state.localeStore.lng);
  const { data } = useHeaderMenus(lng);

  const [current, setCurrent] = useState("mail");
  const [items, setItems] = useState(null);
  const [struc, setStruc] = useState(null);

  const dispatch = useDispatch();

  const token = useSelector((state) => state.userStore.token);

  const { t } = useTranslation();

  const handleLogOut = () => {
    dispatch(userActions.reset());
  };

  useEffect(() => {
    let updatedItems = [];
    if (data) {
      data.map((el) => {
        if (el.children) {
          const children = [];
          el.children.map((child) => {
            if (child.url) {
              children.push({
                label: <Link to={child.url}>{child.label}</Link>,
                key: child.key,
              });
            } else if (child.alias) {
              children.push({
                label: (
                  <Link to={`/${lng}/page/${child.alias}`}>{child.label}</Link>
                ),
                key: child.key,
              });
            } else {
              children.push({
                label: child.label,
                key: child.key,
              });
            }
          });
          updatedItems.push({ label: el.label, key: el.key, children });
        } else {
          // Handle menu items without children
          if (el.url) {
            updatedItems.push({
              label: <Link to={el.url}>{el.label}</Link>,
              key: el.key,
            });
          } else if (el.alias) {
            updatedItems.push({
              label: <Link to={`/${lng}/page/${el.alias}`}>{el.label}</Link>,
              key: el.key,
            });
          } else {
            updatedItems.push({
              label: el.label,
              key: el.key,
            });
          }
        }
      });
    }

    if (token) {
      updatedItems.push({
        key: "logout",
        id: "logout",
        label: <div onClick={handleLogOut}>{t("logout")}</div>,
        icon: <Logout />,
      });
    }

    setItems(updatedItems);
  }, [data, token]);

  const onClick = (e) => {
    setCurrent(e.key);
  };

  return (
    <>
      {items && (
        <Menu
          onClick={onClick}
          selectedKeys={[current]}
          mode="inline"
          items={items}
          className={`${classes.main} ${
            lng === "fa" ? classes.rtl : classes.ltr
          }`}
        />
      )}
    </>
  );
};

export default MobileDrawerList;
