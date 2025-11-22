import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import BannerCarousel from "../../components/BannerCarousel";
import Header from "../../layout/Header";
import Footer from "../../layout/Footer";
import Body from "../../components/filters_page/Body";
import Card from "../../components/filters_page/Card";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import classes from "./Zarinpal.module.css";
import { useLocation } from "react-router-dom";
import { sendPaymentRedirectStatus } from "../../services/api";
import { useSelector } from "react-redux";

const Zarinpal = ({ windowSize }) => {
  const { t } = useTranslation();

  const location = useLocation();

  const token = useSelector((state) => state.userStore.token);

  const getAllParams = () => {
    const queryParams = new URLSearchParams(location.search);

    const paramsObj = {};
    for (let [key, value] of queryParams.entries()) {
      paramsObj[key] = value;
    }

    return paramsObj;
  };

  console.log(getAllParams());

  useEffect(() => {
    const allParmas = getAllParams();

    const getData = async () => {
      const { response, result } = await sendPaymentRedirectStatus(
        token,
        allParmas.gateway_name,
        allParmas
      );
      console.log(result);
    };

    getData();
  }, []);

  return (
    <section className={classes.main}>
      <BannerCarousel />
      <Header windowSize={windowSize} />
      <Body>
        <Card className={classes.card}>
          <div className={classes.content}>
            <LoadingSpinner size="60px" />
            <h2 className={classes.title}>{t("zarinpal_wait")}</h2>
            <p className={classes.subtitle}>{t("zarinpal_warning")}</p>
          </div>
        </Card>
      </Body>
      <Footer windowSize={windowSize} />
    </section>
  );
};

export default Zarinpal;
