import React, { useEffect, useRef, useState } from 'react';
import {
  Autocomplete,
  Button,
  FormControl,
  InputAdornment,
  TextField,
} from '@mui/material';

import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { formatNumber, notify } from '../../../utils/helperFunctions';

import classes from './AddressTable.module.css';
import { addAddress, getCitiesByCountry } from '../../../services/api';
import Flag from 'react-world-flags';
const AddressTable = ({ formData, refetch }) => {
  const lng = useSelector(state => state.localeStore.lng);
  const token = useSelector(state => state.userStore.token);

  const inputStyles = {
    mb: '0.5rem',
    width: '49%',

    '& .MuiInputBase-root': {
      '& fieldset': {
        borderColor: '#000000',
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
      color: '#000000',
      transform: 'translate(0, -5px) scale(0.75)',
    },
    '& .Mui-focused .MuiInputBase-root': {
      '& fieldset': {
        borderColor: '#000000',
      },
    },
  };

  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [secondaryPhoneN, setSecondaryPhoneN] = useState('');
  const [phoneCode, setphoneCode] = useState('');
  const [cityData, setCityData] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [Address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [isError, setIsError] = useState(false);
  const [parsedData, setParsedData] = useState([]);
  const [postalCode, setPostalCode] = useState('');

  const formRef = useRef();

  const { t } = useTranslation();
  const data = localStorage.getItem('sis');

  const getCities = async param => {
    const serverRes = await getCitiesByCountry(param);
    if (serverRes.response.ok) {
      setCityData(serverRes.result.data);
    }
  };

  useEffect(() => {
    if (formData) {
      if (formData?.title?.split(' ')) {
        setFirstname(formData.title.split(' ').at(0));
        setLastname(formData.title.split(' ').at(1));
      }
      setAddress(formData.address);
      setSecondaryPhoneN(formData.cellphone);
      setSelectedCity(formData.City);
      setPostalCode(formData.postal_code);
    }
  }, [formData]);

  useEffect(() => {
    const cData = JSON.parse(data);
    setParsedData(cData);
    if (cData.selectedCountry) {
      getCities(cData.selectedCountry.id);
      setphoneCode(cData.selectedCountry.phonecode);
    }

    return () => {};
  }, [data.selectedCountry]);

  const handleSubmit = e => {
    e.preventDefault();

    const form = formRef.current;
    const formData = new FormData(form);
    const formEntries = Object.fromEntries(formData.entries());

    const requiredFields = [
      firstname?.trim(),
      lastname?.trim(),
      Address?.trim(),
      selectedCity?.label?.trim(),
      secondaryPhoneN?.trim(),
      postalCode?.trim(),
    ];

    const isValid = requiredFields.every(field => field && field.length > 0);

    if (!isValid) {
      setIsError(true);
    } else {
      setIsError(false);

      try {
        addAddress(
          token,
          `${firstname} ${lastname}`,
          secondaryPhoneN,
          Address,
          selectedCity.id,
          postalCode,
        );
        refetch();
        notify(t('profile.suc_add_add'));
        resetInput();
      } catch (error) {
        // console.error('Registration failed:', error);
        notify(t('profile.err_add_add'));
      }
    }
  };

  const resetInput = () => {
    setFirstname('');
    setLastname('');
    setSecondaryPhoneN('');
    setSelectedCity('');
    setAddress('');
    setPostalCode('');
  };

  return (
    <div className={`${classes.main} ${formData && classes.form}`}>
      <form ref={formRef} onSubmit={handleSubmit} className={classes.form}>
        <FormControl fullWidth>
          <div className={classes.input_wrapper}>
            <TextField
              id='signup-firstname-input'
              name='firstname'
              label={t('pc.receiver') + ' ' + t('signup.fname')}
              type='text'
              size='medium'
              sx={{ ...inputStyles }}
              onChange={e => {
                setFirstname(e.target.value);
              }}
              onFocus={() => setIsError(false)}
              error={isError && !firstname}
              value={firstname}
            />
            <TextField
              id='signup-lastname-input'
              name='lastname'
              label={t('pc.receiver') + ' ' + t('signup.lname')}
              type='text'
              size='medium'
              sx={inputStyles}
              onChange={e => {
                setLastname(e.target.value);
              }}
              onFocus={() => setIsError(false)}
              error={isError && !lastname}
              value={lastname}
            />
          </div>
          <div className={classes.input_wrapper}>
            <span className={classes.phone_wrapper}>
              <TextField
                id='phone-code-input'
                type='text'
                name='pohonecode'
                autoComplete='current-password'
                size='medium'
                sx={{
                  ...inputStyles,
                  width: '30%',
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      {parsedData && parsedData.length !== 0 && (
                        <Flag
                          code={parsedData.selectedCountry.alias}
                          style={{ width: '20px', height: 'auto' }}
                        />
                      )}
                    </InputAdornment>
                  ),
                }}
                value={`+${phoneCode}`}
                placeholder='+'
              />
              <TextField
                id='phone-number-input'
                name='phonenumber'
                label={t('signup.pnumber')}
                value={secondaryPhoneN}
                type='text'
                autoComplete='current-password'
                size='medium'
                sx={{
                  ...inputStyles,
                  width: '68%',
                }}
                onChange={e => {
                  const value = e.target.value;
                  const numericValue = value.replace(/[^0-9]/g, '');
                  setSecondaryPhoneN(numericValue);
                }}
                error={isError && !secondaryPhoneN}
              />
            </span>
            <Autocomplete
              id='city-autocomplete'
              disablePortal
              size='medium'
              name='city'
              sx={inputStyles}
              value={selectedCity}
              options={cityData || []}
              error={isError && !selectedCity}
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
          </div>
          <div className={classes.input_wrapper}>
            <TextField
              id='signup-postalcode-input'
              name='postalcode'
              label={t('pc.postalcode')}
              type='text'
              size='medium'
              sx={inputStyles}
              onChange={e => {
                let value = e.target.value;
                const numericValue = value.replace(/[^0-9]/g, '');
                const formattedValue = numericValue.replace(
                  /(\d{3})(?=\d)/g,
                  '$1 ',
                );
                setPostalCode(formattedValue);
              }}
              onFocus={() => setIsError(false)}
              error={isError && !postalCode}
              value={postalCode}
            />
          </div>
          <TextField
            id='signup-adress-input'
            name='address'
            label={t('signup.adress')}
            type='text'
            size='medium'
            sx={{ ...inputStyles, width: '100%' }}
            onChange={e => {
              setAddress(e.target.value);
            }}
            onFocus={() => setIsError(false)}
            error={isError && !Address}
            value={Address}
          />
        </FormControl>
        <div
          className={classes.error_text}
          style={{
            direction: lng === 'fa' ? 'rtl' : 'ltr',
            opacity: isError ? 1 : 0,
          }}
        >
          {t('signup.fillout')}
        </div>
        {!formData && (
          <Button
            variant='contained'
            type='submit'
            onClick={handleSubmit}
            className={classes.btn}
          >
            {t('add')}
          </Button>
        )}
      </form>
    </div>
  );
};

export default AddressTable;
