import React, { useState } from 'react';
import { FormControl, TextField } from '@mui/material';

import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

import classes from './Checkout.module.css';
const Checkout = () => {
  const inputStyles = {
    mb: '0.5rem',
    width: '49%',
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

  const [firstname, setFirstname] = useState('');
  const [lastnanme, setLastnanme] = useState('');
  const [secondaryPhoneN, setSecondaryPhoneN] = useState(0);
  const [cityData, setCityData] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [Address, setAddress] = useState('');
  const [isError, setIsError] = useState(false);

  const { t } = useTranslation();
  return (
    <div className={classes.main}>
      <FormControl fullWidth>
        <div className={classes.input_wrapper}>
          <TextField
            id='signup-firstname-input'
            name='firstname'
            label={t('signup.fname')}
            type='text'
            size='medium'
            sx={inputStyles}
            onChange={e => {
              setFirstname(e.target.value);
            }}
            onFocus={() => setIsError(false)}
            error={isError && !firstname}
            value={firstname}
          />
          <TextField
            id='signup-firstname-input'
            name='lastname'
            label={t('signup.fname')}
            type='text'
            size='medium'
            sx={inputStyles}
            onChange={e => {
              setFirstname(e.target.value);
            }}
            onFocus={() => setIsError(false)}
            error={isError && !firstname}
            value={lastnanme}
          />
        </div>
        <div className={classes.input_wrapper}>
          <TextField
            id='signup-firstname-input'
            name='phone_number'
            label={t('signup.fname')}
            type='text'
            size='medium'
            sx={inputStyles}
            onChange={e => {
              setFirstname(e.target.value);
            }}
            onFocus={() => setIsError(false)}
            error={isError && !firstname}
            value={secondaryPhoneN}
          />
          <TextField
            id='signup-firstname-input'
            name='city'
            label={t('signup.fname')}
            type='text'
            size='medium'
            sx={inputStyles}
            onChange={e => {
              setFirstname(e.target.value);
            }}
            onFocus={() => setIsError(false)}
            error={isError && !firstname}
            value={selectedCity}
          />
        </div>
        <TextField
          id='signup-firstname-input'
          name='address'
          label={t('signup.fname')}
          type='text'
          size='medium'
          sx={{ ...inputStyles, width: '100%' }}
          onChange={e => {
            setFirstname(e.target.value);
          }}
          onFocus={() => setIsError(false)}
          error={isError && !firstname}
          value={Address}
        />
      </FormControl>
    </div>
  );
};

export default Checkout;
