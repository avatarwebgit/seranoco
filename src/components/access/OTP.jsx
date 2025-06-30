import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { InputOTP } from 'antd-input-otp';
import { useTranslation } from 'react-i18next';
import { Button, IconButton } from '@mui/material';

import {
 accesModalActions,
 drawerActions,
 signupActions,
 userActions,
} from '../../store/store';
import logo from '../../assets/images/logo_trasnparent.png';
import { ReactComponent as Close } from '../../assets/svg/close.svg';

import classes from './OTP.module.css';
import { verifyOTP } from '../../services/api';
import { notify } from '../../utils/helperFunctions';
const OTP = () => {
 const [signupValues, setSignupValues] = useState(null);
 const [otpValue, setOtpValue] = useState([]);
 const [timeRemaining, setTimeRemaining] = useState(0); // Initialize with 0

 const lng = useSelector(state => state.localeStore.lng);
 const signupInfo = useSelector(state => state.signupStore.data);

 const { t } = useTranslation();
 const formRef = useRef();
 const dispatch = useDispatch();

 const handleFinish = (e, otp) => {
  if (e) e.preventDefault();
  const payload = otp || otpValue;
  const code = payload.join('');
  if (code && signupInfo.phonenumber) {
   handleVerifyOTP(code, signupInfo.phonenumber);
  }
 };

 const handleGoToLogin = () => {
  dispatch(accesModalActions.login());
 };

 useEffect(() => {
  const data = localStorage.getItem('sis');
  if (data && data.length > 0) {
   setSignupValues(JSON.parse(data));
  }
 }, []);

 useEffect(() => {
  if (signupValues?.createdAt) {
   const targetDate = new Date(signupValues.createdAt);
   if (!isNaN(targetDate)) {
    const countdownEndTime = new Date(targetDate.getTime() + 2 * 60 * 1000);
    setTimeRemaining(countdownEndTime - new Date());
   } else {
    // console.error('Invalid createdAt date:', signupValues.createdAt);
   }
  }
 }, [signupValues?.createdAt]);

 useEffect(() => {
  if (timeRemaining > 0) {
   const intervalId = setInterval(() => {
    setTimeRemaining(prevTime => {
     const newTimeRemaining = prevTime - 1000;
     return newTimeRemaining > 0 ? newTimeRemaining : 0;
    });
   }, 1000);

   return () => clearInterval(intervalId);
  }
 }, [timeRemaining]);

 const minutes = Math.floor(timeRemaining / (1000 * 60));
 const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

 //api calls

 const handleResend = () => {
  dispatch(
   signupActions.set({
    ...signupValues,
    createdAt: new Date().toISOString(),
   }),
  );
 };

 const handleVerifyOTP = async (code, cellphone) => {
  const serverRes = await verifyOTP(code, cellphone);
  if (serverRes.response.ok) {
   dispatch(userActions.setUser(serverRes.result.user));
   dispatch(userActions.set(serverRes.result.token));
   dispatch(accesModalActions.close());
   dispatch(drawerActions.open());
  } else {
   notify(t('trylater'));
   dispatch(accesModalActions.close());
  }
 };

 const handleCloseModal = () => {
  dispatch(accesModalActions.close());
 };

 return (
  <div className={classes.content_wrapper}>
   <IconButton
    className={classes.close_btn}
    disableRipple={true}
    onClick={handleCloseModal}>
    <Close width={30} height={30} />
   </IconButton>
   <div className={classes.sheet}>
    <div className={classes.logo_wrapper}>
     <img className={classes.logo} src={logo} alt='' loading='lazy' />
    </div>
    <div className={classes.otp_wrapper}>
     <div className={classes.actions}>
      <form
       onSubmit={e => handleFinish(e, otpValue)}
       ref={formRef}
       className={classes.form}>
       <InputOTP
        onChange={setOtpValue}
        value={otpValue}
        autoSubmit={otp => handleFinish(null, otp)}
        variant='outlined'
        type='number'
        inputClassName={classes.otp_input}
        count={6}
       />
      </form>
     </div>
     <div>
      {timeRemaining > 0 ? (
       <center className={classes.time}>
        <h2>{`${String(minutes).padStart(2, '0')}:${String(seconds).padStart(
         2,
         '0',
        )}`}</h2>
       </center>
      ) : (
       <center>
        <Button
         variant='contained'
         size='small'
         className={classes.login_btn}
         type='submit'
         onClick={handleResend}>
         {t('otp.resend')}
        </Button>
       </center>
      )}
     </div>
    </div>
    <div
     className={classes.signup_link}
     style={{ direction: lng === 'fa' ? 'rtl' : 'ltr' }}>
     <p>{t('access.have_acc')}</p>&nbsp;
     <button onClick={handleGoToLogin}>{t('login')}</button>&nbsp;
    </div>
   </div>
  </div>
 );
};

export default OTP;
