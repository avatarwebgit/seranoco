import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Button, Input, TextareaAutosize, TextField } from '@mui/material';
import { Textarea } from '@mui/joy';

import BannerCarousel from '../components/BannerCarousel';
import Header from '../layout/Header';
import Footer from '../layout/Footer';
import Body from '../components/filters_page/Body';
import Card from '../components/filters_page/Card';

import instagram from '../assets/svg/instagram.svg';
import whatsapp from '../assets/svg/whatsapp.svg';
import telegram from '../assets/svg/telegram.svg';
import email from '../assets/svg/email.svg';
import address from '../assets/svg/address.svg';

import classes from './ContactUs.module.css';
const ContactUs = ({ windowSize }) => {
 const inputStyles = {
  mb: '0.5rem',
  width: '100%',
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

 useEffect(() => {
  if (lng === 'fa') {
   document.title = 'تماس با ما';
  } else {
   document.title = 'Contact Us';
  }
 }, [lng]);

 const handleSubmit = () => {};

 const formDir = () => {
  if (windowSize === 'xs' || windowSize === 's' || windowSize === 'm')
   return { flexDirection: 'column' };
  else if (lng === 'fa') return { flexDirection: 'row-reverse' };
  else return { flexDirection: 'row' };
 };

 return (
  <div>
   <BannerCarousel />
   <Header windowSize={windowSize} />
   <Body>
    <Card>
     <div className={classes.cart} style={formDir()}>
      <div
       className={classes.contact_wrapper}
       style={{ direction: lng === 'fa' ? 'rtl' : 'ltr' }}>
       <h1>{t('cu.contact_us')}</h1>
       <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Reprehenderit,
        est.
       </p>
       <div className={classes.content}>
        <img src={address} alt='' width={35} style={{ margin: '35px 10px' }} />
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Explicabo,
        error.
       </div>
       <div className={classes.social_wrapper}>
        <div className={classes.content} style={{ margin: 0 }}>
         <img src={instagram} alt='' width={35} />
         <p>+98 912 2099144</p>
        </div>
        <div className={classes.content}>
         <img src={whatsapp} alt='' width={35} />
         <p> +98 912 2099144</p>
        </div>
        <div className={classes.content}>
         <img src={telegram} alt='' width={35} />
         <p>+98 912 2099144</p>
        </div>
        <div className={classes.content}>
         <img src={email} alt='' width={35} />
         <p>+98 912 2099144</p>
        </div>
       </div>
      </div>
      <form
       onSubmit={handleSubmit}
       className={classes.qst_wrapper}
       style={{ direction: lng === 'fa' ? 'rtl' : 'ltr' }}>
       <span>
        <h1>{t('cu.contact_us')}</h1>
        <p>
         Lorem ipsum dolor sit amet consectetur adipisicing elit. Reprehenderit,
         est.
        </p>
       </span>
       <TextField label={t('signup.fname')} name='name' sx={inputStyles} />
       <TextField label={t('signup.lname')} name='l-name' sx={inputStyles} />
       <TextField
        label={t('signup.email')}
        name='email'
        type='email'
        sx={inputStyles}
       />
       <label htmlFor='desc' style={{ color: '#000000', fontSize: '15px' }}>
        {t('caption')}
       </label>
       <textarea name='desc' />
       <Button
        variant='contained'
        size='large'
        className={classes.login_btn}
        type='submit'>
        {t('pc.submit')}
       </Button>
      </form>
     </div>
    </Card>
   </Body>
   <Footer />
  </div>
 );
};

export default ContactUs;
