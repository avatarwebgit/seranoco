import { Button, IconButton } from "@mui/material";
import { InputOTP } from "antd-input-otp";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import logo from "../../assets/images/logo_trasnparent.png";
import { ReactComponent as Close } from "../../assets/svg/close.svg";

import { sendShoppingCart, verifyOTP2 } from "../../services/api";
import {
  accesModalActions,
  cartActions,
  drawerActions,
  signupActions,
  userActions,
} from "../../store/store";
import { notify } from "../../utils/helperFunctions";

import classes from "./OTP.module.css";

const OTP_TIMEOUT_MS = 2 * 60 * 1000;

const OTP = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const lng = useSelector((state) => state.localeStore.lng);
  const cellphone = useSelector((state) => state.accessModalStore.mobileNo);
  const temporaryCart = useSelector((state) => state.cartStore.temporaryCart);
  const pendingItem = useSelector((state) => state.cartStore.pendingItem);
  const euro = useSelector((state) => state.cartStore.euro);

  const [signupValues, setSignupValues] = useState(null);
  const [otpValue, setOtpValue] = useState([]);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const data = localStorage.getItem("sis");
    setTimeRemaining(OTP_TIMEOUT_MS);

    if (data) {
      try {
        setSignupValues(JSON.parse(data));
      } catch (error) {
        console.error("Failed to parse signup values:", error);
      }
    }
  }, []);

  useEffect(() => {
    if (!signupValues?.createdAt) return;

    const targetDate = new Date(signupValues.createdAt);
    if (isNaN(targetDate)) {
      console.error("Invalid createdAt date:", signupValues.createdAt);
      return;
    }

    const countdownEndTime = new Date(targetDate.getTime() + OTP_TIMEOUT_MS);
    const updateTimeRemaining = () => {
      const remaining = countdownEndTime - new Date();
      setTimeRemaining(Math.max(0, remaining));
      return remaining > 0;
    };

    if (!updateTimeRemaining()) return;

    const intervalId = setInterval(() => {
      if (!updateTimeRemaining()) {
        clearInterval(intervalId);
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [signupValues?.createdAt]);

  const handleFinish = (e, otp) => {
    e.preventDefault();
    handleVerifyOTP(otp.join(""), cellphone);
  };

  const handleSendShoppingCart = async (token, el) => {
    const serverRes = await sendShoppingCart(
      token,
      +el.id,
      +el.variation_id,
      +el.selected_quantity
    );
    try {
      notify(t("orders.ok"));
      if (serverRes.response.ok) {
        dispatch(
          cartActions.add({
            ...el,
            selected_quantity: +el.selected_quantity,
            euro_price: euro,
            variation_id: +el.variation_id,
            variation: { quantity: +el.selected_quantity },
          })
        );
      }
      dispatch(drawerActions.open());
    } catch (err) {
      //  console.log(err);
    }
  };

  const handleVerifyOTP = async (code, cellphone) => {
    setIsLoading(true);

    try {
      const serverRes = await verifyOTP2(code, cellphone);
      dispatch(userActions.setUser(serverRes.result.user));
      dispatch(userActions.set(serverRes.result.token));
      dispatch(accesModalActions.close());

      if (pendingItem) {
        try {
          const res = await sendShoppingCart(
            serverRes.result.token,
            pendingItem.id,
            pendingItem.variation_id,
            pendingItem.quantity
          );
          if (res.response.ok) {
            dispatch(cartActions.clearPendingItem());
            notify(t("orders.ok"));
            dispatch(drawerActions.open());
          }
        } catch (error) {
          console.error("Error adding pending item:", error);
        }
      } else if (temporaryCart?.length > 0) {
        try {
          await Promise.all(
            temporaryCart.map((item) =>
              handleSendShoppingCart(serverRes.result.token, item)
            )
          );
          notify(t("orders.allItemsAdded"));
        } catch (error) {
          console.error("Error sending some cart items:", error);
          notify(t("orders.someItemsFailed"));
        } finally {
          dispatch(drawerActions.open());
        }
      } else {
        dispatch(drawerActions.open());
      }
    } catch (error) {
      console.error("OTP verification failed:", error);
      notify(t("trylater"));
      dispatch(accesModalActions.close());
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = () => {
    const updatedValues = {
      ...signupValues,
      createdAt: new Date().toISOString(),
    };
    dispatch(signupActions.set(updatedValues));
    setTimeRemaining(OTP_TIMEOUT_MS);
  };

  const handleGoToLogin = () => {
    dispatch(accesModalActions.login());
  };

  const formattedTime = `${String(Math.floor(timeRemaining / 60000)).padStart(
    2,
    "0"
  )}:${String(Math.floor((timeRemaining % 60000) / 1000)).padStart(2, "0")}`;

  const isRTL = lng === "fa";

  const handleCloseModal = () => {
    dispatch(accesModalActions.close());
  };

  return (
    <div className={classes.content_wrapper}>
      <div className={classes.sheet}>
        <div className={classes.logo_wrapper}>
          <img className={classes.logo} src={logo} alt="" loading="lazy" />
        </div>

        <div className={classes.otp_wrapper}>
          <div className={classes.actions}>
            <form
              onSubmit={(e) => handleFinish(e, otpValue)}
              className={classes.form}
            >
              <InputOTP
                onChange={setOtpValue}
                value={otpValue}
                variant="outlined"
                inputMode="numeric"
                inputClassName={classes.otp_input}
                count={6}
                disabled={isLoading}
              />{" "}
              <Button
                variant="contained"
                size="small"
                className={classes.login_btn}
                type="submit"
                disabled={otpValue.length < 6}
              >
                {t("pc.submit")}
              </Button>
            </form>
          </div>

          <div>
            {timeRemaining > 0 ? (
              <center className={classes.time}>
                <h2>{formattedTime}</h2>
              </center>
            ) : (
              <center>
                <Button
                  variant="contained"
                  size="small"
                  className={classes.login_btn}
                  onClick={handleResendOTP}
                  disabled={isLoading}
                  sx={{ margin: "0 !important" }}
                >
                  {t("otp.resend")}
                </Button>
              </center>
            )}
          </div>
        </div>

        <div
          className={classes.signup_link}
          style={{ direction: isRTL ? "rtl" : "ltr" }}
        >
          <p>{t("access.have_acc")}</p>&nbsp;
          <button onClick={handleGoToLogin} disabled={isLoading}>
            {t("login")}
          </button>
          &nbsp;
        </div>
      </div>
      <IconButton
        className={classes.close_btn}
        disableRipple={true}
        onClick={handleCloseModal}
      >
        <Close width={30} height={30} />
      </IconButton>
    </div>
  );
};

export default OTP;
