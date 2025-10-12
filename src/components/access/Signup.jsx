import { Google, Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Autocomplete,
  Button,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";
import { useGoogleLogin } from "@react-oauth/google";
import { useEffect, useRef, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import Flag from "react-world-flags";

import { accesModalActions, signupActions } from "../../store/store";
import {
  getCitiesByState,
  getStatesByCountry,
  sendRegistrationData,
  useAllCountries,
} from "../../services/api";
import logo from "../../assets/images/logo_trasnparent.png";
import { ReactComponent as Close } from "../../assets/svg/close.svg";
import LoadingSpinner from "../common/LoadingSpinner";

import classes from "./Signup.module.css";

const Signup = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const lng = useSelector((state) => state.localeStore.lng);
  const { data: countryData, isLoading: isLoadingCountries } =
    useAllCountries();
  const inputStyles = {
    direction: lng === "fa" ? "rtl" : "ltr",
    mb: "0.5rem",
    "& .MuiInputBase-root": {
      "& fieldset": {
        borderColor: "black",
      },
    },
    "& .MuiInputBase-input": {
      color: "rgb(0, 0, 0)",
      fontSize: "16px",
    },
    "& .MuiInputLabel-root": {
      color: "gray",
      fontSize: "14px",
    },
    "& .Mui-focused .MuiInputLabel-root": {
      color: "black",
      transform: "translate(0, -5px) scale(0.75)",
    },
    "& .Mui-focused .MuiInputBase-root": {
      "& fieldset": {
        borderColor: "black",
      },
    },
  };

  // Form state
  const [formValues, setFormValues] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    repeatPassword: "",
    phoneCode: "",
    phoneNumber: "",
  });
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [cityData, setCityData] = useState([]);
  const [selectedState, setSelectedState] = useState(null);
  const [stateData, setStateData] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState("");

  const abortControllerRef = useRef(new AbortController());
  const isRTL = lng === "fa" ? true : false;

  // Load saved data from localStorage
  useEffect(() => {
    const storedData = localStorage.getItem("sis");
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        if (parsedData) {
          setFormValues({
            firstname: parsedData.firstname || "",
            lastname: parsedData.lastname || "",
            email: parsedData.email || "",
            password: parsedData.password || "",
            repeatPassword: parsedData.repeatPassword || "",
            phoneCode: parsedData.phoneCode || "",
            phoneNumber: parsedData.phonenumber || "",
          });
          setSelectedCountry(parsedData.selectedCountry || null);
          setSelectedCity(parsedData.selectedCity || null);
        }
      } catch (error) {
        console.error("Failed to parse stored data:", error);
      }
    }
  }, []);

  // Fetch cities when country changes
  useEffect(() => {
    const controller = new AbortController();
    abortControllerRef.current = controller;

    if (selectedCountry?.id) {
      const fetchStates = async () => {
        try {
          const serverRes = await getStatesByCountry(
            selectedCountry.id,
            controller.signal
          );
          if (serverRes.response.ok) {
            setStateData(serverRes.result.data);
          }
        } catch (error) {
          if (error.name !== "AbortError") {
            console.error("Failed to fetch cities:", error);
          }
        }
      };

      fetchStates();
      setFormValues((prev) => ({
        ...prev,
        phoneCode: `+${selectedCountry.phonecode || ""}`,
      }));
    }

    return () => controller.abort();
  }, [selectedCountry]);

useEffect(() => {
  const controller = new AbortController();
  abortControllerRef.current = controller;

  if (selectedState?.id) {
    const fetchCities = async () => {
      try {
        const serverRes = await getCitiesByState(
          selectedState.id,
          controller.signal
        );
        if (serverRes.response.ok) {
          setCityData(serverRes.result.data);
        }
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Failed to fetch cities:", error);
        }
      }
    };

    fetchCities();
    // Phone code should only come from the country, not the state
  }

  return () => controller.abort();
}, [selectedState]);

  const handleInputChange = (field) => (e) => {
    setFormValues((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handlePhoneCodeChange = (e) => {
    const value = e.target.value.startsWith("+")
      ? e.target.value
      : `+${e.target.value}`;
    setFormValues((prev) => ({ ...prev, phoneCode: value }));

    const inputCode = value.split("+").at(1);
    if (inputCode && countryData) {
      const foundCountry = countryData.find(
        (elem) => elem.phonecode === inputCode
      );
      setSelectedCountry(foundCountry || null);
    }
  };

  const handlePhoneNumberChange = (e) => {
    const numericValue = e.target.value.replace(/[^0-9]/g, "");
    setFormValues((prev) => ({ ...prev, phoneNumber: numericValue }));
  };

  const validateForm = () => {
    const newErrors = {};

    // Required fields validation
    if (!formValues.firstname.trim())
      newErrors.firstname = t("signup.required_field");
    if (!formValues.lastname.trim())
      newErrors.lastname = t("signup.required_field");
    if (!formValues.email.trim()) newErrors.email = t("signup.required_field");
    if (!formValues.password) newErrors.password = t("signup.required_field");
    if (!formValues.repeatPassword)
      newErrors.repeatPassword = t("signup.required_field");
    if (!formValues.phoneNumber)
      newErrors.phoneNumber = t("signup.required_field");
    if (!selectedCountry) newErrors.country = t("signup.required_field");
    if (!selectedCity) newErrors.city = t("signup.required_field");

    // Password validation
    if (formValues.password.length < 8) {
      newErrors.password = t("signup.err_8char");
    }

    if (formValues.password !== formValues.repeatPassword) {
      newErrors.repeatPassword = t("signup.err_notm");
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formValues.email && !emailRegex.test(formValues.email)) {
      newErrors.email = t("signup.invalid_email");
    }

    if (!recaptchaToken) {
      newErrors.recaptcha = t("signup.verify_captcha");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setIsLoading(true);

      const payload = {
        first_name: formValues.firstname,
        last_name: formValues.lastname,
        email: formValues.email,
        password: formValues.password,
        password_confirmation: formValues.repeatPassword,
        cellphone: formValues.phoneNumber,
        city_id: selectedCity.id,
        country_id: selectedCountry.id,
        recaptcha_token: recaptchaToken,
      };

      // Save form data to localStorage and Redux
      const formState = {
        ...formValues,
        selectedCountry,
        selectedCity,
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem("sis", JSON.stringify(formState));
      dispatch(signupActions.set(formState));

      // Submit data to API
      const serverRes = await sendRegistrationData(payload);
      if (serverRes.response.ok) {
        dispatch(accesModalActions.otp());
      } else {
        setErrors(serverRes.result.errors || { general: t("trylater") });
      }
    } catch (error) {
      console.error("Registration failed:", error);
      setErrors({ general: t("trylater") });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setIsLoading(true);
        const userInfo = await fetch(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
          }
        ).then((res) => res.json());

        // Handle Google login success
        // Implement your Google OAuth integration here
      } catch (error) {
        console.error("Google login failed:", error);
        setErrors({ general: t("login.google_error") });
      } finally {
        setIsLoading(false);
      }
    },
    onError: () => {
      setErrors({ general: t("login.google_error") });
    },
  });

  const handleCloseModal = () => {
    dispatch(accesModalActions.close());
  };

  const handleGoToLogin = () => {
    dispatch(accesModalActions.login());
  };

  const filterExactMatch = (options, { inputValue }) => {
    if (!inputValue) return options;
    const lowerInputValue = inputValue.toLowerCase();
    return options.filter((option) =>
      option.label.toLowerCase().includes(lowerInputValue)
    );
  };

  return (
    <div className={classes.content_wrapper} dir={isRTL ? "rtl" : "ltr"}>
      <div className={classes.sheet}>
        <div className={classes.logo_wrapper}>
          <img className={classes.logo} src={logo} alt="" loading="lazy" />
        </div>

        <div className={classes.login_wrapper}>
          <div className={classes.actions}>
            <form onSubmit={handleSubmit} className={classes.form}>
              <div className={classes.ep}>
                {/* First Name */}
                <TextField
                  id="signup-firstname-input"
                  name="firstname"
                  label={t("signup.fname")}
                  value={formValues.firstname}
                  onChange={handleInputChange("firstname")}
                  error={!!errors.firstname}
                  size="small"
                  sx={inputStyles}
                  disabled={isLoading}
                />

                {/* Last Name */}
                <TextField
                  id="signup-lastname-input"
                  name="lastname"
                  label={t("signup.lname")}
                  value={formValues.lastname}
                  onChange={handleInputChange("lastname")}
                  error={!!errors.lastname}
                  size="small"
                  sx={inputStyles}
                  disabled={isLoading}
                />

                {/* Email */}
                <TextField
                  id="signup-email-input"
                  name="email"
                  label={t("signup.email")}
                  type="email"
                  value={formValues.email}
                  onChange={handleInputChange("email")}
                  error={!!errors.email}
                  size="small"
                  sx={inputStyles}
                  disabled={isLoading}
                />

                {/* Password */}
                <TextField
                  id="signup-password-input"
                  name="password"
                  label={t("signup.password")}
                  type={showPassword ? "text" : "password"}
                  value={formValues.password}
                  onChange={handleInputChange("password")}
                  error={!!errors.password}
                  size="small"
                  sx={inputStyles}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="show"
                          style={{
                            width: "20px",
                            height: "auto",
                            display: lng !== "fa" ? "flex" : "none",
                          }}
                          onClick={() => setShowPassword(!showPassword)}
                          disableRipple
                        >
                          {showPassword ? (
                            <Visibility fontSize="5" />
                          ) : (
                            <VisibilityOff fontSize="5" />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                    startAdornment: (
                      <InputAdornment position="start">
                        <IconButton
                          aria-label="show"
                          style={{
                            width: "20px",
                            height: "auto",
                            display: lng === "fa" ? "flex" : "none",
                          }}
                          onClick={() => setShowPassword(!showPassword)}
                          disableRipple
                        >
                          {showPassword ? (
                            <Visibility fontSize="5" />
                          ) : (
                            <VisibilityOff fontSize="5" />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  disabled={isLoading}
                />

                {/* Repeat Password */}
                <TextField
                  id="signup-rpassword-input"
                  name="repeatPassword"
                  label={`${t("signup.repeat")} ${t("signup.password")}`}
                  type="password"
                  value={formValues.repeatPassword}
                  onChange={handleInputChange("repeatPassword")}
                  error={!!errors.repeatPassword}
                  size="small"
                  sx={inputStyles}
                  disabled={isLoading}
                />

                {/* Country Select */}
                <Autocomplete
                  id="country-autocomplete"
                  options={countryData || []}
                  value={selectedCountry}
                  onChange={(_, newValue) => setSelectedCountry(newValue)}
                  getOptionLabel={(option) => option.label || ""}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={t("signup.country")}
                      error={!!errors.country}
                      size="small"
                      sx={inputStyles}
                    />
                  )}
                  disabled={isLoading || isLoadingCountries}
                  loading={isLoadingCountries}
                />

                {/* State Select */}
                <Autocomplete
                  id="State-autocomplete"
                  options={stateData || []}
                  value={selectedState}
                  onChange={(_, newValue) => setSelectedState(newValue)}
                  getOptionLabel={(option) => option.label || ""}
                  filterOptions={filterExactMatch}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={t("signup.state")}
                      error={!!errors.state}
                      size="small"
                      sx={inputStyles}
                    />
                  )}
                  disabled={isLoading || !selectedCountry}
                />

                {/* City Select */}
                <Autocomplete
                  id="city-autocomplete"
                  options={cityData || []}
                  value={selectedCity}
                  onChange={(_, newValue) => setSelectedCity(newValue)}
                  getOptionLabel={(option) => option.label || ""}
                  filterOptions={filterExactMatch}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={t("signup.city")}
                      error={!!errors.city}
                      size="small"
                      sx={inputStyles}
                    />
                  )}
                  disabled={isLoading || !selectedCountry}
                />

                {/* Phone Input */}
                <div className={classes.phone_wrapper}>
                  <TextField
                    id="phone-code-input"
                    value={formValues.phoneCode}
                    onChange={handlePhoneCodeChange}
                    size="small"
                    sx={{ width: "30%", ...inputStyles }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          {selectedCountry?.alias && (
                            <Flag
                              code={selectedCountry.alias}
                              style={{ width: "20px", height: "auto" }}
                            />
                          )}
                        </InputAdornment>
                      ),
                    }}
                    placeholder="+"
                    disabled={isLoading}
                  />
                  <TextField
                    id="phone-number-input"
                    name="phoneNumber"
                    label={t("signup.pnumber")}
                    value={formValues.phoneNumber}
                    onChange={handlePhoneNumberChange}
                    error={!!errors.phoneNumber}
                    size="small"
                    sx={{ width: "68%", ...inputStyles }}
                    disabled={isLoading}
                  />
                </div>

                {/* ReCAPTCHA */}
                <ReCAPTCHA
                  sitekey={process.env.REACT_APP_GOOGLE_RECAPTCHA_CLIENT_ID}
                  onChange={(token) => setRecaptchaToken(token)}
                  onErrored={() =>
                    setErrors((prev) => ({
                      ...prev,
                      recaptcha: t("signup.verify_captcha"),
                    }))
                  }
                  className={classes.rec}
                />
                {errors.recaptcha && (
                  <div
                    className={classes.error_text}
                    style={{ direction: isRTL ? "rtl" : "ltr" }}
                  >
                    {errors.recaptcha}
                  </div>
                )}

                {/* General Errors */}
                {errors.general && (
                  <div
                    className={classes.error_text}
                    style={{ direction: isRTL ? "rtl" : "ltr" }}
                  >
                    {errors.general}
                  </div>
                )}

                {/* Submit Button */}
                <Button
                  variant="contained"
                  size="large"
                  className={classes.login_btn}
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <LoadingSpinner size="20px" />
                  ) : (
                    t("signup.sign_up")
                  )}
                </Button>
              </div>
            </form>

            {/* Google Login */}
            <div className={classes.oneclick_login_wrapper}>
              <div className={classes.google_login_wrapper}>
                <IconButton
                  className={classes.mobile_login}
                  onClick={handleGoogleLogin}
                  disabled={isLoading}
                >
                  <Google sx={{ fontSize: "20px !important" }} />
                  <p>{t("access.swg")}</p>
                </IconButton>
              </div>
            </div>

            {/* Login Link */}
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
        </div>

        {/* Close Button */}
        <IconButton
          className={classes.close_btn}
          onClick={handleCloseModal}
          disabled={isLoading}
        >
          <Close width={30} height={30} />
        </IconButton>
      </div>
    </div>
  );
};

export default Signup;
