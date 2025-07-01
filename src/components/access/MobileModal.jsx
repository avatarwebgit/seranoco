import { Button, InputAdornment, TextField } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import Flag from 'react-world-flags';

import logo from '../../assets/images/logo_trasnparent.png';
import { accesModalActions, signupActions } from '../../store/store';
import { sendOTP } from '../../services/api';
import { notify } from '../../utils/helperFunctions';

import classes from './MobileModal.module.css';
import LoadingSpinner from '../common/LoadingSpinner';

const OTP_TIMEOUT_MS = 2 * 60 * 1000; // 2 minutes

const MobileModal = () => {
 const { t } = useTranslation();
 const dispatch = useDispatch();
 const formRef = useRef();
 const lng = useSelector(state => state.localeStore.lng);

 const [signupValues, setSignupValues] = useState(null);
 const [otpValue, setOtpValue] = useState('');
 const [timeRemaining, setTimeRemaining] = useState(0);
 const [isLoading, setIsLoading] = useState(false);

 // Load signup values from localStorage on component mount
 useEffect(() => {
  const data = localStorage.getItem('sis');
  if (data) {
   try {
    setSignupValues(JSON.parse(data));
   } catch (error) {
    console.error('Failed to parse signup values:', error);
   }
  }
 }, []);

 // Initialize countdown timer when signupValues are available
 useEffect(() => {
  if (signupValues?.createdAt) {
   const targetDate = new Date(signupValues.createdAt);
   if (!isNaN(targetDate)) {
    const countdownEndTime = new Date(targetDate.getTime() + OTP_TIMEOUT_MS);
    setTimeRemaining(Math.max(0, countdownEndTime - new Date()));
   }
  }
 }, [signupValues?.createdAt]);

 // Countdown timer effect
 useEffect(() => {
  if (timeRemaining <= 0) return;

  const intervalId = setInterval(() => {
   setTimeRemaining(prevTime => Math.max(0, prevTime - 1000));
  }, 1000);

  return () => clearInterval(intervalId);
 }, [timeRemaining]);

 const handleSendOtp = (e, otp = otpValue) => {
  e?.preventDefault();
  if (otp) {
   handleVerifyOTP(otp);
   dispatch(accesModalActions.mobile());
  }
 };

 const handleVerifyOTP = async cellphone => {
  setIsLoading(true);
  try {
   const serverRes = await sendOTP(cellphone);
   if (serverRes.response.ok) {
    dispatch(accesModalActions.setMobile(cellphone));
    dispatch(accesModalActions.loginOtp());
   } else {
    notify(t('trylater'));
    dispatch(accesModalActions.close());
   }
  } catch (error) {
   console.error('OTP verification failed:', error);
   notify(t('trylater'));
  } finally {
   setIsLoading(false);
  }
 };

 const handleResendOTP = () => {
  const updatedValues = {
   ...signupValues,
   createdAt: new Date().toISOString(),
  };
  dispatch(signupActions.set(updatedValues));
  setTimeRemaining(OTP_TIMEOUT_MS);
 };

 const handleGoToLogin = () => {
  dispatch(accesModalActions.login());
 };

 // Format time remaining as MM:SS
 const formattedTime = `${String(Math.floor(timeRemaining / 60000)).padStart(
  2,
  '0',
 )}:${String(Math.floor((timeRemaining % 60000) / 1000)).padStart(2, '0')}`;

 const isRTL = lng === 'fa';

 return (
  <div className={classes.content_wrapper}>
   <div className={classes.sheet}>
    <div className={classes.logo_wrapper}>
     <img className={classes.logo} src={logo} alt='' loading='lazy' />
    </div>

    <div className={classes.otp_wrapper}>
     <div className={classes.actions}>
      <form onSubmit={handleSendOtp} ref={formRef} className={classes.form}>
       <p className={classes.text} dir={isRTL ? 'rtl' : 'ltr'}>
        {t('enter_mobile_number')}
       </p>

       <TextField
        value={otpValue}
        onChange={e => setOtpValue(e.target.value)}
        type='tel'
        inputMode='numeric'
        InputProps={{
         startAdornment: (
          <InputAdornment position='start'>
           <Flag code='IR' style={{ width: '20px', height: 'auto' }} />
           +98
          </InputAdornment>
         ),
        }}
        disabled={isLoading}
       />

       <Button
        type='submit'
        className={classes.login_btn}
        disabled={isLoading || !otpValue}>
        {isLoading ? <LoadingSpinner size={'20px'} /> : t('submit')}
       </Button>
      </form>
     </div>
    </div>

    <div
     className={classes.signup_link}
     style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
     <p>{t('access.have_acc')}</p>&nbsp;
     <button onClick={handleGoToLogin}>{t('login')}</button>&nbsp;
    </div>
   </div>
  </div>
 );
};

export default MobileModal;
