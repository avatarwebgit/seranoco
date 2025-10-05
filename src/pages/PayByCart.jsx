import moment from "moment-jalaali";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

import BannerCarousel from "../components/BannerCarousel";
import Breadcrumbs from "../components/common/Breadcrumbs";
import Body from "../components/filters_page/Body";
import Card from "../components/filters_page/Card";
import Footer from "../layout/Footer";
import Header from "../layout/Header";

import karafarinLogo from "../assets/images/KarafarinBank.png";

import { Autocomplete, Button, Input, TextField } from "@mui/material";
import "react-calendar/dist/Calendar.css";
import Calendar from "react-calendar/dist/cjs/Calendar.js";

import { formatNumber, notify } from "../utils/helperFunctions";

import { ArrowBackIosNew, Send } from "@mui/icons-material";
import { nanoid } from "nanoid";
import { Link, useNavigate, useParams } from "react-router-dom";
import { sendcardPaymentData } from "../services/api";
import classes from "./PayByCart.module.css";
const PayByCart = ({ widnowSize }) => {
  const [billNo, setBillNo] = useState("554");
  const [DocType, setDocType] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [recNo, setRecNo] = useState("");
  const [BankName, setBankName] = useState("");
  const [lastFour, setLastFour] = useState("");
  const [recScan, setRecScan] = useState([]);
  const [description, setDescription] = useState("");
  const [isError, setIsError] = useState(false);
  const [showCal, setShowCal] = useState(false);
  const [selectedMiladiDate, setSelectedMiladiDate] = useState("");

  const paymentMethods = [
    { id: 1, label: "کارت به کارت" },
    { id: 2, label: "حواله بانکی" },
  ];
  const bankNames = [{ id: 1, label: "ملت" }];

  const lng = useSelector((state) => state.localeStore.lng);
  const token = useSelector((state) => state.userStore.token);

  const calendarRef = useRef();
  const inputRef = useRef();

  const navigate = useNavigate();

  const { id } = useParams();

  const inputStyles = {
    m: "0.5rem 0",
    width: "100%",
    "& .MuiInputBase-root": {
      "& fieldset": {
        borderColor: "rgb(0, 153, 130)",
      },
    },
    "& .MuiInputBase-input": {
      color: "rgb(0, 0, 0)",
      fontSize: "16px",
      direction: lng === "fa" ? "rtl" : "ltr",
    },
    "& .MuiInputLabel-root": {
      color: "gray",
      fontSize: "14px",
    },
    "& .Mui-focused .MuiInputLabel-root": {
      color: "rgb(0, 153, 130)",
      transform: "translate(0, -5px) scale(0.75)",
    },
    "& .Mui-focused .MuiInputBase-root": {
      "& fieldset": {
        borderColor: "rgb(0, 153, 130)",
      },
    },
  };

  const { t } = useTranslation();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requiredFields = [
      DocType?.label?.trim(),
      amount?.trim(),
      selectedMiladiDate.trim(),
      recNo.trim(),
      BankName?.trim(),
      lastFour?.trim(),
    ];

    const isValid = requiredFields.every((field) => field && field.length > 0);

    if (!isValid) {
      return setIsError(true);
    } else {
      const res = await sendcardPaymentData(
        token,
        {
          billNo,
          DocType,
          amount,
          selectedMiladiDate,
          recNo,
          BankName,
          lastFour,
        },
        recScan,
        id
      );
      if (res.response.ok) {
        notify("اطلاعات با موقثیت ارسال شد .");
        handleNavToAcc(1, 0);
      }
    }
  };

  const handleNavToAcc = (activeAccordion, activeButton) => {
    navigate(`/${lng}/myaccount`, {
      state: { activeAccordion, activeButton },
    });
  };

  const convertShamsiToMiladi = (shamsiDate) => {
    return moment(shamsiDate, "jYYYY/jMM/jDD").format("YYYY-MM-DD");
  };

  const handleDatePick = (newDate) => {
    setDate(newDate);
    const shamsiDate = moment(newDate).format("jYYYY/jMM/jDD");
    setSelectedDate(shamsiDate);
    const miladiDate = convertShamsiToMiladi(shamsiDate);
    setSelectedMiladiDate(miladiDate);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setDate(value);
  };

  useEffect(() => {
    document.title = " اطلاعات کارت به کارت";
    const generateBillNo = nanoid();
    setBillNo(generateBillNo);
    const today = moment().format("jYYYY/jMM/jDD");
    setSelectedDate(today);
    setSelectedMiladiDate(today);
    setDate(today);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(event.target) &&
        inputRef.current &&
        !inputRef.current.contains(event.target)
      ) {
        setShowCal(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [inputRef, calendarRef]);

  return (
    <div className={classes.main}>
      <BannerCarousel />
      <Header windowSize={widnowSize} />
      <Body>
        <Card className={classes.card}>
          <Breadcrumbs
            linkDataProp={[
              { pathname: t("home"), url: " " },
              { pathname: t("payment"), url: "shopbyshape" },
            ]}
          />
          <div className={classes.payment_dest_wrapper}>
            <ul>
              <li>
                شماره کارت مقصد : <span dir="ltr">6274 8812 0101 8834</span>
              </li>
              <li> نام گیرنده وجه : امیر مسعود سراج زاده </li>
              <li> نام بانک : بانک کار آفرین </li>
            </ul>{" "}
            <div className={classes.logo_wrapper}>
              <img src={karafarinLogo} alt="" />
            </div>
          </div>
          <form onSubmit={handleSubmit} className={classes.form}>
            <div className={classes.ep}>
              <Autocomplete
                id="doc-type"
                disablePortal
                size="small"
                sx={inputStyles}
                value={DocType}
                options={paymentMethods || []}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={"نوع سند"}
                    error={isError && !DocType}
                    name="doc-type"
                    required
                  />
                )}
                onInputChange={(e, value) => {
                  setDocType(value);
                }}
                onChange={(e, newValue) => {
                  setDocType(newValue);
                }}
                onFocus={() => setIsError(false)}
              />
              <TextField
                id="amount"
                name="amount"
                label={"مبلغ"}
                type="text"
                size="small"
                sx={inputStyles}
                required
                onChange={(e) => {
                  const value = e.target.value;
                  const numericValue = value.replace(/[^0-9]/g, "");
                  setAmount(numericValue);
                }}
                onFocus={() => setIsError(false)}
                error={isError && !amount}
                value={formatNumber(amount)}
              />
              {showCal && (
                <div ref={calendarRef} className={classes.calendarWrapper}>
                  <Calendar
                    onChange={handleDatePick}
                    calendarType="islamic"
                    locale="fa"
                    value={moment(selectedDate, "jYYYY/jMM/jDD").toDate()}
                    className={classes.cal}
                  />
                </div>
              )}
              <TextField
                id="date"
                name="date"
                label={"تاریخ"}
                required
                type="text"
                size="small"
                sx={inputStyles}
                onChange={handleInputChange}
                onFocus={() => {
                  setIsError(false);
                  setShowCal(true);
                }}
                error={isError && !date}
                value={selectedDate}
                className="calendar_parent"
                ref={inputRef}
              />
              <TextField
                id="recNo"
                name="recNo"
                label={"شماره فیش"}
                required
                type="text"
                size="small"
                sx={inputStyles}
                onChange={(e) => {
                  setRecNo(e.target.value);
                }}
                onFocus={() => setIsError(false)}
                error={isError && !recNo}
                value={recNo}
              />
              <TextField
                id="bankName"
                name="bankName"
                label={"بانک مبدا"}
                required
                disablePortal
                size="small"
                sx={inputStyles}
                value={BankName}
                onChange={(e) => {
                  setBankName(e.target.value);
                }}
                onFocus={() => setIsError(false)}
              />
              <TextField
                id="last-four"
                name="last-four"
                label={"چهار رقم آخر شماره کارت"}
                required
                type={"text"}
                size="small"
                sx={inputStyles}
                onChange={(e) => {
                  const value = e.target.value;
                  const numericValue = value.replace(/[^0-9]/g, "");
                  setLastFour(numericValue);
                }}
                value={lastFour}
                onFocus={() => setIsError(false)}
                error={isError && !lastFour}
                inputProps={{ maxLength: 4 }}
              />

              <Input
                id="file"
                type="file"
                name="file"
                size="small"
                sx={{
                  ...inputStyles,
                }}
                onChange={(e) => setRecScan(e.target.files[0])}
              />
              <TextField
                id="descriptionn"
                name="description"
                label={"توضیحات"}
                value={description}
                type="text"
                size="small"
                sx={{
                  ...inputStyles,
                }}
                onChange={(e) => {
                  setDescription(e.target.value);
                }}
              />

              <div
                className={classes.error_text}
                style={{
                  direction: "rtl",
                  opacity: isError ? 1 : 0,
                }}
              >
                لطفا مقادیر بالا را وارد کنید
              </div>
              <div className={classes.button_wrapper}>
                <Button
                  variant="contained"
                  size="large"
                  className={classes.submit}
                  type="submit"
                  endIcon={
                    <Send
                      sx={{ rotate: "-45deg", mt: "-5px", ml: "8px" }}
                      fontSize="15px"
                    />
                  }
                  sx={{
                    "& .MuiButton-endIcon": {
                      marginRight: "8px",
                      marginLeft: 0,
                    },
                  }}
                >
                  ارسال اطلاعات
                </Button>
                <Link
                  variant="contained"
                  size="large"
                  className={classes.back}
                  type="submit"
                  to={`/${lng}/precheckout`}
                >
                  بازگشت به سبد خرید
                  <ArrowBackIosNew
                    sx={{ fontSize: "15px", mx: "10px", mr: 0 }}
                  />
                </Link>
              </div>
            </div>
          </form>
        </Card>
      </Body>
      <Footer />
    </div>
  );
};

export default PayByCart;
