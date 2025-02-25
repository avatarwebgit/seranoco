import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import Wrapper from './Wrapper';
import Body from '../filters_page/Body';
import Card from '../filters_page/Card';

import classes from './Ticket.module.css';
import { Autocomplete, TextareaAutosize, TextField } from '@mui/material';
const Ticket = () => {
 const inputStyles = {
  mb: '0.5rem',
  '& .MuiInputBase-root': {
   '& fieldset': {
    borderColor: 'black',
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
   color: 'black',
   transform: 'translate(0, -5px) scale(0.75)',
  },
  '& .Mui-focused .MuiInputBase-root': {
   '& fieldset': {
    borderColor: 'black',
   },
  },
 };
 const { t } = useTranslation();
 const lng = useSelector(state => state.localeStore.lng);
 return (
  <Body parentClass={classes.body}>
   <Card className={classes.main}>
    <h3
     className={classes.title}
     style={{ direction: lng === 'fa' ? 'rtl' : 'ltr' }}>
     {t('profile.favorites')}
    </h3>
    <Wrapper className={classes.wrapper}>
     <label htmlFor='subject'>{t('subject')}</label>
     <Autocomplete
      id='subject'
      disablePortal
      size='small'
      className={classes.auto}
      sx={inputStyles}
      //   value={selectedCity}
      //   options={cityData || []}
      renderInput={params => (
       <TextField
        {...params}
        label={t('signup.city')}
        // error={isError && !selectedCity}
        name='city'
       />
      )}
      onInputChange={(e, value) => {
       //    setCity(value);
      }}
      onChange={(e, newValue) => {
       //    setSelectedCity(newValue);
      }}
      //   onFocus={() => setIsError(false)}
     />
     <label htmlFor='desc'>{t('caption')}</label>
     <TextareaAutosize name='desc' id='desc' style={{maxWidth:'500px'}}></TextareaAutosize>
    </Wrapper>
   </Card>
  </Body>
 );
};

export default Ticket;
