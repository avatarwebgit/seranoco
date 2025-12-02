import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { sendShoppingCart } from "../../services/api";
import {
  accesModalActions,
  cartActions,
  drawerActions,
} from "../../store/store";

import { formatNumber, notify } from "../../utils/helperFunctions";

import classes from "./ResultMobile.module.css";
const ResultMobile = ({ dataProps }) => {
  const [data, setData] = useState(null);

  const { t } = useTranslation();

  const dispatch = useDispatch();

  const lng = useSelector((state) => state.localeStore.lng);
  const token = useSelector((state) => state.userStore.token);
  const euro = useSelector((state) => state.cartStore.euro);
  const cartProducts = useSelector((state) => state.cartStore.products);

  useEffect(() => {
    if (dataProps) {
      setData(dataProps);
    }
  }, [dataProps]);

  const handleSendShoppingCart = async (el, variation, quantity) => {
    console.log("first");
    if (!token) {
      console.log("sec");
      dispatch(accesModalActions.login());
      return;
    }
    const isInCart =
      cartProducts.find((p) => p.variation_id === +variation) || null;

    if (isInCart) {
      return notify(t("product.exist"));
    }
    try {
      const serverRes = await sendShoppingCart(
        token,
        el.id,
        +variation,
        quantity
      );
      if (serverRes.response.ok) {
        dispatch(drawerActions.open());
      }
    } catch (err) {
      //  console.log(err);
    } finally {
      notify(t("orders.ok"));
    }
  };

  const handleAddToTemporaryCard = (el, variation, quantity) => {
    dispatch(cartActions.addToTemporaryCart(el));
    dispatch(drawerActions.open());
  };

  return (
    <div className={classes.main} dir={lng === "fa" ? "rtl" : "ltr"}>
      {data &&
        data.map((el) => {
          const colorAttr = el?.attribute.find(
            (attr) => attr.attribute.name === "Color"
          ).value;
          const detailAttr = el?.attribute?.find(
            (attr) => attr.attribute.name === "Details"
          ).value;
          return (
            <div className={classes.wrapper}>
              <div className={classes.right_side}>
                <Link
                  key={el.id}
                  to={`/${lng}/products/${el.alias}/${el.variation_id}`}
                >
                  <img src={el.primary_image} alt="" loading="lazy" />
                </Link>
                <Link
                  className={classes.shop_btn}
                  key={el.id}
                  to={`/${lng}/products/${el.alias}/${el.variation_id}`}
                >
                  More
                </Link>
              </div>
              <div className={classes.left_side}>
                <span className={classes.name_wrapper}>
                  <p className={classes.name}>
                    {!lng === "fa" ? el.name : el.name_fa}
                  </p>
                </span>
                <table className={classes.details_table}>
                  <tbody>
                    <tr>
                      <td className={classes.detail_label}>{t("type")}</td>
                      <td className={classes.detail_value}>
                        {el?.details || "none"}
                      </td>
                    </tr>
                    <tr>
                      <td className={classes.detail_label}>{t("size")}</td>
                      <td className={classes.detail_value}>
                        {el?.size || "none"}
                      </td>
                    </tr>
                    <tr>
                      <td className={classes.detail_label}>{t("color")}</td>
                      <td className={classes.detail_value}>
                        {lng === "fa"
                          ? colorAttr.name_fa
                          : colorAttr.name || "none"}
                      </td>
                    </tr>
                    <tr>
                      <td className={classes.detail_label}>{t("details")}</td>
                      <td className={classes.detail_value}>
                        {lng === "fa"
                          ? detailAttr.name_fa
                          : detailAttr.name || "none"}
                      </td>
                    </tr>
                    <tr>
                      <td className={classes.detail_label}>{t("country")}</td>
                      <td className={classes.detail_value}>
                        {el?.country || "none"}
                      </td>
                    </tr>
                    <tr>
                      <td className={classes.detail_label}>
                        {t("price")}&nbsp;1{t("1_pcs")} / {t("m_unit")}
                      </td>
                      <td className={classes.detail_value}>
                        <div className={classes.price_wrapper}>
                          {+el.percent_sale_price !== 0 && (
                            <span className={classes.prev_price}>
                              <p
                                style={{
                                  textDecoration: "line-through",
                                  fontSize: ".5rem",
                                }}
                              >
                                {lng !== "fa" ? el.price : el?.price * euro}{" "}
                                {t("m_unit")}
                              </p>
                              <p className={classes.off_text}>
                                {el.percent_sale_price}%
                              </p>
                            </span>
                          )}
                          <p className={classes.current_price}>
                            {lng !== "fa"
                              ? `${el.sale_price} €`
                              : `${formatNumber(
                                  el.sale_price * euro
                                )} تومان (€${el.sale_price})`}
                          </p>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>

                {token ? (
                  <button
                    className={classes.shop_btn}
                    onClick={(e) =>
                      handleSendShoppingCart(el, el?.variation_id, 1)
                    }
                  >
                    {t("add_to_card")}
                  </button>
                ) : (
                  <button
                    className={classes.shop_btn}
                    onClick={(e) =>
                      handleAddToTemporaryCard(el, el.variation_id, 1)
                    }
                  >
                    {t("add_to_card")}
                  </button>
                )}
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default ResultMobile;
