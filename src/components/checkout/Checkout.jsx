import { Add } from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Autocomplete,
  Button,
  FormControl,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import Flag from "react-world-flags";
import {
  addAddress,
  getAllAddresses,
  getCitiesByState,
  getStatesByCountry,
  useAllCountries,
  getDeliveryMethods,
  getShoppingCart,
} from "../../services/api";
import { cartActions } from "../../store/store";
import { notify } from "../../utils/helperFunctions";
import classes from "./Checkout.module.css";
import LoadingSpinner from "../common/LoadingSpinner";

const inputStyles = {
  mb: "0.5rem",
  width: "49%",
  "& .MuiInputBase-root": {
    "& fieldset": {
      borderColor: "#000000",
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
    color: "#000000",
    transform: "translate(0, -5px) scale(0.75)",
  },
  "& .Mui-focused .MuiInputBase-root": {
    "& fieldset": {
      borderColor: "#000000",
    },
  },
};

const Checkout = ({ isDataValid, sendOrderData }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const lng = useSelector((state) => state.localeStore.lng);
  const token = useSelector((state) => state.userStore.token);
  const selectedDeliveryMethod = useSelector(
    (state) => state.cartStore.deliveryMethod
  );
  const formRef = useRef();

  const {
    data: countryData,
    isLoading: isLoadingAllCountries,
    isError: isErrorAllCountries,
  } = useAllCountries();

  // Form state
  const [formValues, setFormValues] = useState({
    firstname: "",
    lastname: "",
    secondaryPhoneN: "",
    Address: "",
    postalCode: "",
  });

  const [selectedState, setSelectedState] = useState(null);
  const [stateData, setStateData] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [cityData, setCityData] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [phoneCode, setPhoneCode] = useState("");
  const [isError, setIsError] = useState(false);
  const [deliveryMethods, setDeliveryMethods] = useState(null);
  const [isLoadingDeliveryMethods, setisLoadingDeliveryMethods] =
    useState(true);

  const [addressOptions, setAddressOptions] = useState([]);
  const [isLoadingOptions, setIsLoadingOptions] = useState(true);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);

  const getStates = async (param) => {
    const serverRes = await getStatesByCountry(param);
    if (serverRes.response.ok) {
      setStateData(serverRes.result.data);
    }
  };

  const getCities = async (p) => {
    const serverRes = await getCitiesByState(p);
    if (serverRes.response.ok) {
      setCityData(serverRes.result.data);
    }
  };

  useEffect(() => {
    if (selectedCountry?.id) {
      const fetchStates = async () => {
        try {
          const serverRes = await getStatesByCountry(selectedCountry.id);
          if (serverRes.response.ok) {
            setStateData(serverRes.result.data);
          }
        } catch (error) {
          console.error("Failed to fetch cities:", error);
        }
      };
      fetchStates();
      setPhoneCode(selectedCountry.phonecode || "");
    }
  }, [selectedCountry]);

  useEffect(() => {
    if (selectedState) {
      getCities(selectedState.id);
    }
    return () => {};
  }, [selectedState]);

  useEffect(() => {
    const loadAddresses = async () => {
      try {
        setIsLoadingOptions(true);
        const serverRes = await getAllAddresses(token);
        if (serverRes.response.ok) {
          const formattedOptions = serverRes.result.address.map((address) => ({
            id: address.id,
            label: address.address,
          }));
          setAddressOptions(formattedOptions);
        }
      } catch (error) {
        console.error("Failed to load addresses:", error);
      } finally {
        setIsLoadingOptions(false);
      }
    };
    loadAddresses();
  }, [token]);

  const fetchCartPrice = async (address_id, delivery_method_id) => {
    const { response, result } = await getShoppingCart(
      token,
      address_id,
      delivery_method_id
    );

    dispatch(cartActions.setProductPrice(result.cart_total.total_price));
    const deliveryPrice = result.cart_total.delivery_price;
    dispatch(
      cartActions.setDeliveryMethodPrice(
        typeof deliveryPrice === "number" ? deliveryPrice : 0
      )
    );
  };

  useEffect(() => {
    if (selectedAddress && selectedDeliveryMethod) {
      fetchCartPrice(selectedAddress.id, selectedDeliveryMethod);
      dispatch(cartActions.setSelectedAddress(selectedAddress.id));
      isDataValid(true);
    } else {
      isDataValid(false);
    }
  }, [selectedAddress, selectedDeliveryMethod, dispatch]);

  const handleInputChange = (field) => (e) => {
    setFormValues((prev) => ({ ...prev, [field]: e.target.value }));
    if (isError) setIsError(false);
  };

  const handlePhoneNumberChange = (e) => {
    const numericValue = e.target.value.replace(/[^0-9]/g, "");
    setFormValues((prev) => ({ ...prev, secondaryPhoneN: numericValue }));
  };

  const handlePostalCodeChange = (e) => {
    const numericValue = e.target.value.replace(/[^0-9]/g, "");
    const formattedValue = numericValue.replace(/(\d{3})(?=\d)/g, "$1 ");
    setFormValues((prev) => ({ ...prev, postalCode: formattedValue }));
  };

  const validateForm = () => {
    const requiredFields = [
      formValues.firstname?.trim(),
      formValues.lastname?.trim(),
      formValues.Address?.trim(),
      selectedCity?.label?.trim(),
      formValues.secondaryPhoneN?.trim(),
      formValues.postalCode?.trim(),
    ];
    return requiredFields.every((field) => field && field.length > 0);
  };

  const resetForm = () => {
    setFormValues({
      firstname: "",
      lastname: "",
      secondaryPhoneN: "",
      Address: "",
      postalCode: "",
    });
    setSelectedCity(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setIsError(true);
      return;
    }

    try {
      const response = await addAddress(
        token,
        `${formValues.firstname} ${formValues.lastname}`,
        formValues.secondaryPhoneN,
        formValues.Address,
        selectedCity.id,
        formValues.postalCode
      );

      if (response.response.ok) {
        const addressesRes = await getAllAddresses(token);
        if (addressesRes.response.ok) {
          const formattedOptions = addressesRes.result.address.map(
            (address) => ({
              id: address.id,
              label: address.address,
            })
          );
          setAddressOptions(formattedOptions);
          notify(t("profile.suc_add_add"));
          resetForm();
        }
      }
    } catch (error) {
      console.error("Failed to add address:", error);
      notify(t("profile.err_add_add"));
    }
  };

  const filterExactMatch = (options, { inputValue }) => {
    if (!inputValue) return options;
    const lowerInputValue = inputValue.toLowerCase();
    return options.filter((option) =>
      option.label.toLowerCase().includes(lowerInputValue)
    );
  };

  const handleGetDeliveryMethods = async () => {
    try {
      setisLoadingDeliveryMethods(true);
      const { response, result } = await getDeliveryMethods();
      if (response.ok) {
        setDeliveryMethods(result.data);
      }
    } catch (error) {
      console.log(error);
      setisLoadingDeliveryMethods(false);
    } finally {
      setisLoadingDeliveryMethods(false);
    }
  };

  const handleSetSeletedDeliveryMethod = (id) => {
    dispatch(cartActions.setDeliveryMethod(id));
  };

  useEffect(() => {
    handleGetDeliveryMethods();
  }, []);

  return (
    <div className={classes.main}>
      {/* Address Column */}
      <div style={{ margin: "auto" }}>
        <Autocomplete
          id="address-autocomplete"
          disablePortal
          size="medium"
          sx={{ ...inputStyles, width: "100%", mb: "2rem" }}
          options={addressOptions}
          loading={isLoadingOptions}
          value={selectedAddress}
          onChange={(_, newValue) => setSelectedAddress(newValue)}
          renderInput={(params) => (
            <TextField
              {...params}
              label={t("profile.address")}
              placeholder={
                isLoadingOptions
                  ? t("profile.loading_addresses")
                  : addressOptions.length === 0
                  ? t("profile.no_addresses")
                  : ""
              }
            />
          )}
        />

        <Accordion sx={{ boxShadow: "none" }}>
          <AccordionSummary
            expandIcon={<Add fontSize="small" />}
            aria-controls="address-content"
            id="address-header"
          >
            <Typography
              component="span"
              style={{ fontSize: ".7rem", fontWeight: "bold" }}
              variant="h1"
            >
              {t("profile.add_add")}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <form
              ref={formRef}
              onSubmit={handleSubmit}
              className={classes.form}
            >
              <FormControl fullWidth>
                <div className={classes.input_wrapper}>
                  <TextField
                    id="signup-firstname-input"
                    name="firstname"
                    label={`${t("pc.receiver")} ${t("signup.fname")}`}
                    value={formValues.firstname}
                    onChange={handleInputChange("firstname")}
                    error={isError && !formValues.firstname}
                    size="medium"
                    sx={inputStyles}
                  />
                  <TextField
                    id="signup-lastname-input"
                    name="lastname"
                    label={`${t("pc.receiver")} ${t("signup.lname")}`}
                    value={formValues.lastname}
                    onChange={handleInputChange("lastname")}
                    error={isError && !formValues.lastname}
                    size="medium"
                    sx={inputStyles}
                  />
                </div>
                <div className={classes.input_wrapper}>
                  <Autocomplete
                    id="country-autocomplete"
                    sx={{ width: "49%" }}
                    options={countryData || []}
                    value={selectedCountry}
                    onChange={(_, newValue) => setSelectedCountry(newValue)}
                    getOptionLabel={(option) => option.label || ""}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label={t("signup.country")}
                        error={isError && !selectedCountry}
                        size="medium"
                        sx={{ ...inputStyles, width: "100%" }}
                      />
                    )}
                    loading={isLoadingAllCountries}
                  />

                  <Autocomplete
                    id="state-autocomplete"
                    sx={{ width: "49%" }}
                    options={stateData || []}
                    value={selectedState}
                    onChange={(_, newValue) => setSelectedState(newValue)}
                    getOptionLabel={(option) => option.label || ""}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label={t("signup.state")}
                        error={isError && !selectedCountry}
                        size="medium"
                        sx={{ ...inputStyles, width: "100%" }}
                      />
                    )}
                    loading={isLoadingAllCountries}
                  />
                </div>

                <Autocomplete
                  id="city-autocomplete"
                  options={cityData || []}
                  value={selectedCity}
                  onChange={(_, newValue) => setSelectedCity(newValue)}
                  filterOptions={filterExactMatch}
                  getOptionLabel={(option) => option.label || ""}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={t("signup.city")}
                      error={isError && !selectedCity}
                      size="medium"
                      sx={{ ...inputStyles, width: "49%" }}
                    />
                  )}
                />

                <div className={classes.input_wrapper}>
                  <span className={classes.phone_wrapper}>
                    <TextField
                      id="phone-code-input"
                      value={`+${phoneCode}`}
                      size="medium"
                      sx={{ ...inputStyles, width: "30%" }}
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
                      disabled
                    />
                    <TextField
                      id="phone-number-input"
                      label={t("signup.pnumber")}
                      value={formValues.secondaryPhoneN}
                      onChange={handlePhoneNumberChange}
                      error={isError && !formValues.secondaryPhoneN}
                      size="medium"
                      sx={{ ...inputStyles, width: "68%" }}
                    />
                  </span>
                  <TextField
                    id="signup-postalcode-input"
                    name="postalcode"
                    label={t("pc.postalcode")}
                    value={formValues.postalCode}
                    onChange={handlePostalCodeChange}
                    error={isError && !formValues.postalCode}
                    size="medium"
                    sx={inputStyles}
                  />
                </div>
                <TextField
                  id="signup-address-input"
                  name="address"
                  label={t("signup.adress")}
                  value={formValues.Address}
                  onChange={handleInputChange("Address")}
                  error={isError && !formValues.Address}
                  size="medium"
                  sx={{ ...inputStyles, width: "100%" }}
                />
              </FormControl>
              <div
                className={classes.error_text}
                style={{
                  direction: lng === "fa" ? "rtl" : "ltr",
                  opacity: isError ? 1 : 0,
                }}
              >
                {t("signup.fillout")}
              </div>
              <Button variant="contained" type="submit" className={classes.btn}>
                {t("pc.submit")}
              </Button>
            </form>
          </AccordionDetails>
        </Accordion>
      </div>

      {/* Payment Column */}
      <div style={{ width: "100%" }} dir={lng === "fa" ? "rtl" : "ltr"}>
        <Typography
          variant="h6"
          component="h2"
          sx={{ fontWeight: "bold", mb: 2, fontSize: "1rem" }}
        >
          {t("profile.delivery")}
        </Typography>
        {isLoadingDeliveryMethods ? (
          <LoadingSpinner />
        ) : (
          <div className={classes.payment_options_wrapper}>
            {deliveryMethods &&
              deliveryMethods.map((method) => (
                <div
                  key={method.id}
                  className={`${classes.payment_option} ${
                    selectedDeliveryMethod === method.id ? classes.selected : ""
                  }`}
                  onClick={() => handleSetSeletedDeliveryMethod(method.id)}
                  role="button"
                  tabIndex={0}
                  aria-pressed={selectedDeliveryMethod === method.id}
                >
                  <img
                    src={method.image}
                    alt={method?.alt}
                    className={classes.payment_image}
                  />
                  <Typography
                    variant="caption"
                    className={classes.payment_name}
                  >
                    {method.name}
                  </Typography>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Checkout;
