import React, { useEffect, useRef, useState } from 'react';
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

import address from '../assets/svg/address.svg';

import classes from './ContactUs.module.css';
import { contactUsSend } from '../services/api';
import { notify } from '../utils/helperFunctions';
const ContactUs = ({ windowSize }) => {
 const [name, setName] = useState('');
 const [email, setEmail] = useState('');
 const [desc, setDesc] = useState('');
 const [isEmpty, setIsEmpty] = useState(false);

 const form = useRef();

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
    document.title = t('seranoco') + '/' + t('contactus');
 }, []);

 const sendContactDetails = async (e, name, email, desc) => {
  e.preventDefault();
  const serverRes = await contactUsSend(name, email, desc);
  if (serverRes.response.ok) {
   notify(t('contact.successfull'));
  } else {
   notify(t('contact.error'));
  }
  form.current.reset();
 };

 const handleSubmit = e => {
  const isNameValid = name.trim().length > 0;
  const isEmailValid = email.trim().length > 0;
  const isMessageValid = desc.trim().length > 0;
  if ((isNameValid, isEmailValid, isMessageValid)) {
   sendContactDetails(e, name, email, desc);
  } else {
   setIsEmpty(true);
  }
 };

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
       </div>
      </div>
      <form
       onSubmit={e => handleSubmit(e)}
       className={classes.qst_wrapper}
       style={{ direction: lng === 'fa' ? 'rtl' : 'ltr' }}
       ref={form}>
       <span>
        <h1>{t('cu.contact_us')}</h1>
        <p>
         Lorem ipsum dolor sit amet consectetur adipisicing elit. Reprehenderit,
         est.
        </p>
       </span>
       <TextField
        label={t('signup.fname')}
        name='name'
        sx={inputStyles}
        onChange={e => setName(e.target.value)}
        required
       />
       <TextField
        label={t('signup.email')}
        name='email'
        type='email'
        onChange={e => setEmail(e.target.value)}
        sx={inputStyles}
        required
       />
       <label htmlFor='desc' style={{ color: '#000000', fontSize: '15px' }}>
        {t('caption')}
       </label>
       <textarea name='desc' onChange={e => setDesc(e.target.value)} required />
       {isEmpty && (
        <div
         className={classes.error_text}
         style={{ direction: lng === 'fa' ? 'rtl' : 'ltr' }}>
         {t('access.error_empty')}
        </div>
       )}
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
