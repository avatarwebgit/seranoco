import { KeyboardArrowRight, Lock } from "@mui/icons-material";
import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  IconButton,
  Skeleton,
  styled,
  Switch,
} from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { ReactComponent as Close } from "../assets/svg/close.svg";
import CartProduct from "../components/card/CartProduct";

import { getShoppingCart, sendCouponStatus } from "../services/api";
import {
  accesModalActions,
  cartActions,
  drawerActions,
  walletActions,
} from "../store/store";
import { formatNumber, notify } from "../utils/helperFunctions";
import styles from "./Drawer.module.css";

const IOSSwitch = styled((props) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 42,
  height: 26,
  padding: 0,
  display: "flex",
  "& .MuiSwitch-switchBase": {
    padding: 0,
    margin: 2,
    transition: "transform 300ms",
    "&.Mui-checked": {
      transform: "translateX(16px)",
      color: "#fff",
      "& + .MuiSwitch-track": {
        backgroundColor: "#4f46e5",
        opacity: 1,
        border: 0,
      },
    },
  },
  "& .MuiSwitch-thumb": {
    boxSizing: "border-box",
    width: 22,
    height: 22,
    transition: "all 300ms",
  },
  "& .MuiSwitch-track": {
    borderRadius: 13,
    backgroundColor: "#c2c2c2",
    opacity: 1,
    transition: "background-color 300ms",
  },
}));

const Drawer = () => {
  const dispatch = useDispatch();
  const drawerState = useSelector((state) => state.drawerStore.drawerOpen);
  const cart = useSelector((state) => state.cartStore);
  const lng = useSelector((state) => state.localeStore.lng);
  const token = useSelector((state) => state.userStore.token);
  const walletBalance = useSelector((state) => state.walletStore.balance);
  const walletStatus = useSelector((state) => state.walletStore.useWallet);
  const couponStatus = useSelector((state) => state.walletStore.useCoupon);
  const couponValue = useSelector((state) => state.walletStore.couponCode);

  const [isLoadingData, setIsLoadingData] = useState(true);
  const [productData, setProductData] = useState([]);
  const [showCouponInput, setShowCouponInput] = useState(false);
  const [coupon, setCoupon] = useState("");

  const { t } = useTranslation();
  const isRTL = lng === "fa";

  const toggleDrawer = () => {
    dispatch(drawerActions.close());
  };

  const handleGetShoppingCart = async () => {
    try {
      setIsLoadingData(true);
      const serverRes = await getShoppingCart(token);
      if (serverRes.response.ok) {
        dispatch(cartActions.set(serverRes.result.cart));
        dispatch(walletActions.setBalance(serverRes.result.wallet_balance));
      }
    } catch (error) {
      setIsLoadingData(false);
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleApplyCoupon = async () => {
    setIsLoadingData(true);
    const { result, response } = await sendCouponStatus(token, coupon);

    if (response.ok) {
      notify(lng === "fa" ? result.message_fa : result.message_en);
      dispatch(
        walletActions.setCouponState({ useCoupon: true, value: coupon })
      );
      const newPrice = Math.max(
        cart.totalPrice - result.amount / +cart.euro,
        0
      );
      dispatch(cartActions.setTotalPrice(newPrice));
      setIsLoadingData(false);
    } else {
      setIsLoadingData(false);
      setShowCouponInput(false);
      dispatch(walletActions.resetCoupon());
      setCoupon("");
      const err_fa = result?.error_fa;
      const err_en = result?.error_en;
      notify(lng === "fa" ? err_fa : err_en);
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
    if (drawerState && token) {
      handleGetShoppingCart();
      if (couponStatus && couponValue) {
        setShowCouponInput(true);
        setCoupon(couponValue);
        handleApplyCoupon();
      }
    }
    if (drawerState) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerState, token]);

  useEffect(() => {
    if (cart.products || drawerState) {
      setProductData(cart.products);
    }
    if (cart.temporaryCart && drawerState && !token) {
      setProductData(cart.temporaryCart);
    }
  }, [cart, drawerState]);

  useEffect(() => {
    if (walletBalance > 0) {
      if (walletStatus) {
        dispatch(
          cartActions.setTotalPriceAfterDiscout(
            Math.max(cart?.totalPrice - walletBalance, 0)
          )
        );
      } else {
        dispatch(cartActions.setTotalPriceAfterDiscout(cart?.totalPrice));
      }
    } else {
      dispatch(walletActions.setWalletUse(false));
    }
  }, [cart.totalPrice, walletBalance, walletStatus]);

  useEffect(() => {
    console.log(cart);
    console.log(walletBalance)
  }, [cart])
  

  return (
    <div
      className={`${styles.main} ${!isRTL ? styles.main_rtl : styles.main_ltr}`}
      aria-hidden={!drawerState}
      style={{ pointerEvents: drawerState ? "auto" : "none" }}
    >
      {/* Backdrop */}
      <motion.div
        className={styles.backdrop}
        initial={{ opacity: 0 }}
        animate={{ opacity: drawerState ? 1 : 0 }}
        onClick={toggleDrawer}
        transition={{ duration: 0.3 }}
      />

      {/* Drawer Content */}
      <motion.div
        className={styles.content}
        initial={{ x: isRTL ? "100%" : "-100%" }}
        animate={{ x: drawerState ? 0 : isRTL ? "100%" : "-100%" }}
        transition={{ type: "spring", bounce: false, duration: 0.3 }}
      >
        {/* Header */}
        <header className={styles.header_wrapper}>
          <h2 className={styles.header_title}>{t("shopping_cart.cart")}</h2>
          <IconButton onClick={toggleDrawer}>
            <Close className={styles.close_icon} />
          </IconButton>
        </header>

        {/* Cart Items */}
        <div className={styles.items_wrapper}>
          <div className={styles.items_sheet}>
            {productData.map((el) => (
              <CartProduct key={el.id} data={el} />
            ))}
          </div>
        </div>

        {/* Wallet Section */}
        {token && (
          <div className={styles.wallet_wrapper}>
            {isLoadingData ? (
              <Skeleton
                variant="text"
                width="100%"
                height={35}
                animation="wave"
              />
            ) : (
              <div
                className={styles.info_row}
                style={{ direction: !isRTL ? "ltr" : "rtl" }}
              >
                <p>{t("shopping_cart.total")}:</p>
                <span>
                  {console.log(cart.totalFeeBeforeDiscounts)}
                  {cart.totalFeeBeforeDiscounts && !isRTL
                    ? cart?.totalFeeBeforeDiscounts?.toFixed(2)
                    : formatNumber(
                        Math.round(cart.totalFeeBeforeDiscounts * cart.euro)
                      )}
                  &nbsp;
                  {t("m_unit")}
                </span>
              </div>
            )}
            <div
              className={styles.info_row}
              style={{ direction: !isRTL ? "ltr" : "rtl" }}
            >
              <div dir={isRTL ? "rtl" : "ltr"} className={styles.row_wrapper}>
                {isLoadingData && walletBalance > 0 ? (
                  <Skeleton
                    variant="text"
                    width={"100%"}
                    height={35}
                    animation="wave"
                  />
                ) : (
                  <>
                    <span
                      className={!walletStatus ? styles.text_muted : ""}
                      style={{ display: "flex" }}
                    >
                      {t("wallet")}:&nbsp;
                      <span dir="ltr">
                        {!isRTL
                          ? walletBalance
                          : formatNumber(walletBalance * cart.euro)}
                      </span>
                      &nbsp;
                      {t("m_unit")}
                    </span>
                    <FormGroup>
                      <FormControlLabel
                        disabled={walletBalance <= 0}
                        control={
                          <IOSSwitch
                            checked={walletStatus}
                            onChange={(e) => {
                              dispatch(
                                walletActions.setWalletUse(e.target.checked)
                              );
                              dispatch(walletActions.setUserIntraction());
                            }}
                          />
                        }
                        label={
                          <span className={styles.wallet_label}>
                            {t("use_wallet")}
                          </span>
                        }
                        labelPlacement={isRTL ? "start" : "end"}
                        sx={{
                          margin: 0,
                          "& .MuiFormControlLabel-label": { padding: "0 8px" },
                        }}
                      />
                    </FormGroup>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Coupon Section */}
        {token && (
          <div className={styles.coupon_section}>
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={showCouponInput}
                    onChange={(e) => {
                      setShowCouponInput(e.target.checked);
                    }}
                    sx={{
                      color: "#000",
                      "&.Mui-checked": { color: "#000" },
                    }}
                  />
                }
                label={
                  <span className={styles.coupon_label}>
                    {t("I have a coupon")}
                  </span>
                }
                className={isRTL ? styles.rtl_form_control : ""}
              />
            </FormGroup>

            <AnimatePresence>
              {showCouponInput && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginTop: 0 }}
                  animate={{ opacity: 1, height: "auto", marginTop: "0.5rem" }}
                  exit={{ opacity: 0, height: 0, marginTop: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className={`${styles.coupon_form} ${
                    isRTL && styles.rtl_form_control
                  }`}
                >
                  <input
                    type="text"
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                    placeholder={t("Enter coupon code")}
                    className={styles.coupon_input}
                    dir={isRTL ? "rtl" : "ltr"}
                    disabled={isLoadingData}
                  />
                  <button
                    onClick={handleApplyCoupon}
                    className={styles.coupon_button}
                    disabled={isLoadingData}
                  >
                    {t("apply")}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Footer Actions */}
        <footer className={styles.actions_wrapper}>
          <div
            className={`${styles.info_row} ${styles.payment_total_row}`}
            style={{ direction: !isRTL ? "ltr" : "rtl" }}
          >
            {isLoadingData ? (
              <Skeleton
                variant="text"
                width={"100%"}
                height={35}
                animation="wave"
              />
            ) : (
              <div className={styles.payment_amount}>
                <h3 className={styles.payment_title}>{t("payment")}:</h3>
                  {!walletStatus ? (
                  <>
                    {cart.productPrice && walletBalance && (
                      <>
                        {!isRTL
                          ? cart.totalPriceAfterDiscount.toFixed(2)
                          : Intl.NumberFormat("fa-IR").format(
                              Math.max(0, cart.productPrice * cart.euro)
                            )}
                      </>
                    )}
                  </>
                ) : (
                  <>
                    {!isRTL
                      ? cart?.totalPrice?.toFixed(2)
                      : Intl.NumberFormat("fa-IR").format(
                          Math.max(
                            0,
                            (cart.productPrice - walletBalance) * cart.euro
                          )
                        )}
                  </>
                )}
                &nbsp;{t("m_unit")}
              </div>
            )}
          </div>
          {token ? (
            <Link
              to={`/${lng}/precheckout`}
              target="_blank"
              className={`${styles.action_button} ${styles.pay_btn}`}
            >
              {t("shopping_cart.pay")}
              <KeyboardArrowRight
                fontSize="small"
                className={
                  isRTL ? styles.pay_btn_arrow_rtl : styles.pay_btn_arrow
                }
              />
            </Link>
          ) : (
            <button
              onClick={() => dispatch(accesModalActions.login())}
              className={`${styles.action_button} ${styles.login_btn}`}
            >
              <Lock fontSize="small" />
              {t("login")}
            </button>
          )}
        </footer>
      </motion.div>
    </div>
  );
};

export default Drawer;
