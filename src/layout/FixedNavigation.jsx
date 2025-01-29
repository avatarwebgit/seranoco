import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { drawerActions, accesModalActions } from '../store/store';

import { ReactComponent as Heart } from '../assets/svg/heart_white.svg';
import { ReactComponent as Basket } from '../assets/svg/basket_white.svg';
import { ReactComponent as Login } from '../assets/svg/signin_white.svg';

import classes from './FixedNavigation.module.css';
import { Avatar, Badge, IconButton } from '@mui/material';
import AccessAccount from './AccessAccount';
const FixedNavigation = () => {
  const [ModalOpen, setModalOpen] = useState(false);

  const dispatch = useDispatch();

  const lng = useSelector(state => state.localeStore.lng);
  const accessModal = useSelector(state => state.accessModalStore);
  const token = useSelector(state => state.userStore.token);
  const cart = useSelector(state => state.cartStore);
  const favorits = useSelector(state => state.favoriteStore.products);

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
        <Badge
          badgeContent={favorits?.length || 0}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Heart width={'23px'} height={'23px'} className={classes.svg} />
        </Badge>
      </IconButton>
      <IconButton onClick={handleOpenCart}>
        <Badge
          badgeContent={cart?.products.length || 0}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Basket width={'23px'} height={'23px'} className={classes.svg} />
        </Badge>
      </IconButton>
      <AccessAccount open={accessModal.modalOpen} onClose={handleCloseModal} />
    </div>
  );
};

export default FixedNavigation;
