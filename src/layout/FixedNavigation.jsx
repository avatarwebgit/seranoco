import React from 'react';
import { Login } from '@mui/icons-material';

import { ReactComponent as Heart } from '../assets/svg/heart_white.svg';
import { ReactComponent as Basket } from '../assets/svg/basket_white.svg';

import classes from './FixedNavigation.module.css';
import { IconButton } from '@mui/material';
const FixedNavigation = () => {
  return (
    <div className={classes.main}>
      <IconButton>
        <Login width={'20px'} height={'20px'} className={classes.svg} />
      </IconButton>
      <IconButton>
        <Heart width={'23px'} height={'23px'} className={classes.svg} />
      </IconButton>
      <IconButton>
        <Basket width={'23px'} height={'23px'} className={classes.svg} />
      </IconButton>
    </div>
  );
};

export default FixedNavigation;
