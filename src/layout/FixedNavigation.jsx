import React from 'react';
import { Login } from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';

import { drawerActions } from '../store/store';

import { ReactComponent as Heart } from '../assets/svg/heart_white.svg';
import { ReactComponent as Basket } from '../assets/svg/basket_white.svg';

import classes from './FixedNavigation.module.css';
import { IconButton } from '@mui/material';
const FixedNavigation = () => {
  const dispatch = useDispatch();
  const lng = useSelector(state => state.localeStore.lng);
  const handleOpenCart = () => {
    dispatch(drawerActions.open());
  };
  return (
    <div className={classes.main}>
      <IconButton>
        <a href={`/${lng}/myaccount`}>
          <Login width={'20px'} height={'20px'} className={classes.svg} />
        </a>
      </IconButton>
      <IconButton>
        <Heart width={'23px'} height={'23px'} className={classes.svg} />
      </IconButton>
      <IconButton onClick={handleOpenCart}>
        <Basket width={'23px'} height={'23px'} className={classes.svg} />
      </IconButton>
    </div>
  );
};

export default FixedNavigation;
