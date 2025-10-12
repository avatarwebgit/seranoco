import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import Wrapper from "./Wrapper";

import classes from "./Favorites.module.css";
import Body from "../filters_page/Body";
import Card from "../filters_page/Card";
import { useSelector } from "react-redux";
import Product from "../new/Product";
import { Autocomplete, TextField } from "@mui/material";
import { getAllFavorites, useUser } from "../../services/api";
const Favorites = () => {
  const inputStyles = {
    mb: "0.5rem",
    width: "30%",
    "& .MuiInputBase-root": {
      "& fieldset": {
        borderColor: "black",
      },
    },
    "& .MuiInputBase-input": {
      color: "rgb(0, 0, 0)",
      fontSize: "13px",
    },
    "& .MuiInputLabel-root": {
      color: "gray",
      fontSize: "10px",
    },
    "& .Mui-focused .MuiInputLabel-root": {
      color: "black",
      transform: "translate(0, -5px) scale(0.75)",
    },
    "& .Mui-focused .MuiInputBase-root": {
      "& fieldset": {
        borderColor: "black",
      },
    },
  };

  const { t } = useTranslation();
  const lng = useSelector((state) => state.localeStore.locale);
  const token = useSelector((state) => state.userStore.token);

  const { data: user } = useUser(token);

  useEffect(() => {
    console.log(user);
  }, [user]);

  const [favorites, setFavorites] = useState(null);

  const sorts = [
    { id: 1, label: t("profile.sbsi") },
    { id: 2, label: t("profile.sbsd") },
    { id: 3, label: t("profile.sbpi") },
    { id: 4, label: t("profile.sbpi") },
  ];
  const [sortOrder, setSortOrder] = useState("");
  const [sortedData, setSortedData] = useState([]);

  const filterByPrice = () => {
    if (sortOrder.id === 1) {
      const sorted = [...favorites].sort((a, b) => a.size - b.size);
      setSortedData(sorted);
    } else if (sortOrder.id === 2) {
      const sorted = [...favorites].sort((a, b) => b.size - a.size);
      setSortedData(sorted);
    } else if (sortOrder.id === 3) {
      const sorted = [...favorites].sort((a, b) => b.price - a.price);
      setSortedData(sorted);
    } else if (sortOrder.id === 4) {
      const sorted = [...favorites].sort((a, b) => b.price - a.price);
      setSortedData(sorted);
    } else {
      setSortedData(favorites);
    }
  };

  useEffect(() => {
    filterByPrice();
  }, [sortOrder]);

  const getFavoriteItems = async () => {
    const serverRes = await getAllFavorites(token);
    if (serverRes.response.ok) {
      setFavorites(serverRes.result.wishlist);
    }
  };

  useEffect(() => {
    if (token) {
      getFavoriteItems();
    }
  }, [token]);

  return (
    <section>
      <Body>
        <Card className={classes.main}>
          <h3
            className={classes.title}
            style={{ direction: lng === "fa" ? "rtl" : "ltr" }}
          >
            {t("profile.favorites")}
          </h3>
          <Wrapper>
            <div className={classes.actions_wrapper}>
              {/* <Autocomplete
                id='country-autocomplete'
                disablePortal
                size='small'
                sx={inputStyles}
                value={sortOrder}
                options={sorts || []}
                renderInput={params => (
                  <TextField
                    {...params}
                    label={t('profile.sort')}
                    name='country'
                  />
                )}
                onInputChange={(e, value) => {
                  setSortOrder(value);
                }}
                onChange={(e, newValue) => {
                  setSortOrder(newValue);
                }}
              /> */}
            </div>
            <div className={classes.item_wrapper}>
              {favorites ? (
                favorites.map((el) => {
                  return (
                    <Product
                      newItem={false}
                      dataProps={{ product: el }}
                      action={getFavoriteItems}
                    />
                  );
                })
              ) : (
                <div className={classes.no_item}>{t("noItem")}</div>
              )}
            </div>
          </Wrapper>
        </Card>
      </Body>
    </section>
  );
};

export default Favorites;
