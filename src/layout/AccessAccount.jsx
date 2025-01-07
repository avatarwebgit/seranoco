import React from 'react';
import { Modal, TextField } from '@mui/material';

import classes from './AccessAccount.module.css';
const AccessAccount = ({ open, onClose }) => {
  return (
    <Modal className={classes.modal_parent} open={open} onClose={onClose}>
      <div className={classes.content_wrapper}>
        <div className={classes.login_wrapper}>
          <div className={classes.actions}>
            <TextField
              id='outlined-password-input'
              label='Email'
              type='Email'
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
                  color: '#000000',
                  fontSize: '18px',
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
              label='Password'
              type='password'
              autoComplete='current-password'
              size='small'
              sx={{
                '& .MuiInputBase-root': {
                  '& fieldset': {
                    borderColor: 'rgb(0, 153, 130)',
                  },
                },
                '& .MuiInputBase-input': {
                  color: '#000000',
                  fontSize: '18px',
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
          </div>
        </div>
        <div className={classes.signup_wrapper}></div>
      </div>
    </Modal>
  );
};

export default AccessAccount;
