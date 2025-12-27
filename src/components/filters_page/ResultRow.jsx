import { Lock } from "@mui/icons-material";
import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { sendShoppingCart } from "../../services/api";
import {
  accesModalActions,
  cartActions,
  drawerActions,
} from "../../store/store";
import { formatNumber, notify } from "../../utils/helperFunctions";
import classes from "./ResultRow.module.css";

const ResultRow = ({ dataProp }) => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();

  // Selectors
  const lng = useSelector((state) => state.localeStore.lng);
  const token = useSelector((state) => state.userStore.token);
  const euro = useSelector((state) => state.cartStore.euro);
  const cartProducts = useSelector((state) => state.cartStore.products);

  // State
  const [data, setData] = useState(null);
  const [isLoadingImage, setIsLoadingImage] = useState(true);
  const [quantities, setQuantities] = useState({});

  // Derived state
  const isLoading = isLoadingImage;

  // Effects
  useEffect(() => {
    if (dataProp) {
      setData(dataProp);
    }
  }, [dataProp]);

  // Handlers
  const handleQuantityChange = useCallback(
    (variationId, change) => {
      setQuantities((prev) => {
        const current = prev[variationId] || 0;
        const newQuantity = current + change;
        const item = data?.find((el) => el.variation_id === variationId);

        if (item && newQuantity >= 0 && newQuantity <= item.quantity) {
          return { ...prev, [variationId]: newQuantity };
        }
        return prev;
      });
    },
    [data]
  );

  const handleAddQuantity = useCallback(
    (el) => {
      handleQuantityChange(el.variation_id, 1);
    },
    [handleQuantityChange]
  );

  const handleReduceQuantity = useCallback(
    (el) => {
      handleQuantityChange(el.variation_id, -1);
    },
    [handleQuantityChange]
  );

  const handleSendShoppingCart = async (product, variationId, quantity) => {
    if (!token) {
      dispatch(accesModalActions.login());
      return;
    }

    const isInCart =
      cartProducts.find((p) => p.variation_id === +variationId) || null;

    if (isInCart) {
      return notify(t("product.exist"));
    }

    try {
      const qty = quantity || 1;
      const serverRes = await sendShoppingCart(
        token,
        product.id,
        +variationId,
        qty
      );

      if (serverRes.response?.ok) {
        dispatch(drawerActions.open());
        notify(t("orders.ok"));
      }
    } catch (err) {
      console.error("Error sending shopping cart:", err);
      notify(t("orders.error"));
    }
  };

  // Render helpers
  const renderPrice = (price) => {
    if (lng === "en") {
      return `${+price}${t("m_unit")}`;
    }
    return (
      <>
        {formatNumber(price * euro)}&nbsp;{t("m_unit")}
        <br />
        (€&nbsp;{price})
      </>
    );
  };

  const renderPriceWithOff = (item) => {
    return (
      <div className={classes.price_wrapper}>
        {lng !== "fa" ? (
          <>
            {+item.percent_sale_price !== 0 && (
              <span className={classes.prev_price}>
                <p className={classes.off_text}>{item.percent_sale_price}%</p>
                <p
                  style={{
                    textDecoration: "line-through",
                    fontSize: ".5rem",
                  }}
                >
                  {item.price}
                  {t("m_unit")}
                </p>
              </span>
            )}

            <p className={classes.current_price}>{item.sale_price}&nbsp;€</p>
          </>
        ) : (
          <>
            {+item.percent_sale_price !== 0 && (
              <span className={classes.prev_price}>
                <p className={classes.off_text}>{item.percent_sale_price}%</p>
                <p
                  style={{
                    textDecoration: "line-through",
                    fontSize: ".5rem",
                  }}
                >
                  {item?.price * euro} {t("m_unit")}
                </p>
              </span>
            )}

            <div className={classes.current_price}>
              {formatNumber(item.sale_price * euro)}تومان
              <br />
              <span>
                (&nbsp;€&nbsp;
                {item.sale_price} )
              </span>
            </div>
          </>
        )}
      </div>
    );
  };

  const renderTotalPrice = (variationId, price) => {
    const quantity = quantities[variationId] || 0;
    const total = quantity * price;

    if (lng === "en") {
      return `${total} ${t("m_unit")}`;
    }
    return `${formatNumber(Math.round(total * euro))} ${t("m_unit")}`;
  };

  const renderActionButton = (item) => {
    const quantity = quantities[item.variation_id] || 0;
    const isOutOfStock = item.quantity === 0;

    if (!token) {
      return (
        <button
          className={classes.login_btn}
          onClick={() => {
            dispatch(
              cartActions.setPendingItem({
                id: item.id,
                variation_id: +item.variation_id,
                quantity: quantity || 1,
              })
            );
            dispatch(accesModalActions.login());
          }}
        >
          {isOutOfStock ? t("addtoorder") : t("add_to_card")}
        </button>
      );
    }

    return (
      <button
        className={classes.add_to_card}
        onClick={() =>
          handleSendShoppingCart(item, item.variation_id, quantity)
        }
      >
        {isOutOfStock ? t("addtoorder") : t("add_to_card")}
      </button>
    );
  };

  if (!data || data.length === 0) return null;

  return (
    <table className={classes.main}>
      <thead>
        <tr>
          <th className={classes.title_text} style={{ opacity: 0 }}>
            {t("type")}
          </th>
          <th className={classes.title_text} style={{ opacity: 0 }}>
            {t("type")}
          </th>
          <th className={classes.title_text}>
            {t("brand")}&nbsp;/&nbsp;{t("mine")}
          </th>
          <th className={classes.title_text}>{t("signle_shape")}</th>
          <th className={classes.title_text}>{t("size")}</th>
          <th className={classes.title_text}>{t("color")}</th>
          <th className={classes.title_text}>{t("details")}</th>
          <th className={classes.title_text}>{t("country")}</th>
          <th className={classes.title_text}>
            {t("price")}&nbsp;1{t("1_pcs")} / {t("m_unit")}
          </th>
          {/* <th className={classes.title_text}>
      {t('quantity')} / {t('pcs')}
     </th> */}
          {/* <th className={classes.title_text}>
      {t('total_price')} / {t('m_unit')}
     </th> */}
          <th className={classes.title_text} style={{ opacity: 0 }}>
            {t("action")}
          </th>
        </tr>
      </thead>
      <tbody>
        {data.map((item) => (
          <tr
            className={classes.tr}
            key={`${item.id}-${item.variation_id}`}
            style={{ height: "80px" }}
          >
            {/* Image Column */}
            <td className={classes.img_wrapper}>
              <img
                src={item.primary_image}
                onLoad={() => setIsLoadingImage(false)}
                loading="lazy"
                style={{ maxHeight: "70px" }}
                alt={item.details}
              />
            </td>
            <td>
              <center>
                <Link
                  to={`/${lng}/products/${item.alias}/${item.variation_id}`}
                  target="_blank"
                  className={classes.link}
                >
                  More
                </Link>
              </center>
            </td>
            {/* Detail Column */}
            <td className={classes.detail_text}>{item.details}</td>

            {/* shpae */}
            <td className={classes.detail_text}>
              {lng === "fa"
                ? item.attribute.find((attr) => attr.attribute.name === "Shape")
                    ?.value.name_fa
                : item.attribute.find((attr) => attr.attribute.name === "Shape")
                    ?.value.name}
            </td>

            {/* Size */}
            <td className={classes.detail_text}>{item.size}</td>

            {/* Color */}
            <td className={classes.detail_text}>{item.color}</td>

            {/* Quality */}
            <td className={classes.detail_text}>
              {
                item.attribute?.find(
                  (attr) => attr.attribute.name === "Details"
                )?.value?.name
              }
            </td>

            {/* Country */}
            <td className={classes.detail_text}>{item.country}</td>

            {/* Price */}
            <td
              className={classes.detail_text}
              style={{ direction: lng === "fa" ? "rtl" : "ltr" }}
            >
              {item.price === item.sale_price
                ? renderPrice(item.sale_price)
                : renderPriceWithOff(item)}
            </td>
            <td>
              <center>{renderActionButton(item)}</center>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default React.memo(ResultRow);
