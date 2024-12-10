import React from "react";
import { Button } from "@mui/material";

import bg from "../assets/images/gems.test.jpeg";
import { useTranslation } from "react-i18next";

import classes from "./PromotionalShopCard.module.css";
const PromotionalShopCard = () => {
  const { t } = useTranslation();
  return (
    <section className={classes.main} style={{ backgroundImage: `url(${bg})` }}>
      <div className={classes.wrapper}>
        <div className={classes.content}>
          <span className={classes.shop_hero}>
            <p className={classes.title}>SWAROVSKI</p>
            <p className={classes.caption}>GemStones Professional</p>
            <Button
              className={classes.shop_btn}
              size="large"
              variant="outlined"
            >
              {t("shop_now")}
            </Button>
          </span>
        </div>
      </div>
    </section>
  );
};

export default PromotionalShopCard;
