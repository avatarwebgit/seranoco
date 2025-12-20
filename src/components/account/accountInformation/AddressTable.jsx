import {
  Autocomplete,
  Button,
  FormControl,
  InputAdornment,
  TextField,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";

import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

import { notify } from "../../../utils/helperFunctions";

import Flag from "react-world-flags";
import {
  addAddress,
  getCitiesByState,
  getStatesByCountry,
  useAllCountries,
} from "../../../services/api";
import classes from "./AddressTable.module.css";

const AddressTable = ({ formData, refetch }) => {
  const lng = useSelector((state) => state.localeStore.lng);
  const token = useSelector((state) => state.userStore.token);
  const { data: countryData, isLoading: isLoadingCountries } =
    useAllCountries();

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

  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [secondaryPhoneN, setSecondaryPhoneN] = useState("");
  const [phoneCode, setPhoneCode] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [stateData, setStateData] = useState([]);
  const [selectedState, setSelectedState] = useState(null);
  const [cityData, setCityData] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [Address, setAddress] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [isError, setIsError] = useState(false);

  const formRef = useRef();
  const { t } = useTranslation();

  const getStates = async (countryId) => {
    if (!countryId) return;
    const serverRes = await getStatesByCountry(countryId);
    if (serverRes.response.ok) {
      setStateData(serverRes.result.data);
    }
  };

  const getCities = async (stateId) => {
    if (!stateId) return;
    const serverRes = await getCitiesByState(stateId);
    if (serverRes.response.ok) {
      setCityData(serverRes.result.data);
    }
  };

  useEffect(() => {
    if (formData) {
      if (formData?.title?.split(" ")) {
        setFirstname(formData.title.split(" ").at(0) || "");
        setLastname(formData.title.split(" ").at(1) || "");
      }
      setAddress(formData.address || "");
      setSecondaryPhoneN(formData.cellphone || "");
      setPostalCode(formData.postal_code || "");
    }
  }, [formData]);

  useEffect(() => {
    if (selectedCountry) {
      getStates(selectedCountry.id);
      setPhoneCode(selectedCountry.phonecode);
      setSelectedState(null);
      setSelectedCity(null);
      setCityData([]);
    }
  }, [selectedCountry]);

  useEffect(() => {
    if (selectedState) {
      getCities(selectedState.id);
      setSelectedCity(null);
    }
  }, [selectedState]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const requiredFields = [
      firstname?.trim(),
      lastname?.trim(),
      Address?.trim(),
      selectedCity?.id,
      secondaryPhoneN?.trim(),
      postalCode?.trim(),
    ];

    const isValid = requiredFields.every((field) => field);

    if (!isValid) {
      setIsError(true);
    } else {
      setIsError(false);
      addAddress(
        token,
        `${firstname} ${lastname}`,
        secondaryPhoneN,
        Address,
        selectedCity.id,
        postalCode
      ).then((res) => {
        if (res.response.ok) {
          notify(t("profile.suc_add_add"));
          if (refetch) refetch();
          resetInput();
        } else {
          notify(t("profile.err_add_add"));
        }
      });
    }
  };

  const resetInput = () => {
    setFirstname("");
    setLastname("");
    setSecondaryPhoneN("");
    setSelectedCountry(null);
    setSelectedState(null);
    setSelectedCity(null);
    setAddress("");
    setPostalCode("");
    setStateData([]);
    setCityData([]);
  };

  return (
    <div className={`${classes.main} ${formData ? classes.form : ""}`}>
      <form ref={formRef} onSubmit={handleSubmit} className={classes.form}>
        <FormControl fullWidth>
          <div className={classes.input_wrapper}>
            <TextField
              label={t("pc.receiver") + " " + t("signup.fname")}
              sx={inputStyles}
              onChange={(e) => setFirstname(e.target.value)}
              onFocus={() => setIsError(false)}
              error={isError && !firstname}
              value={firstname}
            />
            <TextField
              label={t("pc.receiver") + " " + t("signup.lname")}
              sx={inputStyles}
              onChange={(e) => setLastname(e.target.value)}
              onFocus={() => setIsError(false)}
              error={isError && !lastname}
              value={lastname}
            />
          </div>

          <div className={classes.input_wrapper}>
            <Autocomplete
              options={countryData || []}
              sx={inputStyles}
              value={selectedCountry}
              getOptionLabel={(option) => option.label || ""}
              loading={isLoadingCountries}
              onChange={(_, newValue) => setSelectedCountry(newValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={t("signup.country")}
                  error={isError && !selectedCountry}
                />
              )}
            />
            <Autocomplete
              options={stateData || []}
              sx={inputStyles}
              value={selectedState}
              getOptionLabel={(option) => option.label || ""}
              disabled={!selectedCountry}
              onChange={(_, newValue) => setSelectedState(newValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={t("signup.state")}
                  error={isError && !selectedState}
                />
              )}
            />
          </div>

          <div className={classes.input_wrapper}>
            <Autocomplete
              options={cityData || []}
              sx={inputStyles}
              value={selectedCity}
              getOptionLabel={(option) => option.label || ""}
              disabled={!selectedState}
              onChange={(_, newValue) => setSelectedCity(newValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={t("signup.city")}
                  error={isError && !selectedCity}
                />
              )}
            />
            <TextField
              label={t("pc.postalcode")}
              sx={inputStyles}
              onChange={(e) => {
                const val = e.target.value.replace(/[^0-9]/g, "");
                setPostalCode(val.replace(/(\d{3})(?=\d)/g, "$1 "));
              }}
              onFocus={() => setIsError(false)}
              error={isError && !postalCode}
              value={postalCode}
            />
          </div>

          <div className={classes.input_wrapper}>
            <span className={classes.phone_wrapper}>
              <TextField
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
                value={phoneCode ? `+${phoneCode}` : ""}
                placeholder="+"
                readOnly
              />
              <TextField
                label={t("signup.pnumber")}
                value={secondaryPhoneN}
                sx={{ ...inputStyles, width: "68%" }}
                onChange={(e) =>
                  setSecondaryPhoneN(e.target.value.replace(/[^0-9]/g, ""))
                }
                error={isError && !secondaryPhoneN}
              />
            </span>
            <TextField
              label={t("signup.adress")}
              sx={{ ...inputStyles, width: "49%" }}
              onChange={(e) => setAddress(e.target.value)}
              onFocus={() => setIsError(false)}
              error={isError && !Address}
              value={Address}
            />
          </div>
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

        {!formData && (
          <Button variant="contained" type="submit" className={classes.btn}>
            {t("add")}
          </Button>
        )}
      </form>
    </div>
  );
};

export default AddressTable;
