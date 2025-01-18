import React from 'react';
import { Modal } from '@mui/material';
import { useSelector } from 'react-redux';

import Login from '../components/access/Login';
import Signup from '../components/access/Signup';
import OTP from '../components/access/OTP';

import classes from './AccessAccount.module.css';
const AccessAccount = ({ open, onClose }) => {
  const isLogin = useSelector(state => state.accessModalStore.login);
  const isSignup = useSelector(state => state.accessModalStore.signup);
  const isOTP = useSelector(state => state.accessModalStore.otp);

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
      }}
    >
      <div className={classes.parent}>
        {isLogin && <Login />}
        {isSignup && <Signup />}
        {isOTP && <OTP />}
      </div>
    </Modal>
  );
};

export default AccessAccount;
