import React from 'react';

import classes from './CustomButton.module.css';
import { Login } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { useSelector } from 'react-redux';
const CustomButton = ({ children }) => {
  const lng = useSelector(state => state.localeStore.lng);
  return (
    <IconButton
      className={`${classes.draw} ${classes.custom_btn}`}
      style={{ direction: lng === 'fa' ? 'rtl' : 'ltr' }}
      disableRipple
    >
      <span className={classes.icon_wrapper}>
        <Login
          sx={{
            width: '25px',
            height: '25px',
            transform: lng === 'fa' ? 'rotate(180deg)' : '',
          }}
          color='#000000'
          className={classes.card_icons}
        />
      </span>
      {children}
    </IconButton>
  );
};

export default CustomButton;
