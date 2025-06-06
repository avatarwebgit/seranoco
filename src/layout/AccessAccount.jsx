import React from 'react';
import { Modal } from '@mui/material';
import { useSelector } from 'react-redux';

import Login from '../components/access/Login';
import Signup from '../components/access/Signup';
import OTP from '../components/access/OTP';
import MobileModal from '../components/access/MobileModal';
import LoginOTP from '../components/access/LoginOTP';
import ResetPassword from '../components/access/ResetPasswordModal';

import classes from './AccessAccount.module.css';
const AccessAccount = ({ open, onClose }) => {
 const isLogin = useSelector(state => state.accessModalStore.login);
 const isSignup = useSelector(state => state.accessModalStore.signup);
 const isOTP = useSelector(state => state.accessModalStore.otp);
 const isMobile = useSelector(state => state.accessModalStore.mobile);
 const isMobileOtp = useSelector(state => state.accessModalStore.loginOTP);
 const isResetPassword = useSelector(
  state => state.accessModalStore.resetPasswordModal,
 );

 return (
  <Modal
   className={classes.modal_parent}
   open={open}
   onClose={onClose}
   BackdropProps={{
    style: {
     backgroundColor: 'rgba(0, 0, 0, 0.6)',
     backdropFilter: 'blur(12px)',
    },
   }}>
   <div className={classes.parent}>
    {isLogin && <Login />}
    {isSignup && <Signup />}
    {isOTP && <OTP />}
    {isMobile && <MobileModal />}
    {isMobileOtp && <LoginOTP />}
    {isResetPassword && <ResetPassword />}
   </div>
  </Modal>
 );
};

export default AccessAccount;
