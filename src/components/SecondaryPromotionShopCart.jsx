import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

import { useAllPromotions } from "../services/api";

import Body from "./filters_page/Body";
import Card from "./filters_page/Card";

import classes from "./SecondaryPromotionShopCart.module.css";
import CustomAnimatedBtn from "./common/CustomAnimatedBtn";
const SecondaryPromotionShopCart = () => {
  const [proData, setProData] = useState(null);
  const { data, isLoading } = useAllPromotions();

  const lng = useSelector((state) => state.localeStore.lng);

  useEffect(() => {
    if (data) {
      setProData(data.data);
    }
  }, [data]);

  const { t } = useTranslation();
  return (
    <Body parentClass={classes.body}>
      <Card className={classes.card}>
        {proData &&
          proData.map((el, i) => {
            if (i === 0) return;
            return (
              <section
                className={classes.main}
                style={{ backgroundImage: `url(${el.image})` }}
                key={i}
              >
                <div className={classes.wrapper}>
                  <div className={classes.content}>
                    <span className={classes.shop_hero}>
                      <p className={classes.title}>
                        {lng === "fa" ? el.title_fa : el.title}
                      </p>
                      <p className={classes.caption}>
                        {lng === "fa" ? el.text_fa : el.text}
                      </p>
                      <CustomAnimatedBtn
                        className={classes.shop_btn}
                        variant="outlined"
                        type="light"
                        to={el.link}
                      >
                        {t("more_information")}
                      </CustomAnimatedBtn>
                    </span>
                  </div>
                </div>
              </section>
            );
          })}
      </Card>
    </Body>
  );
};

export default SecondaryPromotionShopCart;
