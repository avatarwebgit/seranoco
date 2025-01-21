import React, { useEffect, useRef, useState } from 'react';
import { IconButton, InputAdornment, TextField } from '@mui/material';
import { GoogleLogin, useGoogleLogin } from '@react-oauth/google';
import { useTranslation } from 'react-i18next';
import {
  AdUnits,
  Google,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import { Button } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import ReCAPTCHA from 'react-google-recaptcha';

import { accesModalActions } from '../../store/store';

import { login, useUser } from '../../services/api';

import { ReactComponent as Close } from '../../assets/svg/close.svg';

import { userActions } from '../../store/store';

import classes from './Login.module.css';
import { notify } from '../../utils/helperFunctions';
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isError, setIsError] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();

  const { t } = useTranslation();
  const lng = useSelector(state => state.localeStore.lng);

  const googleLogin = useGoogleLogin({
    onSuccess: token => console.log(token),
    flow: 'auth-code',
    login_hint: '',
  });

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

  const handleGetScore = value => {
    try {
      console.log(value);
    } catch (error) {
      // console.error('Error getting reCAPTCHA score:', error);
    }
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
      dispatch(accesModalActions.close());
      notify('Wellcome Back');
    }
  };

  return (
    <div className={classes.content_wrapper}>
      <div className={classes.sheet}>
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
              <TextField
                id='outlined-password-input'
                label={t('signup.password')}
                type={showPassword ? 'text' : 'password'}
                size='small'
                sx={{
                  ...inputStyles,
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='end'>
                      <IconButton
                        aria-label='show'
                        style={{ width: '20px', height: 'auto' }}
                        onClick={() => setShowPassword(!showPassword)}
                        disableRipple
                      >
                        {showPassword ? (
                          <Visibility fontSize='5' />
                        ) : (
                          <VisibilityOff fontSize='5' />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
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
              style={{ width: '100%' }}
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
                <IconButton
                  className={classes.mobile_login}
                  disableRipple
                  onClick={() => googleLogin()}
                >
                  <Google sx={{ fontSize: '20px !important' }} />
                  <p>{t('access.swg')}</p>
                </IconButton>
              </div>
              <div
                className={classes.google_login_wrapper}
                onClick={handleOpenOtp}
              >
                <IconButton className={classes.mobile_login} disableRipple>
                  <AdUnits sx={{ fontSize: '20px !important' }} />
                  <p>{t('access.swotp')}</p>
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
