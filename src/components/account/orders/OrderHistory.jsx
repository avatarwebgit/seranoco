import { IconButton, Modal, Tooltip, Skeleton } from "@mui/material";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { Delete, OpenInNew, ReceiptOutlined } from "@mui/icons-material";

import show from "../../../assets/svg/show.svg";

import { ReactComponent as Close } from "../../../assets/svg/close.svg";
import { notify } from "../../../utils/helperFunctions";

import { getOrderStatusDetail } from "../../../services/api";

import classes from "./OrderHistory.module.css";
const OrderHistory = ({ dataProp, number, deleteOrder }) => {
  const [detailsData, setDetailsData] = useState(null);
  const [totalWieght, setTotalWieght] = useState(0);
  const [data, setData] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const token = useSelector((state) => state.userStore.token);
  const euro = useSelector((state) => state.cartStore.euro);
  const lng = useSelector((state) => state.localeStore.lng);

  const { t } = useTranslation();

  const handleGetdetails = async () => {
    if (data) {
      const serverRes = await getOrderStatusDetail(token, data.id);
      if (serverRes.response.ok) {
        setDetailsData(serverRes.result.orders);
      } else {
        notify(t("trylater"));
      }
    }
  };

  useEffect(() => {
    if (modalOpen) {
      handleGetdetails();
    }
  }, [modalOpen]);

  useEffect(() => {
    if (dataProp) {
      setData(dataProp);
      console.log(dataProp);
    }
  }, [dataProp]);

  useEffect(() => {
    if (detailsData) {
      const weights = detailsData.products
        .map((item) => item.product?.variation?.weight)
        .filter((weight) => weight !== undefined && weight !== null);
      const numericWeights = weights.map((el) => {
        return +el.split(" ").at(0);
      });
      const sumOfWeights = numericWeights.reduce(
        (accumulator, currentValue) => accumulator + currentValue,
        0
      );
      setTotalWieght(sumOfWeights.toFixed(3));
    }
  }, [detailsData]);

  const handleCloseModal = () => {
    setModalOpen(false);
    setDetailsData(null); // Reset data on close
  };

  return (
    <>
      {data && (
        <>
          <Modal
            open={modalOpen}
            onClose={handleCloseModal}
            className={classes.modal}
          >
            <div className={classes.sheet}>
              <IconButton
                className={classes.close_btn}
                disableRipple={true}
                onClick={handleCloseModal}
              >
                <Close width={30} height={30} />
              </IconButton>
              {detailsData ? (
                <>
                  <div
                    className={classes.modal_content}
                    dir={lng === "fa" ? "rtl" : "ltr"}
                  >
                    <div className={classes.content}>
                      <div>
                        <label>{t("signup.fname")}</label>
                        <input
                          type="text"
                          readOnly
                          value={detailsData.address.title}
                        />
                        <label>{t("signup.pnumber")}</label>
                        <input
                          type="text"
                          readOnly
                          value={detailsData.address.cellphone}
                        />
                        <label>{t("signup.city")}</label>
                        <input
                          type="text"
                          readOnly
                          value={detailsData.address.City}
                        />
                        <label>{t("pc.postalcode")}</label>
                        <input
                          type="text"
                          readOnly
                          value={detailsData.address.postal_code}
                        />
                        <label>{t("orders.payment_status")}</label>
                        <input
                          type="text"
                          readOnly
                          value={
                            lng === "fa"
                              ? detailsData.order.payment_status
                              : detailsData.order.payment_status_en
                          }
                        />
                        <label>{t("total_weight")}</label>
                        <input
                          type="text"
                          readOnly
                          value={`${totalWieght} Ct`}
                        />
                      </div>
                      <div>
                        <label>{t("profile.order_status")}</label>
                        <input
                          type="text"
                          readOnly
                          value={
                            lng === "fa"
                              ? detailsData.OrderStatus
                              : detailsData.OrderStatus_en
                          }
                        />
                        {detailsData.order.payment_type === "3" && (
                          <>
                            <label>{t("orders.payment_type")}</label>
                            <input
                              type="text"
                              readOnly
                              value={
                                detailsData.order.payment_method
                                  .short_description
                              }
                            />
                            <label>{t("orders.bank_name")}</label>
                            <input
                              type="text"
                              readOnly
                              value={detailsData.order.bank_name}
                            />
                            <label>{t("orders.doctype")}</label>
                            <input
                              type="text"
                              readOnly
                              value={detailsData.order.doc_type}
                            />
                          </>
                        )}
                        <label>{t("orders.total_amount")}</label>
                        <input
                          type="text"
                          readOnly
                          value={
                            lng !== "fa"
                              ? `${(
                                  Math.round(
                                    +detailsData.order.total_amount * 10
                                  ) / 10
                                ).toFixed(2)} ${t("m_unit")}`
                              : `${detailsData.order.total_amount_fa.toLocaleString(
                                  "fa-IR"
                                )} ${t("m_unit")}`
                          }
                        />
                        <label>{t("orders.total_payment")}</label>
                        <input
                          type="text"
                          readOnly
                          value={
                            lng !== "fa"
                              ? `${(
                                  Math.round(
                                    +detailsData.order.paying_amount * 10
                                  ) / 10
                                ).toFixed(2)} ${t("m_unit")}`
                              : `${detailsData.order.paying_amount_fa.toLocaleString(
                                  "fa-IR"
                                )} ${t("m_unit")}`
                          }
                          dir={lng === "fa" ? "rtl" : "ltr"}
                        />
                      </div>
                    </div>
                    <table className={classes.table}>
                      <thead>
                        <tr className={classes.tr}>
                          <td className={classes.td}>{t("pc.image")}</td>
                          <td className={classes.td}>{t("pc.color")}</td>
                          <td className={classes.td}>{t("pc.size")}</td>
                          <td className={classes.td}>
                            {t("pc.price")}/{t("1_pcs")}
                          </td>
                          <td className={classes.td}>{t("quantity")}</td>
                          <td className={classes.td}>{t("pc.payment")}</td>
                        </tr>
                      </thead>
                      <tbody>
                        {detailsData.products.map((el) => {
                          return (
                            <tr className={classes.tr} key={el.id}>
                              <td className={classes.td}>
                                <div className={classes.img_wrapper}>
                                  <img
                                    src={el.product.primary_image}
                                    alt=""
                                    loading="lazy"
                                  />
                                </div>
                              </td>
                              <td className={classes.td}>
                                {lng === "fa"
                                  ? el.product.color_fa
                                  : el.product.color}
                              </td>
                              <td className={classes.td}>{el.product.size}</td>
                              <td
                                className={classes.td}
                                style={{
                                  direction: lng === "fa" ? "rtl" : "ltr",
                                }}
                              >
                                {lng !== "fa"
                                  ? el.product.sale_price
                                  : (
                                      el.product.sale_price * euro
                                    ).toLocaleString("fa-IR")}
                                &nbsp;{t("m_unit")}
                              </td>
                              <td className={classes.td}>
                                {el.selected_quantity}
                              </td>
                              <td
                                className={classes.td}
                                style={{
                                  direction: lng === "fa" ? "rtl" : "ltr",
                                }}
                              >
                                {lng === "fa"
                                  ? (el.total_price * euro).toLocaleString(
                                      "fa-IR"
                                    )
                                  : +el.total_price.toFixed(2)}
                                &nbsp;{t("m_unit")}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                    {detailsData && (
                      <IconButton
                        className={classes.factor_button}
                        disableRipple
                      >
                        <ReceiptOutlined />
                        <Link
                          to={`/${lng}/factor/${data.id}`}
                          className={classes.factor_link}
                          target="_blank"
                        >
                          {t("orders.get_invoice")}
                        </Link>
                      </IconButton>
                    )}
                  </div>
                </>
              ) : (
                <div
                  className={classes.modal_content}
                  dir={lng === "fa" ? "rtl" : "ltr"}
                >
                  <div className={classes.content}>
                    <div>
                      {[...Array(6)].map((_, i) => (
                        <div key={i} style={{ marginTop: "10px" }}>
                          <Skeleton
                            animation="wave"
                            variant="text"
                            width="40%"
                            sx={{ fontSize: "14px", marginBottom: "4px" }}
                          />
                          <Skeleton
                            animation="wave"
                            variant="rectangular"
                            height={30}
                            sx={{ borderRadius: "4px" }}
                          />
                        </div>
                      ))}
                    </div>
                    <div>
                      {[...Array(5)].map((_, i) => (
                        <div key={i} style={{ marginTop: "10px" }}>
                          <Skeleton
                            animation="wave"
                            variant="text"
                            width="40%"
                            sx={{ fontSize: "14px", marginBottom: "4px" }}
                          />
                          <Skeleton
                            animation="wave"
                            variant="rectangular"
                            height={30}
                            sx={{ borderRadius: "4px" }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                  <table className={classes.table}>
                    <thead>
                      <tr className={classes.tr}>
                        <td className={classes.td}>{t("pc.image")}</td>
                        <td className={classes.td}>{t("pc.color")}</td>
                        <td className={classes.td}>{t("pc.size")}</td>
                        <td className={classes.td}>
                          {t("pc.price")}/{t("1_pcs")}
                        </td>
                        <td className={classes.td}>{t("quantity")}</td>
                        <td className={classes.td}>{t("pc.payment")}</td>
                      </tr>
                    </thead>
                    <tbody>
                      {[...Array(3)].map((_, i) => (
                        <tr className={classes.tr} key={i}>
                          <td className={classes.td}>
                            <div className={classes.img_wrapper}>
                              <Skeleton
                                animation="wave"
                                variant="rectangular"
                                sx={{ width: "100%", height: "100%" }}
                              />
                            </div>
                          </td>
                          <td className={classes.td}>
                            <Skeleton animation="wave" variant="text" />
                          </td>
                          <td className={classes.td}>
                            <Skeleton animation="wave" variant="text" />
                          </td>
                          <td className={classes.td}>
                            <Skeleton animation="wave" variant="text" />
                          </td>
                          <td className={classes.td}>
                            <Skeleton animation="wave" variant="text" />
                          </td>
                          <td className={classes.td}>
                            <Skeleton animation="wave" variant="text" />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <Skeleton
                    animation="wave"
                    variant="rectangular"
                    width={180}
                    height={40}
                    sx={{
                      borderRadius: "4px",
                      alignSelf: "flex-end",
                      marginTop: "20px",
                    }}
                  />
                </div>
              )}
            </div>
          </Modal>
          <tr className={classes.tr}>
            <td className={classes.td}>{number + 1}</td>
            <td className={classes.td}>{data.order_number}</td>
            <td className={classes.td}>
              {lng === "fa" ? data.OrderStatus : data.OrderStatus_en}
            </td>
            <td className={classes.td}>
              <img
                className={classes.img}
                src={show}
                alt=""
                onClick={() => setModalOpen(true)}
              />
            </td>
            <td className={classes.td}>
              {lng === "fa"
                ? (data.paying_amount * euro).toLocaleString("fa-IR")
                : data.paying_amount}
              &nbsp;{t("m_unit")}
            </td>
            <td className={classes.td}>
              {lng !== "fa" ? (
                new Date(data.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  day: "numeric",
                  month: "long",
                })
              ) : (
                <>
                  {new Date(data.created_at).toLocaleDateString("fa-IR", {
                    year: "numeric",
                    day: "numeric",
                    month: "long",
                  })}
                </>
              )}
            </td>
            <td className={classes.td}>
              {data.delivery_status === "1" && (
                <Tooltip title={t("continue")} arrow placement="top">
                  <Link
                    to={`/fa/order/pay/${data.id}`}
                    target="_blank"
                    className={classes.link}
                  >
                    <IconButton className={classes.btn} size="large">
                      <OpenInNew
                        sx={{ color: "black", fontSize: "25px !important" }}
                      />
                    </IconButton>
                  </Link>
                </Tooltip>
              )}
            </td>
            <td className={classes.td}>
              {data.delivery_status === "1" && (
                <Tooltip
                  title={`${t("cancel")} ${t("number")} ${data.order_number}`}
                  arrow
                  placement="top"
                >
                  <IconButton
                    className={classes.btn}
                    size="large"
                    onClick={() => deleteOrder(data.id)}
                  >
                    <Delete
                      sx={{ color: "black", fontSize: "25px !important" }}
                    />
                  </IconButton>
                </Tooltip>
              )}
            </td>
          </tr>
        </>
      )}
    </>
  );
};

export default OrderHistory;
