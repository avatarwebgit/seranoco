import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { cartActions } from "../../store/store";

import { useTranslation } from "react-i18next";
import { sendCartPrice } from "../../services/api";
import { notify } from "../../utils/helperFunctions";

import classes from "./PaymentMethod.module.css";
import LoadingSpinner from "../common/LoadingSpinner";
const PaymentMethod = ({ dataProps }) => {
  const lng = useSelector((state) => state.localeStore.lng);
  const cart = useSelector((state) => state.cartStore);
  const token = useSelector((state) => state.userStore.token);
  const walletStatus = useSelector((state) => state.walletStore.useWallet);
  const [requestLoading, setRequestLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { t } = useTranslation();

  const [data, setData] = useState(null);

  useEffect(() => {
    if (dataProps) {
      setData(dataProps);
    }
  }, [dataProps]);

  const handleSetPaymentMethod = async (id) => {
    dispatch(cartActions.setPaymentMethod(id));
    setRequestLoading(true);
    try {
      const serverRes = await sendData(
        token,
        cart.selectedAddress,
        id,
        cart.finalPayment,
        walletStatus,
        cart.deliveryMethod
      );
    } catch {
      setRequestLoading(false);
    } finally {
      setRequestLoading(false);
    }
  };

  const sendData = async (
    token,
    address,
    method,
    amount,
    use_wallet,
    delivery_method_id
  ) => {
    const serverRes = await sendCartPrice(
      token,
      address,
      method,
      amount,
      use_wallet,
      delivery_method_id
    );

    if (serverRes.result.success && serverRes.result.redirect_uri) {
      let url = serverRes.result.redirect_uri;

      if (!url.startsWith("http://") && !url.startsWith("https://")) {
        url = "https://" + url;
      }

      window.location.href = url;
      return;
    }

    if (!serverRes.result.success) {
      return;
    }

    const handleNavToAcc = (activeAccordion, activeButton) => {
      navigate(`/${lng}/myaccount`, {
        state: { activeAccordion, activeButton },
      });
    };

    if (serverRes.response.ok && method === 10) {
      lng === "fa"
        ? navigate(`/fa/order/pay/${serverRes.result.order.id}`)
        : navigate(`/${lng}/order/wire-transfer`);
      notify(t("order_ok"));
    } else if (serverRes.response.ok && method !== 10) {
      handleNavToAcc(1, 0);
      notify(t("order_ok"));
    } else {
      notify(t("order_err"));
    }
  };

  return (
    <div className={classes.wrapper}>
      {data &&
        data.map((el) => {
          return (
            <>
              {el.id !== 10 ? (
                <>
                  <button
                    onClick={() => handleSetPaymentMethod(el.id)}
                    className={`${classes.label}`}
                    key={el.id}
                  >
                    <div className={classes.img_wrpper}>
                      <img
                        className={`${classes.img}`}
                        src={el.image}
                        alt={""}
                        loading="lazy"
                      />
                    </div>
                    {lng === "fa" ? el.title : el.title_en}
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => handleSetPaymentMethod(el.id)}
                    className={`${classes.label}`}
                    key={el.id}
                  >
                    <div className={classes.img_wrpper}>
                      <img
                        className={`${classes.img}`}
                        src={el.image}
                        alt={""}
                        loading="lazy"
                      />
                    </div>
                    {lng === "fa" ? el.title : el.title_en}
                    {requestLoading && (
                      <span>{<LoadingSpinner size={15} />}</span>
                    )}
                  </button>
                </>
              )}
            </>
          );
        })}
    </div>
  );
};

export default PaymentMethod;
