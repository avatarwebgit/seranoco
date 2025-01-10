import React, { useEffect, useRef, useState } from 'react';
import {
  Autocomplete,
  IconButton,
  InputAdornment,
  TextField,
} from '@mui/material';
import { GoogleLogin } from '@react-oauth/google';
import { useTranslation } from 'react-i18next';
import { Button } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import Flag from 'react-world-flags';
import { Visibility, VisibilityOff } from '@mui/icons-material';

import { accesModalActions } from '../../store/store';

import { getCitiesByCountry, useAllCountries } from '../../services/api';

import logo from '../../assets/images/logo_trasnparent.png';

import classes from './Signup.module.css';
const Signup = () => {
  const inputStyles = {
    mb: '0.5rem',
    '& .MuiInputBase-root': {
      '& fieldset': {
        borderColor: 'rgb(0, 153, 130)',
      },
    },
    '& .MuiInputBase-input': {
      color: 'rgb(0, 0, 0)',
      fontSize: '16px',
    },
    '& .MuiInputLabel-root': {
      color: 'gray',
      fontSize: '14px',
    },
    '& .Mui-focused .MuiInputLabel-root': {
      color: 'rgb(0, 153, 130)',
      transform: 'translate(0, -5px) scale(0.75)',
    },
    '& .Mui-focused .MuiInputBase-root': {
      '& fieldset': {
        borderColor: 'rgb(0, 153, 130)',
      },
    },
  };

  const {
    data: countryData,
    isLoading: isLoadingAllCountries,
    isError: isErrorAllCountries,
  } = useAllCountries();

  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [repeatPassword, setRepeatPassword] = useState('');
  const [country, setCountry] = useState('');
  const [cityData, setCityData] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [city, setCity] = useState('');
  const [selectedCity, setSelectedCity] = useState(null);
  const [isError, setIsError] = useState(false);
  const [phoneCode, setPhoneCode] = useState('');
  const [phoneNumber, setPhoneNumber] = useState(null);
  const [formDataIntries, setFormDataIntries] = useState(null);

  const { t } = useTranslation();
  const lng = useSelector(state => state.localeStore.lng);

  const dispatch = useDispatch();

  const abortControllerRef = useRef(new AbortController());
  const formRef = useRef();

  const handleGoogleSuccess = response => {
    const { credential } = response;
    // The `credential` here is a JWT token that you can send to your backend
    console.log('Google Sign-In successful, credential:', credential);

    // You can handle your signup logic here, for example:
    // 1. Send the credential to your backend for verification and user creation.
    // 2. Handle user redirect after successful sign-up.
  };

  const handleGoogleFailure = error => {
    console.log('Google Sign-In failed:', error);
  };
  const handleGoToLogin = () => {
    dispatch(accesModalActions.login());
  };

  const handleChange = e => {
    setCityData([]);
    const value = e.target.value;
    let inputCode = value.split('+').at(1);

    if (value.startsWith('+')) {
      setPhoneCode(value);
    } else {
      setPhoneCode('+' + value);
    }
    if (inputCode) {
      let foundCountryByCode = countryData.find(
        elem => elem.phonecode === inputCode,
      );
      if (foundCountryByCode) {
        setSelectedCountry(foundCountryByCode);
      } else {
        setSelectedCity(null);
      }
    }
  };

  const handleSubmit = e => {
    e.preventDefault();

    const form = formRef.current;
    const formData = new FormData(form);
    const formEntries = Object.fromEntries(formData.entries());

    // Check if any required fields are empty
    const requiredFields = [
      firstname?.trim(),
      lastname?.trim(),
      email?.trim(),
      password?.trim(),
      selectedCountry?.label?.trim(),
      selectedCity?.label?.trim(),
      phoneNumber?.trim(),
    ];

    const isValid = requiredFields.every(field => field && field.length > 0);

    if (!isValid) {
      setIsError(true);
    } else {
      setIsError(false);
      console.log({
        ...formEntries,
        selectedCityId: selectedCity.id,
        selectedCountryId: selectedCountry.id,
      });
    }
  };
  // api calls

  useEffect(() => {
    if (country.length > 0) {
    }

    return () => {};
  }, [country]);

  const getCities = async (param, signal) => {
    const serverRes = await getCitiesByCountry(param, signal);
    if (serverRes.response.ok) {
      setCityData(serverRes.result.data);
    }
  };

  useEffect(() => {
    abortControllerRef.current.abort();
    abortControllerRef.current = new AbortController();
    setSelectedCity(null);
    setCityData([]);
    if (selectedCountry) {
      getCities(selectedCountry.id);
      setPhoneCode(`+${selectedCountry.phonecode || ''}`);
    }

    return () => {};
  }, [selectedCountry]);

  return (
    <div className={classes.content_wrapper}>
      <div className={classes.sheet}>
        <div className={classes.logo_wrapper}>
          <img className={classes.logo} src={logo} alt='' />
        </div>
        <div className={classes.login_wrapper}>
          <div className={classes.actions}>
            <form
              onSubmit={handleSubmit}
              ref={formRef}
              className={classes.form}
            >
              <div className={classes.ep}>
                <TextField
                  id='signup-firstname-input'
                  name='firstname'
                  label={t('signup.fname')}
                  type='text'
                  size='small'
                  sx={inputStyles}
                  onChange={e => {
                    setFirstname(e.target.value);
                  }}
                  onFocus={() => setIsError(false)}
                  error={isError && !firstname}
                />
                <TextField
                  id='signup-lastname-input'
                  name='lastname'
                  label={t('signup.lname')}
                  type='text'
                  size='small'
                  sx={inputStyles}
                  onChange={e => {
                    setLastname(e.target.value);
                  }}
                  onFocus={() => setIsError(false)}
                  error={isError && !lastname}
                />
                <TextField
                  id='signup-email-input'
                  name='email'
                  label={t('signup.email')}
                  type='email'
                  size='small'
                  sx={inputStyles}
                  onChange={e => {
                    setEmail(e.target.value);
                  }}
                  onFocus={() => setIsError(false)}
                  error={isError && !email}
                />
                <TextField
                  id='signup-password-input'
                  name='password'
                  label={t('signup.password')}
                  type={showPassword ? 'text' : 'password'}
                  size='small'
                  sx={inputStyles}
                  onChange={e => {
                    setPassword(e.target.value);
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position='end'>
                        <IconButton
                          aria-label='show'
                          style={{ width: '20px', height: 'auto' }}
                          onClick={() => setShowPassword(!showPassword)}
                          disableRipple
                        >
                          {showPassword ? (
                            <Visibility fontSize='5' />
                          ) : (
                            <VisibilityOff fontSize='5' />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  onFocus={() => setIsError(false)}
                  error={isError && !password}
                />
                <TextField
                  id='signup-rpassword-input'
                  name='rPassword'
                  label={`${t('signup.repeat')} ${t('signup.password')}`}
                  type='password'
                  size='small'
                  sx={inputStyles}
                  onChange={e => {
                    setRepeatPassword(e.target.value);
                  }}
                  onFocus={() => setIsError(false)}
                  error={isError && !repeatPassword}
                />
                <Autocomplete
                  id='country-autocomplete'
                  disablePortal
                  size='small'
                  sx={inputStyles}
                  value={selectedCountry}
                  options={countryData || []}
                  renderInput={params => (
                    <TextField
                      {...params}
                      label={t('signup.country')}
                      error={isError && !selectedCountry}
                      name='country'
                    />
                  )}
                  onInputChange={(e, value) => {
                    setCountry(value);
                  }}
                  onChange={(e, newValue) => {
                    setSelectedCountry(newValue);
                  }}
                  onFocus={() => setIsError(false)}
                  disableInteractive={false}
                />
                <Autocomplete
                  id='city-autocomplete'
                  disablePortal
                  size='small'
                  sx={inputStyles}
                  value={selectedCity}
                  options={cityData || []}
                  renderInput={params => (
                    <TextField
                      {...params}
                      label={t('signup.city')}
                      error={isError && !selectedCity}
                      name='city'
                    />
                  )}
                  onInputChange={(e, value) => {
                    setCity(value);
                  }}
                  onChange={(e, newValue) => {
                    setSelectedCity(newValue);
                  }}
                  onFocus={() => setIsError(false)}
                />
                <span className={classes.phone_wrapper}>
                  <TextField
                    id='phone-code-input'
                    type='text'
                    autoComplete='current-password'
                    size='small'
                    sx={{
                      width: '30%',
                      ...inputStyles,
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position='start'>
                          {selectedCountry && selectedCountry.length !== 0 && (
                            <Flag
                              code={selectedCountry.alias}
                              style={{ width: '20px', height: 'auto' }}
                            />
                          )}
                        </InputAdornment>
                      ),
                    }}
                    value={phoneCode}
                    onChange={handleChange}
                    placeholder='+'
                  />
                  <TextField
                    id='phone-number-input'
                    name='phonenumber'
                    label={t('signup.pnumber')}
                    type='text'
                    autoComplete='current-password'
                    size='small'
                    sx={{
                      width: '68%',
                      ...inputStyles,
                    }}
                    onChange={e => {
                      const value = e.target.value;
                      const numericValue = value.replace(/[^0-9]/g, '');
                      setPhoneNumber(value);
                    }}
                    error={isError && !phoneNumber}
                  />
                </span>

                <div
                  className={classes.error_text}
                  style={{
                    direction: lng === 'fa' ? 'rtl' : 'ltr',
                    opacity: isError ? '1' : '0',
                  }}
                >
                  {t('signup.fillout')}
                </div>
                <Button
                  variant='contained'
                  size='large'
                  className={classes.login_btn}
                  type='submit'
                >
                  {t('signup.sign_up')}
                </Button>
              </div>
            </form>
            <div className={classes.oneclick_login_wrapper}>
              <div className={classes.google_login_wrapper}>
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleFailure}
                  useOneTap={true}
                  theme='outline'
                />
              </div>
            </div>
            <div
              className={classes.signup_link}
              style={{ direction: lng === 'fa' ? 'rtl' : 'ltr' }}
            >
              <p>{t('access.have_acc')}</p>&nbsp;
              <button onClick={handleGoToLogin}>{t('login')}</button>&nbsp;
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
