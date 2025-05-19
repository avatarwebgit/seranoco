import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, IconButton, InputAdornment, TextField } from '@mui/material';

import logo from '../assets/images/logo_trasnparent.png';

import { ReactComponent as Close } from '../assets/svg/close.svg';

import { useDispatch, useSelector } from 'react-redux';
import { AdUnits, Visibility, VisibilityOff } from '@mui/icons-material';
import { accesModalActions } from '../store/store';
import classes from './ResetPassword.module.css';
import Header from '../layout/Header';
import Body from '../components/filters_page/Body';
import Footer from '../layout/Footer';
import { useLocation } from 'react-router-dom';
import { sendResetPasswordEmail } from '../services/api';
import { toast } from 'react-toastify';
const ResetPassword = () => {
 const [password, setPassword] = useState('');
 const [showPassword, setShowPassword] = useState(false);
 const [repeatPassword, setRepeatPassword] = useState('');
 const [isError, setIsError] = useState(false);

 const [errors, setErrors] = useState([]);

 const dispatch = useDispatch();

 const { t } = useTranslation();
 const lng = useSelector(state => state.localeStore.lng);

 const inputStyles = {
  m: '0.5rem 0',
  width: '100%',

  '& .MuiInputBase-root': {
   '& fieldset': {
    borderColor: 'black',
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
   color: 'black',
   transform: 'translate(0, -5px) scale(0.75)',
  },
  '& .Mui-focused .MuiInputBase-root': {
   '& fieldset': {
    borderColor: 'black',
   },
  },
 };

 const handleSendToken = () => {};

 const handleOpenMobileModal = () => {
  dispatch(accesModalActions.mobile());
 };

 const handleOpenSignup = () => {
  dispatch(accesModalActions.signup());
 };

 const handleSendCredentials = async () => {
  try {
   const serverRes = await sendResetPasswordEmail({
    token,
    email,
    password,
    password_confirmation: repeatPassword,
   });
   if (serverRes.response.ok) {
    toast.success(serverRes.result.message);
   }
  } catch (err) {
   toast.error(err.message);
  }
 };

 const location = useLocation();

 const searchParams = new URLSearchParams(location.search);
 const token = searchParams.get('token')?.replace(/"/g, '');
 const email = searchParams.get('email')?.replace(/"/g, '');

 return (
  <div className={classes.main}>
   <Header />
   <Body>
    <div className={classes.content_wrapper}>
     <div className={classes.sheet}>
      <div className={classes.login_wrapper}>
       <div className={classes.actions}>
        <div className={classes.ep}>
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
          value={password}
          InputProps={{
           endAdornment: (
            <InputAdornment position='end'>
             <IconButton
              aria-label='show'
              style={{ width: '20px', height: 'auto' }}
              onClick={() => setShowPassword(!showPassword)}
              disableRipple>
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
          value={repeatPassword}
          onFocus={() => setIsError(false)}
          error={isError && !repeatPassword}
         />
         {Object.keys(errors).length > 0 &&
          Object.values(errors).map(el => {
           return (
            <div
             className={classes.error_text}
             style={{ direction: lng === 'fa' ? 'rtl' : 'ltr' }}>
             {lng === 'fa' ? el.fa : el.en}
            </div>
           );
          })}
        </div>
        <ul
         style={{
          direction: lng === 'fa' ? 'rtl' : 'ltr',
          padding: '15px',
         }}>
         <li
          className={classes.check_text}
          style={{
           color: password.trim().length > 8 ? 'green' : 'red',
          }}>
          {t('signup.err_8char')}
         </li>
         <li
          className={classes.check_text}
          style={{
           color:
            password.trim().length > 0 &&
            password.trim() === repeatPassword.trim()
             ? 'green'
             : 'red',
          }}>
          {t('signup.err_notm')}
         </li>
        </ul>
        <Button
         variant='contained'
         size='large'
         className={classes.login_btn}
         onClick={handleSendCredentials}>
         {t('send')}
        </Button>

        <div className={classes.oneclick_login_wrapper}>
         <div
          className={classes.google_login_wrapper}
          onClick={handleOpenMobileModal}>
          <IconButton className={classes.mobile_login} disableRipple>
           <AdUnits sx={{ fontSize: '20px !important' }} />
           <p>{t('access.swotp')}</p>
          </IconButton>
         </div>
        </div>
        <div
         className={classes.signup_link}
         style={{ direction: lng === 'fa' ? 'rtl' : 'ltr' }}>
         <p>{t('access.create_acc')}</p>&nbsp;
         <button onClick={handleOpenSignup}>{t('signup.sign_up')}</button>
         &nbsp;
        </div>
       </div>
      </div>
     </div>
    </div>
   </Body>
   <Footer />
  </div>
 );
};

export default ResetPassword;
