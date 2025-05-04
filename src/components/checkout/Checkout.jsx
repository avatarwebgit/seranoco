import React, { useEffect, useRef, useState } from 'react';
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
} from '@mui/material';
import Flag from 'react-world-flags';
import {
 addAddress,
 getAllAddresses,
 getCitiesByCountry,
 useAllCountries,
} from '../../services/api';

import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { formatNumber, notify } from '../../utils/helperFunctions';

import classes from './Checkout.module.css';
import { Add } from '@mui/icons-material';
import AddressTable from '../account/accountInformation/AddressTable';
import { cartActions } from '../../store/store';
const Checkout = ({ isDataValid, sendOrderData }) => {
 const lng = useSelector(state => state.localeStore.lng);

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

 const {
  data: countryData,
  isLoading: isLoadingAllCountries,
  isError: isErrorAllCountries,
 } = useAllCountries();

 const [firstname, setFirstname] = useState('');
 const [lastname, setLastname] = useState('');
 const [secondaryPhoneN, setSecondaryPhoneN] = useState('');
 const [phoneCode, setphoneCode] = useState('');
 const [cityData, setCityData] = useState([]);
 const [selectedCity, setSelectedCity] = useState(null);
 const [Address, setAddress] = useState('');
 const [city, setCity] = useState(null);
 const [isError, setIsError] = useState(false);
 const [parsedData, setParsedData] = useState([]);
 const [postalCode, setPostalCode] = useState('');
 const [options, setOptions] = useState([]);
 const [selectedAddress, setSelectedAddress] = useState([]);
 const [selectedCountry, setSelectedCountry] = useState(null);
 const [country, setCountry] = useState('');

 const formRef = useRef();

 const { t } = useTranslation();
 const data = localStorage.getItem('sis');

 const token = useSelector(state => state.userStore.token);

 const dispatch = useDispatch();

 const [addressData, setAddressData] = useState([]);

 const getCities = async param => {
  const serverRes = await getCitiesByCountry(param);
  if (serverRes.response.ok) {
   setCityData(serverRes.result.data);
  }
 };

 useEffect(() => {
  if (selectedCountry) {
   getCities(selectedCountry.id);
  }
 }, [selectedCountry]);

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
    allAddresses();
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

 const allAddresses = async () => {
  const serverRes = await getAllAddresses(token);
  setOptions([]);
  if (serverRes.response.ok) {
   setAddressData(serverRes.result.address);
  }
 };

 useEffect(() => {
  addressData.map(el => {
   return setOptions(prev => [...prev, { id: el.id, label: el.address }]);
  });
 }, [addressData]);

 useEffect(() => {
  allAddresses();
 }, []);

 useEffect(() => {
  if (selectedAddress) {
   dispatch(cartActions.setSelectedAddress(selectedAddress.id));
  }
 }, [selectedAddress]);

 const filterExactMatch = (options, { inputValue }) => {
  if (!inputValue) {
   return options;
  }
  const lowerInputValue = inputValue.toLowerCase();
  return options.filter(option =>
   option.label.toLowerCase().includes(lowerInputValue),
  );
 };

 return (
  <div className={classes.main}>
   <Autocomplete
    id='city-autocomplete'
    disablePortal
    size='medium'
    name='selectedaddress'
    sx={{ ...inputStyles, width: '100%', mb: '2rem' }}
    value={selectedAddress.label}
    options={options || []}
    error={isError && !selectedCity}
    renderInput={params => (
     <TextField
      {...params}
      label={t('profile.address')}
      error={isError && !selectedCity}
      name='city'
     />
    )}
    onInputChange={(e, value) => {
     setCity(value);
    }}
    onChange={(e, newValue) => {
     setSelectedAddress(newValue);
     isDataValid(true);
    }}
    onFocus={() => setIsError(false)}
   />

   <Accordion sx={{ boxShadow: 'none' }}>
    <AccordionSummary
     expandIcon={<Add fontSize='small' />}
     aria-controls={`address-content`}
     id={`address-header`}>
     <Typography
      component='span'
      style={{ fontSize: '.7rem', fontWeight: 'bold' }}
      variant='h1'>
      {t('profile.add_add')}
     </Typography>
    </AccordionSummary>
    <AccordionDetails>
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
        <Autocomplete
         id='country-autocomplete'
         disablePortal
         size='medium'
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
         getOptionLabel={option => option.label || ''}
        />
        <Autocomplete
         id='city-autocomplete'
         disablePortal
         size='medium'
         sx={inputStyles}
         value={selectedCity}
         filterOptions={filterExactMatch}
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
         disableInteractive={false}
         getOptionLabel={option => option.label || ''}
        />
       </div>
       <div className={classes.input_wrapper}>
        {' '}
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
          const formattedValue = numericValue.replace(/(\d{3})(?=\d)/g, '$1 ');
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
      </FormControl>{' '}
      <div
       className={classes.error_text}
       style={{
        direction: lng === 'fa' ? 'rtl' : 'ltr',
        opacity: isError ? 1 : 0,
       }}>
       {t('signup.fillout')}
      </div>
      <Button
       variant='contained'
       type='submit'
       onClick={handleSubmit}
       className={classes.btn}>
       {t('pc.submit')}
      </Button>
     </form>
    </AccordionDetails>
   </Accordion>
  </div>
 );
};

export default Checkout;
