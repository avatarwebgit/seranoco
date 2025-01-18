import React, { useState } from 'react';
import { Login } from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';

import { drawerActions, accesModalActions } from '../store/store';

import { ReactComponent as Heart } from '../assets/svg/heart_white.svg';
import { ReactComponent as Basket } from '../assets/svg/basket_white.svg';

import classes from './FixedNavigation.module.css';
import { Avatar, IconButton } from '@mui/material';
import AccessAccount from './AccessAccount';
const FixedNavigation = () => {
  const [ModalOpen, setModalOpen] = useState(false);

  const dispatch = useDispatch();

  const lng = useSelector(state => state.localeStore.lng);
  const accessModal = useSelector(state => state.accessModalStore);
  const token = useSelector(state => state.userStore.token);

  const handleOpenCart = () => {
    dispatch(drawerActions.open());
  };

  const handleOpenLogin = () => {
    setModalOpen(true);
    dispatch(accesModalActions.login());
  };

  const handleCloseModal = () => {
    dispatch(accesModalActions.close());
  };

  return (
    <div className={classes.main}>
      <>
        {token ? (
          <IconButton>
            <Avatar className={classes.avatar} />
          </IconButton>
        ) : (
          <IconButton onClick={handleOpenLogin}>
            <Login width={'20px'} height={'20px'} className={classes.svg} />
          </IconButton>
        )}
      </>

      <IconButton>
        <Heart width={'23px'} height={'23px'} className={classes.svg} />
      </IconButton>
      <IconButton onClick={handleOpenCart}>
        <Basket width={'23px'} height={'23px'} className={classes.svg} />
      </IconButton>
      <AccessAccount open={accessModal.modalOpen} onClose={handleCloseModal} />
    </div>
  );
};

export default FixedNavigation;
