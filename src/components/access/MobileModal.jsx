import { Button, IconButton, InputAdornment, TextField } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import Flag from "react-world-flags";

import logo from "../../assets/images/logo_trasnparent.png";
import { ReactComponent as Close } from "../../assets/svg/close.svg";
import { sendOTP } from "../../services/api";
import { accesModalActions, signupActions } from "../../store/store";
import { notify } from "../../utils/helperFunctions";

import LoadingSpinner from "../common/LoadingSpinner";
import classes from "./MobileModal.module.css";

const OTP_TIMEOUT_MS = 2 * 60 * 1000; // 2 minutes

const MobileModal = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const formRef = useRef();
  const inputRef = useRef();
  const lng = useSelector((state) => state.localeStore.lng);

  const [signupValues, setSignupValues] = useState(null);
  const [otpValue, setOtpValue] = useState("");
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    inputRef.current.focus();
    const data = localStorage.getItem("sis");
    if (data) {
      try {
        setSignupValues(JSON.parse(data));
      } catch (error) {
        console.error("Failed to parse signup values:", error);
      }
    }
  }, []);

  useEffect(() => {
    if (signupValues?.createdAt) {
      const targetDate = new Date(signupValues.createdAt);
      if (!isNaN(targetDate)) {
        const countdownEndTime = new Date(
          targetDate.getTime() + OTP_TIMEOUT_MS
        );
        setTimeRemaining(Math.max(0, countdownEndTime - new Date()));
      }
    }
  }, [signupValues?.createdAt]);

  useEffect(() => {
    if (timeRemaining <= 0) return;

    const intervalId = setInterval(() => {
      setTimeRemaining((prevTime) => Math.max(0, prevTime - 1000));
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timeRemaining]);

  const handleSendOtp = (e, otp = otpValue) => {
    e?.preventDefault();
    if (otp) {
      handleVerifyOTP(otp);
      dispatch(accesModalActions.mobile());
    }
  };

const handleVerifyOTP = async (cellphone) => {
  setIsLoading(true);
  try {
    const serverRes = await sendOTP(cellphone);

    if (serverRes.response && serverRes.response.ok) {
      dispatch(accesModalActions.setMobile(cellphone));
      dispatch(accesModalActions.loginOtp());

      const success_fa = serverRes.result?.message_fa || serverRes.message_fa;
      const success_en = serverRes.result?.message_en || serverRes.message_en;

      notify(lng === "fa" ? success_fa : success_en);
    } else {
      const error_fa =
        serverRes.result?.errors_fa ||
        serverRes.message_fa ||
        t("errors.default_error_fa");
      const error_en =
        serverRes.result?.errors_en ||
        serverRes.message_en ||
        t("errors.default_error_en");

      notify(lng === "fa" ? error_fa : error_en);
      dispatch(accesModalActions.close());
    }
  } catch (error) {
    let errorMessage = "";

    if (error.response) {
      const error_fa =
        error.response.data?.errors_fa ||
        error.response.data?.message_fa ||
        t("errors.default_error_fa");
      const error_en =
        error.response.data?.errors_en ||
        error.response.data?.message_en ||
        t("errors.default_error_en");

      errorMessage = lng === "fa" ? error_fa : error_en;
    } else if (error.request) {
      errorMessage = t("errors.network_error");
    } else {
      errorMessage = t("errors.generic_error");
    }

    console.error("OTP Error:", error);
    notify(errorMessage);
    dispatch(accesModalActions.close());
  } finally {
    setIsLoading(false);
  }
};

  const handleCloseModal = () => {
    dispatch(accesModalActions.close());
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

  // Format time remaining as MM:SS
  const formattedTime = `${String(Math.floor(timeRemaining / 60000)).padStart(
    2,
    "0"
  )}:${String(Math.floor((timeRemaining % 60000) / 1000)).padStart(2, "0")}`;

  const isRTL = lng === "fa";

  return (
    <div className={classes.content_wrapper}>
      <div className={classes.sheet}>
        <div className={classes.logo_wrapper}>
          <img className={classes.logo} src={logo} alt="" loading="lazy" />
        </div>

        <div className={classes.otp_wrapper}>
          <div className={classes.actions}>
            <form
              onSubmit={handleSendOtp}
              ref={formRef}
              className={classes.form}
            >
              <p className={classes.text} dir={isRTL ? "rtl" : "ltr"}>
                {t("enter_mobile_number")}
              </p>

              <TextField
                value={otpValue}
                onChange={(e) => setOtpValue(e.target.value)}
                type="tel"
                inputMode="numeric"
                ref={inputRef}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Flag
                        code="IR"
                        style={{ width: "20px", height: "auto" }}
                      />
                      +98
                    </InputAdornment>
                  ),
                }}
                disabled={isLoading}
              />

              <Button
                type="submit"
                className={classes.login_btn}
                disabled={isLoading || !otpValue}
              >
                {isLoading ? <LoadingSpinner size={"20px"} /> : t("submit")}
              </Button>
            </form>
          </div>
        </div>

        <div
          className={classes.signup_link}
          style={{ direction: isRTL ? "rtl" : "ltr" }}
        >
          <p>{t("access.have_acc")}</p>&nbsp;
          <button onClick={handleGoToLogin}>{t("login")}</button>&nbsp;
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

export default MobileModal;
