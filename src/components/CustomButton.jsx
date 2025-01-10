import React from 'react';
import { Login } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import classes from './CustomButton.module.css';
const CustomButton = ({ children, onClick, ishomepage }) => {
  const lng = useSelector(state => state.localeStore.lng);
  return (
    <IconButton
      className={`${classes.draw} ${classes.custom_btn} ${
        ishomepage ? classes.black : classes.white
      }`}
      style={{ direction: lng === 'fa' ? 'rtl' : 'ltr' }}
      disableRipple
      onClick={onClick}
    >
      <span className={classes.icon_wrapper}>
        <Login
          sx={{
            width: '25px',
            height: '25px',
            transform: lng === 'fa' ? 'rotate(180deg)' : '',
          }}
          className={classes.card_icons}
        />
      </span>
      &nbsp;&nbsp;{children}&nbsp;&nbsp;
    </IconButton>
  );
};

export default CustomButton;
