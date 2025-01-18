import React, { useState } from 'react';
import { IconButton, TextField } from '@mui/material';
import { GoogleLogin } from '@react-oauth/google';
import { useTranslation } from 'react-i18next';
import { AdUnits } from '@mui/icons-material';
import { Button } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import ReCAPTCHA from 'react-google-recaptcha';

import { accesModalActions } from '../../store/store';

import { login } from '../../services/api';

import logo from '../../assets/images/logo_trasnparent.png';
import { ReactComponent as Close } from '../../assets/svg/close.svg';

import { userActions } from '../../store/store';

import classes from './Login.module.css';
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isError, setIsError] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);

  const dispatch = useDispatch();

  const { t } = useTranslation();
  const lng = useSelector(state => state.localeStore.lng);

  const inputStyles = {
    m: '0.5rem 0',
    width: '100%',

    '& .MuiInputBase-root': {
      '& fieldset': {
        borderColor: 'rgb(0, 153, 130)',
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
      color: 'rgb(0, 153, 130)',
      transform: 'translate(0, -5px) scale(0.75)',
    },
    '& .Mui-focused .MuiInputBase-root': {
      '& fieldset': {
        borderColor: 'rgb(0, 153, 130)',
      },
    },
  };

  const handleGoogleSuccess = response => {
    const { credential } = response;
    // The `credential` here is a JWT token that you can send to your backend
    console.log('Google Sign-In successful, credential:', credential);

    // You can handle your signup logic here, for example:
    // 1. Send the credential to your backend for verification and user creation.
    // 2. Handle user redirect after successful sign-up.
  };

  const handleGetScore = e => {
    console.log(e.target.value);
  };

  const handleGoogleFailure = error => {
    // console.log('Google Sign-In failed:', error);
  };

  const handleCloseModal = () => {
    dispatch(accesModalActions.close());
  };

  const handleOpenSignup = () => {
    dispatch(accesModalActions.signup());
  };

  const handleOpenOtp = () => {
    dispatch(accesModalActions.otp());
  };

  const handleLogin = async () => {
    const serverRes = await login(email, password);
    if (serverRes.response.ok) {
      dispatch(userActions.set(serverRes.result.token));
    }
  };

  return (
    <div className={classes.content_wrapper}>
      <div className={classes.sheet}>
        <div className={classes.logo_wrapper}>
          <img className={classes.logo} src={logo} alt='' />
        </div>
        <div className={classes.login_wrapper}>
          <div className={classes.actions}>
            <div className={classes.ep}>
              <TextField
                id='outlined-emial-input'
                label={t('signup.email')}
                type='Email'
                autoComplete='current-password'
                size='small'
                sx={{
                  ...inputStyles,
                  textAlign: lng === 'fa' ? 'right' : 'left',
                  direction: lng === 'fa' ? 'rtl' : 'ltr',
                }}
                onChange={e => setEmail(e.target.value)}
              />
              <TextField
                id='outlined-password-input'
                label={t('signup.password')}
                type='password'
                autoComplete='current-password'
                size='small'
                sx={{
                  ...inputStyles,
                }}
                onChange={e => setPassword(e.target.value)}
              />

              {isError && (
                <div
                  className={classes.error_text}
                  style={{ direction: lng === 'fa' ? 'rtl' : 'ltr' }}
                >
                  {t('access.error')}
                </div>
              )}
              {isEmpty && (
                <div
                  className={classes.error_text}
                  style={{ direction: lng === 'fa' ? 'rtl' : 'ltr' }}
                >
                  {t('access.error_empty')}
                </div>
              )}
            </div>

            <ReCAPTCHA
              sitekey={`${process.env.REACT_APP_GOOGLE_RECAPTCHA_CLIENT_ID}`}
              className={classes.rec}
              onChange={handleGetScore}
            />

            <Button
              variant='contained'
              size='large'
              className={classes.login_btn}
              onClick={handleLogin}
            >
              {t('login')}
            </Button>

            <div className={classes.oneclick_login_wrapper}>
              <div className={classes.google_login_wrapper}>
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleFailure}
                  useOneTap={true}
                  theme='outline'
                />
              </div>
              <div
                className={classes.google_login_wrapper}
                onClick={handleOpenOtp}
              >
                <IconButton className={classes.mobile_login} disableRipple>
                  <AdUnits sx={{ fontSize: '20px !important' }} />
                  <p>Sign in with OTP</p>
                </IconButton>
              </div>
            </div>
            <div
              className={classes.signup_link}
              style={{ direction: lng === 'fa' ? 'rtl' : 'ltr' }}
            >
              <p>{t('access.create_acc')}</p>&nbsp;
              <button onClick={handleOpenSignup}>{t('signup.sign_up')}</button>
              &nbsp;
            </div>
          </div>
        </div>
        <IconButton
          className={classes.close_btn}
          disableRipple={true}
          onClick={handleCloseModal}
        >
          <Close width={30} height={30} />
        </IconButton>
      </div>
    </div>
  );
};

export default Login;
