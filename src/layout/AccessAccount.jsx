import React, { useEffect, useState } from 'react';
import { IconButton, Modal } from '@mui/material';

import { ReactComponent as Close } from '../assets/svg/close.svg';

import Login from '../components/access/Login';
import Signup from '../components/access/Signup';

import classes from './AccessAccount.module.css';
import { useSelector } from 'react-redux';

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
          backdropFilter:'blur(12px)'
        },
      }}
    >
      <div className={classes.parent}>
        <IconButton className={classes.close_btn}></IconButton>
        {isLogin && <Login />}
        {isSignup && <Signup />}
      </div>
    </Modal>
  );
};

export default AccessAccount;
