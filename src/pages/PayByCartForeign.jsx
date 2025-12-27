import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import {
  ContentCopy,
  CheckCircleOutline,
  AccountBalance,
  MailOutline,
  WhatsApp,
} from "@mui/icons-material";
import {
  IconButton,
  Tooltip,
  Typography,
  Box,
  Paper,
  Divider,
} from "@mui/material";

import BannerCarousel from "../components/BannerCarousel";
import Header from "../layout/Header";
import Footer from "../layout/Footer";
import Body from "../components/filters_page/Body";
import Card from "../components/filters_page/Card";
import Breadcrumbs from "../components/common/Breadcrumbs";

import classes from "./PayByCartForeign.module.css";

const PayByCartForeign = ({ windowSize }) => {
  const { t } = useTranslation();
  const lng = useSelector((state) => state.localeStore.lng);
  const [copiedField, setCopiedField] = useState(null);

  const bankInfo = {
    accountName: "SERANO MILANO S.R.L.",
    iban: "IT93C0760101600001073248369",
    bic: "BPPIITRRXXX",
  };

  const handleCopy = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const breadcrumbs = [
    { pathname: t("home"), url: "" },
    { pathname: t("titles.payByCartForeign") },
  ];

  return (
    <section className={classes.main}>
      <BannerCarousel />
      <Header windowSize={windowSize} />
      <Body>
        <Card className={classes.card}>
          <Box sx={{ width: "100%", mb: 1 }}>
            <Breadcrumbs linkDataProp={breadcrumbs} />
          </Box>

          <Paper
            elevation={0}
            className={classes.infoPaper}
            dir={lng === "fa" ? "rtl" : "ltr"}
          >
            <header className={classes.paperHeader}>
              <div className={classes.iconCircle}>
                <AccountBalance
                  sx={{ fontSize: "1.8rem", color: "var(--primary)" }}
                />
              </div>
              <Typography variant="h6" className={classes.instruction}>
                {t("pay_foreign.instruction")}
              </Typography>
            </header>

            <div className={classes.detailsList}>
              <div className={classes.detailItem}>
                <div className={classes.detailLabelWrapper}>
                  <span className={classes.label}>
                    {t("pay_foreign.acc_name")}
                  </span>
                </div>
                <div className={classes.valueWrapper}>
                  <span className={classes.value}>{bankInfo.accountName}</span>
                  <Tooltip
                    title={
                      copiedField === "name"
                        ? t("pay_foreign.copied")
                        : t("pay_foreign.copy")
                    }
                    arrow
                  >
                    <IconButton
                      size="small"
                      onClick={() => handleCopy(bankInfo.accountName, "name")}
                      className={classes.copyBtn}
                    >
                      {copiedField === "name" ? (
                        <CheckCircleOutline
                          sx={{ fontSize: "1rem" }}
                          color="success"
                        />
                      ) : (
                        <ContentCopy sx={{ fontSize: "1rem" }} />
                      )}
                    </IconButton>
                  </Tooltip>
                </div>
              </div>

              <Divider sx={{ my: 0.5, opacity: 0.5 }} />

              <div className={classes.detailItem}>
                <div className={classes.detailLabelWrapper}>
                  <span className={classes.label}>{t("pay_foreign.iban")}</span>
                </div>
                <div className={classes.valueWrapper}>
                  <span className={`${classes.value} ${classes.monospaced}`}>
                    {bankInfo.iban}
                  </span>
                  <Tooltip
                    title={
                      copiedField === "iban"
                        ? t("pay_foreign.copied")
                        : t("pay_foreign.copy")
                    }
                    arrow
                  >
                    <IconButton
                      size="small"
                      onClick={() => handleCopy(bankInfo.iban, "iban")}
                      className={classes.copyBtn}
                    >
                      {copiedField === "iban" ? (
                        <CheckCircleOutline
                          sx={{ fontSize: "1rem" }}
                          color="success"
                        />
                      ) : (
                        <ContentCopy sx={{ fontSize: "1rem" }} />
                      )}
                    </IconButton>
                  </Tooltip>
                </div>
              </div>

              <Divider sx={{ my: 0.5, opacity: 0.5 }} />

              <div className={classes.detailItem}>
                <div className={classes.detailLabelWrapper}>
                  <span className={classes.label}>{t("pay_foreign.bic")}</span>
                </div>
                <div className={classes.valueWrapper}>
                  <span className={`${classes.value} ${classes.monospaced}`}>
                    {bankInfo.bic}
                  </span>
                  <Tooltip
                    title={
                      copiedField === "bic"
                        ? t("pay_foreign.copied")
                        : t("pay_foreign.copy")
                    }
                    arrow
                  >
                    <IconButton
                      size="small"
                      onClick={() => handleCopy(bankInfo.bic, "bic")}
                      className={classes.copyBtn}
                    >
                      {copiedField === "bic" ? (
                        <CheckCircleOutline
                          sx={{ fontSize: "1rem" }}
                          color="success"
                        />
                      ) : (
                        <ContentCopy sx={{ fontSize: "1rem" }} />
                      )}
                    </IconButton>
                  </Tooltip>
                </div>
              </div>
            </div>

            <footer className={classes.paperFooter}>
              <div className={classes.contactGrid}>
                <div className={classes.contactRow}>
                  <MailOutline
                    sx={{ fontSize: "1rem", color: "var(--color-grey-1)" }}
                  />
                  <Typography
                    variant="caption"
                    className={classes.followupText}
                  >
                    seranojewelry@gmail.com
                  </Typography>
                </div>
                <div className={classes.contactRow}>
                  <WhatsApp sx={{ fontSize: "1rem", color: "#25D366" }} />
                  <Typography
                    variant="caption"
                    className={classes.followupText}
                  >
                    +39 392 052 8656
                  </Typography>
                </div>
              </div>
              <Typography variant="body2" className={classes.followupNote}>
                {t("pay_foreign.followup")}
              </Typography>
              <Typography variant="subtitle2" className={classes.thanks}>
                {t("pay_foreign.thanks")}
              </Typography>
            </footer>
          </Paper>
        </Card>
      </Body>
      <Footer windowSize={windowSize} />
    </section>
  );
};

export default PayByCartForeign;
