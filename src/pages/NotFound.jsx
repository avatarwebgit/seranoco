import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import Header from "../layout/Header";
import Footer from "../layout/Footer";
import Body from "../components/filters_page/Body";
import Card from "../components/filters_page/Card";
import BannerCarousel from "../components/BannerCarousel";
import Breadcrumbs from "../components/common/Breadcrumbs";

import classes from "./NotFound.module.css";

const NotFound = ({ windowSize }) => {
  const { t } = useTranslation();

  return (
    <section className={classes.main}>
      <BannerCarousel />
      <Header windowSize={windowSize} />
      <Body>
        <Card className={classes.contentCard}>
          <div className={classes.container}>
            <div className={classes.errorCodeWrapper}>
              <h1 className={classes.errorCode}>
                4<span className={classes.gemIcon}></span>4
              </h1>
            </div>
            <h2 className={classes.title}>{t("notFoundTitle")}</h2>
            <p className={classes.message}>{t("notFoundMessage")}</p>
            <Link to="/" className={classes.ctaButton}>
              {t("backToHome")}
            </Link>
          </div>
        </Card>
      </Body>
      <Footer windowSize={windowSize} />
    </section>
  );
};

export default NotFound;
