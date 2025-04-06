import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import moment from 'moment-jalaali';

import Header from '../layout/Header';
import Footer from '../layout/Footer';
import BannerCarousel from '../components/BannerCarousel';
import Body from '../components/filters_page/Body';
import Card from '../components/filters_page/Card';
import Breadcrumbs from '../components/common/Breadcrumbs';

import { Autocomplete, Button, TextField, Input } from '@mui/material';
import Calendar from 'react-calendar/dist/cjs/Calendar.js';
import 'react-calendar/dist/Calendar.css';

import { formatNumber } from '../utils/helperFunctions';

import classes from './PayByCart.module.css';
import { sendcardPaymentData } from '../services/api';
import { useParams } from 'react-router-dom';
const PayByCart = ({ widnowSize }) => {
 const [billNo, setBillNo] = useState('554');
 const [DocType, setDocType] = useState(null);
 const [amount, setAmount] = useState('');
 const [date, setDate] = useState('');
 const [selectedDate, setSelectedDate] = useState('');
 const [recNo, setRecNo] = useState('');
 const [BankName, setBankName] = useState(null);
 const [lastFour, setLastFour] = useState('');
 const [destCardNo, setDestCardNo] = useState('');
 const [recScan, setRecScan] = useState([]);
 const [description, setDescription] = useState('');
 const [isError, setIsError] = useState(false);
 const [showCal, setShowCal] = useState(false);
 const [selectedMiladiDate, setSelectedMiladiDate] = useState('');

 const paymentMethods = [
  { id: 1, label: 'کارت به کارت' },
  { id: 2, label: 'حواله بانکی' },
 ];
 const bankNames = [{ id: 1, label: 'ملت' }];

 const lng = useSelector(state => state.localeStore.lng);
 const token = useSelector(state => state.userStore.token);

 const calendarRef = useRef();
 const inputRef = useRef();

 const { id } = useParams();

 const inputStyles = {
  m: '0.5rem 0',
  width: '100%',
  '& .MuiInputBase-root': {
   '& fieldset': {
    borderColor: 'rgb(0, 153, 130)',
   },
  },
  '& .MuiInputBase-input': {
   color: 'rgb(0, 0, 0)',
   fontSize: '16px',
   direction: lng === 'fa' ? 'rtl' : 'ltr',
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

 const { t } = useTranslation();

 const handleSubmit = e => {
  e.preventDefault();
  console.log('first');
  const requiredFields = [
   DocType?.label?.trim(),
   amount?.trim(),
   selectedMiladiDate.trim(),
   recNo.trim(),
   BankName?.label?.trim(),
   lastFour?.trim(),
   destCardNo?.trim(),
  ];

  const isValid = requiredFields.every(field => field && field.length > 0);

  if (!isValid) {
   return setIsError(true);
  } else {
   const res = sendcardPaymentData(
    token,
    {
     billNo,
     DocType,
     amount,
     selectedMiladiDate,
     recNo,
     BankName,
     lastFour,
     destCardNo,
    },
    recScan,
    id,
   );
  }
 };

 const convertShamsiToMiladi = shamsiDate => {
  return moment(shamsiDate, 'jYYYY/jMM/jDD').format('YYYY-MM-DD');
 };

 const handleDatePick = newDate => {
  setDate(newDate);
  const shamsiDate = moment(newDate).format('jYYYY/jMM/jDD');
  setSelectedDate(shamsiDate);
  const miladiDate = convertShamsiToMiladi(shamsiDate);
  setSelectedMiladiDate(miladiDate);
 };

 const handleInputChange = e => {
  const value = e.target.value;
  setDate(value);
 };

 useEffect(() => {
  document.title = t('seranoco') + '/' + t('paybycart');
  const today = moment().format('jYYYY/jMM/jDD');
  setSelectedDate(today);
  setDate(today);
 }, []);

 useEffect(() => {
  const handleClickOutside = event => {
   if (
    calendarRef.current &&
    !calendarRef.current.contains(event.target) &&
    inputRef.current &&
    !inputRef.current.contains(event.target)
   ) {
    setShowCal(false);
   }
  };

  document.addEventListener('mousedown', handleClickOutside);

  return () => {
   document.removeEventListener('mousedown', handleClickOutside);
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
       { pathname: t('home'), url: ' ' },
       { pathname: t('payment'), url: 'shopbyshape' },
      ]}
     />
     <form onSubmit={handleSubmit} className={classes.form}>
      <div className={classes.ep}>
       <Autocomplete
        id='doc-type'
        disablePortal
        size='small'
        sx={inputStyles}
        value={DocType}
        options={paymentMethods || []}
        renderInput={params => (
         <TextField
          {...params}
          label={'نوع سند'}
          error={isError && !DocType}
          name='doc-type'
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
        id='amount'
        name='amount'
        label={'مبلغ'}
        type='text'
        size='small'
        sx={inputStyles}
        onChange={e => {
         const value = e.target.value;
         const numericValue = value.replace(/[^0-9]/g, '');
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
          calendarType='islamic'
          locale='fa'
          value={moment(selectedDate, 'jYYYY/jMM/jDD').toDate()}
          className={classes.cal}
         />
        </div>
       )}
       <TextField
        id='date'
        name='date'
        label={'تاریخ'}
        type='text'
        size='small'
        sx={inputStyles}
        onChange={handleInputChange}
        onFocus={() => {
         setIsError(false);
         setShowCal(true);
        }}
        error={isError && !date}
        value={selectedDate}
        className='calendar_parent'
       />
       <TextField
        id='recNo'
        name='recNo'
        label={'شماره فیش'}
        type='text'
        size='small'
        sx={inputStyles}
        onChange={e => {
         setRecNo(e.target.value);
        }}
        onFocus={() => setIsError(false)}
        error={isError && !recNo}
        value={recNo}
       />
       <Autocomplete
        id='bank'
        disablePortal
        size='small'
        sx={inputStyles}
        value={BankName}
        options={bankNames || []}
        renderInput={params => (
         <TextField
          {...params}
          label={'نام بانک'}
          error={isError && !BankName}
          name='bankname'
         />
        )}
        onInputChange={(e, value) => {
         setBankName(value);
        }}
        onChange={(e, newValue) => {
         setBankName(newValue);
        }}
        onFocus={() => setIsError(false)}
       />
       <TextField
        id='last-four'
        name='last-four'
        label={'چهار رقم آخر شماره کارت'}
        type={'text'}
        size='small'
        sx={inputStyles}
        onChange={e => {
         const value = e.target.value;
         const numericValue = value.replace(/[^0-9]/g, '');
         setLastFour(numericValue);
        }}
        value={lastFour}
        onFocus={() => setIsError(false)}
        error={isError && !lastFour}
       />
       <TextField
        id='dest-no'
        name='dest-no'
        label={`شماره کارت مقصد`}
        type='number'
        size='small'
        sx={inputStyles}
        onChange={e => {
         const value = e.target.value;
         const numericValue = value.replace(/[^0-9]/g, '');
         setDestCardNo(numericValue);
        }}
        value={destCardNo}
        onFocus={() => setIsError(false)}
        error={isError && !destCardNo}
       />
       <Input
        id='file'
        type='file'
        name='file'
        size='small'
        sx={{
         ...inputStyles,
        }}
        onChange={e => setRecScan(e.target.files[0])}
       />
       <TextField
        id='descriptionn'
        name='description'
        label={'توضیحات'}
        value={description}
        type='text'
        size='small'
        sx={{
         ...inputStyles,
        }}
        onChange={e => {
         setDescription(e.target.value);
        }}
       />

       <div
        className={classes.error_text}
        style={{
         direction: 'rtl',
         opacity: isError ? 1 : 0,
        }}>
        لطفا مقادیر بالا را وارد کنید
       </div>
       <Button
        variant='contained'
        size='large'
        className={classes.submit}
        type='submit'>
        {t('pc.submit')}
       </Button>
      </div>
     </form>
    </Card>
   </Body>
   <Footer />
  </div>
 );
};

export default PayByCart;
