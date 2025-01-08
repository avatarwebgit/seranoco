import React, { useState } from 'react';
import { TextField } from '@mui/material';
import { GoogleLogin } from '@react-oauth/google';
import { useTranslation } from 'react-i18next';
import { Button } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';

import { accesModalActions } from '../../store/store';

import logo from '../../assets/images/logo_trasnparent.png';

import classes from './Signup.module.css';
const Signup = () => {
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [isError, setIsError] = useState(true);
  const [isEmpty, setIsEmpty] = useState(false);

  const { t } = useTranslation();
  const lng = useSelector(state => state.localeStore.lng);

  const dispatch = useDispatch();

  const handleGoogleSuccess = response => {
    const { credential } = response;
    // The `credential` here is a JWT token that you can send to your backend
    console.log('Google Sign-In successful, credential:', credential);

    // You can handle your signup logic here, for example:
    // 1. Send the credential to your backend for verification and user creation.
    // 2. Handle user redirect after successful sign-up.
  };

  const handleGoogleFailure = error => {
    console.log('Google Sign-In failed:', error);
  };
  const handleGoToLogin = () => {
    dispatch(accesModalActions.login());
  };
  return (
    <div className={classes.content_wrapper}>
      <div className={classes.logo_wrapper}>
        <img className={classes.logo} src={logo} alt='' />
      </div>
      <div className={classes.login_wrapper}>
        <div className={classes.actions}>
          <div className={classes.ep}>
            <TextField
              id='outlined-password-input'
              label={t('signup.fname')}
              type='text'
              autoComplete='current-password'
              size='small'
              sx={{
                mb: '0.5rem',
                '& .MuiInputBase-root': {
                  '& fieldset': {
                    borderColor: 'rgb(0, 153, 130)',
                  },
                },
                '& .MuiInputBase-input': {
                  color: 'rgb(0, 153, 130)',
                  fontSize: '16px',
                },
                '& .MuiInputLabel-root': {
                  color: 'gray',
                  fontSize: '14px',
                },
                '& .Mui-focused .MuiInputLabel-root': {
                  color: 'rgb(0, 153, 130)',
                },
                '& .Mui-focused .MuiInputBase-root': {
                  '& fieldset': {
                    borderColor: 'rgb(0, 153, 130)',
                  },
                },
              }}
              onChange={e => {
                setFirstname(e.target.value);
              }}
            />
            <TextField
              id='outlined-password-input'
              label={t('signup.lname')}
              type='text'
              autoComplete='current-password'
              size='small'
              sx={{
                mb: '0.5rem',
                '& .MuiInputBase-root': {
                  '& fieldset': {
                    borderColor: 'rgb(0, 153, 130)',
                  },
                },
                '& .MuiInputBase-input': {
                  color: 'rgb(0, 153, 130)',
                  fontSize: '16px',
                },
                '& .MuiInputLabel-root': {
                  color: 'gray',
                  fontSize: '14px',
                },
                '& .Mui-focused .MuiInputLabel-root': {
                  color: 'rgb(0, 153, 130)',
                },
                '& .Mui-focused .MuiInputBase-root': {
                  '& fieldset': {
                    borderColor: 'rgb(0, 153, 130)',
                  },
                },
              }}
              onChange={e => {
                setLastname(e.target.value);
              }}
            />
            <TextField
              id='outlined-emial-input'
              label={t('email')}
              type='email'
              autoComplete='current-password'
              size='small'
              sx={{
                mb: '0.5rem',
                '& .MuiInputBase-root': {
                  '& fieldset': {
                    borderColor: 'rgb(0, 153, 130)',
                  },
                },
                '& .MuiInputBase-input': {
                  color: 'rgb(0, 153, 130)',
                  fontSize: '16px',
                },
                '& .MuiInputLabel-root': {
                  color: 'gray',
                  fontSize: '14px',
                },
                '& .Mui-focused .MuiInputLabel-root': {
                  color: 'rgb(0, 153, 130)',
                },
                '& .Mui-focused .MuiInputBase-root': {
                  '& fieldset': {
                    borderColor: 'rgb(0, 153, 130)',
                  },
                },
              }}
              onChange={e => {
                setEmail(e.target.value);
              }}
            />
            <TextField
              id='outlined-password-input'
              label='Password'
              type='password'
              autoComplete='current-password'
              size='small'
              sx={{
                mb: '0.5rem',
                '& .MuiInputBase-root': {
                  '& fieldset': {
                    borderColor: 'rgb(0, 153, 130)',
                  },
                },
                '& .MuiInputBase-input': {
                  color: 'rgb(0, 153, 130)',
                  fontSize: '16px',
                },
                '& .MuiInputLabel-root': {
                  color: 'gray',
                  fontSize: '14px',
                },
                '& .Mui-focused .MuiInputLabel-root': {
                  color: 'rgb(0, 153, 130)',
                },
                '& .Mui-focused .MuiInputBase-root': {
                  '& fieldset': {
                    borderColor: 'rgb(0, 153, 130)',
                  },
                },
              }}
              onChange={e => {
                setPassword(e.target.value);
              }}
            />
            <TextField
              id='outlined-password-input'
              label={`${t('signup.repeat')} ${t('signup.password')}`}
              type='password'
              autoComplete='current-password'
              size='small'
              sx={{
                mb: '0.5rem',
                '& .MuiInputBase-root': {
                  '& fieldset': {
                    borderColor: 'rgb(0, 153, 130)',
                  },
                },
                '& .MuiInputBase-input': {
                  color: 'rgb(0, 153, 130)',
                  fontSize: '16px',
                },
                '& .MuiInputLabel-root': {
                  color: 'gray',
                  fontSize: '14px',
                },
                '& .Mui-focused .MuiInputLabel-root': {
                  color: 'rgb(0, 153, 130)',
                },
                '& .Mui-focused .MuiInputBase-root': {
                  '& fieldset': {
                    borderColor: 'rgb(0, 153, 130)',
                  },
                },
              }}
            />
            <TextField
              id='outlined-password-input'
              label={t('signup.pnumber')}
              type='text'
              autoComplete='current-password'
              size='small'
              sx={{
                mb: '0.5rem',
                '& .MuiInputBase-root': {
                  '& fieldset': {
                    borderColor: 'rgb(0, 153, 130)',
                  },
                },
                '& .MuiInputBase-input': {
                  color: 'rgb(0, 153, 130)',
                  fontSize: '16px',
                },
                '& .MuiInputLabel-root': {
                  color: 'gray',
                  fontSize: '14px',
                },
                '& .Mui-focused .MuiInputLabel-root': {
                  color: 'rgb(0, 153, 130)',
                },
                '& .Mui-focused .MuiInputBase-root': {
                  '& fieldset': {
                    borderColor: 'rgb(0, 153, 130)',
                  },
                },
              }}
              onChange={e => {
                setPassword(e.target.value);
              }}
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

          <Button
            variant='contained'
            size='large'
            className={classes.login_btn}
          >
            {t('signup.sign_up')}
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
          </div>
          <div
            className={classes.signup_link}
            style={{ direction: lng === 'fa' ? 'rtl' : 'ltr' }}
          >
            <p>{t('access.have_acc')}</p>&nbsp;
            <button onClick={handleGoToLogin}>{t('login')}</button>&nbsp;
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
