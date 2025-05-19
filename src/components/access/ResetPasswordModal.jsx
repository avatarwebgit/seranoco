import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, IconButton, TextField } from '@mui/material';

import logo from '../../assets/images/logo_trasnparent.png';

import { ReactComponent as Close } from '../../assets/svg/close.svg';

import { useDispatch, useSelector } from 'react-redux';
import { AdUnits } from '@mui/icons-material';
import { accesModalActions } from '../../store/store';
import classes from './ResetPasswordModal.module.css';
import { sendResetPasswordEmail } from '../../services/api';
import { toast } from 'react-toastify';
const ResetPasswordModal = () => {
 const [email, setEmail] = useState('');

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

 const handleSendEmail = async email => {
  try {
   const serverRes = await sendResetPasswordEmail(email);

   if (serverRes.response.ok) {
    toast.success(serverRes.result.message);
   }
  } catch (err) {
   toast.error(err.message);
  }
 };

 const handleOpenMobileModal = () => {
  dispatch(accesModalActions.mobile());
 };

 const handleCloseModal = () => {
  dispatch(accesModalActions.close());
 };

 const handleOpenSignup = () => {
  dispatch(accesModalActions.signup());
 };

 return (
  <div className={classes.content_wrapper}>
   <div className={classes.sheet}>
    <div className={classes.logo_wrapper}>
     <img className={classes.logo} src={logo} alt='' loading='lazy' />
    </div>
    <div className={classes.login_wrapper}>
     <div className={classes.actions}>
      <div className={classes.ep}>
       <TextField
        id='outlined-emial-input'
        label={t('signup.email')}
        type='Email'
        size='small'
        sx={{
         ...inputStyles,
         textAlign: lng === 'fa' ? 'right' : 'left',
         direction: lng === 'fa' ? 'rtl' : 'ltr',
        }}
        onChange={e => setEmail(e.target.value)}
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

      <Button
       variant='contained'
       size='large'
       className={classes.login_btn}
       onClick={() => handleSendEmail(email)}>
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
    <IconButton
     className={classes.close_btn}
     disableRipple={true}
     onClick={handleCloseModal}>
     <Close width={30} height={30} />
    </IconButton>
   </div>
  </div>
 );
};

export default ResetPasswordModal;
