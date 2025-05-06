import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import {
 accesModalActions,
 cartActions,
 drawerActions,
 favoriteActions,
} from '../store/store';
import { ReactComponent as Close } from '../assets/svg/close.svg';
import { IconButton } from '@mui/material';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { KeyboardArrowRight, Lock } from '@mui/icons-material';

import CartProduct from '../components/card/CartProduct';

import classes from './Drawer.module.css';
import { getAllFavorites } from '../services/api';
import FavoriteCart from '../components/card/FavoriteCart';
const FavoritesDrawer = ({ children, size }) => {
 const dispatch = useDispatch();
 const drawerState = useSelector(state => state.drawerStore.favoritesDrawer);

 const lng = useSelector(state => state.localeStore.lng);
 const token = useSelector(state => state.userStore.token);
 const favorites = useSelector(state => state.favoriteStore.products);

 const { t } = useTranslation();

 const toggleDrawer = () => {
  dispatch(drawerActions.favoritesClose());
 };

 const getFavoriteItems = async () => {
  const serverRes = await getAllFavorites(token);
  if (serverRes.response.ok) {
   dispatch(favoriteActions.setFetchedProducts(serverRes.result.wishlist));
  }
 };

 useEffect(() => {
  if ((token, drawerState)) {
   getFavoriteItems();
  }
 }, [token, drawerState]);

 useEffect(() => {
  if (drawerState) {
   document.body.style.overflow = 'hidden';
  } else {
   document.body.style.overflow = '';
  }

  return () => {
   document.body.style.overflow = '';
  };
 }, [drawerState]);

 return (
  <motion.div
   className={`${classes.main}`}
   initial={{ display: 'none' }}
   animate={{ display: drawerState ? 'flex' : 'none' }}
   transition={{ duration: 0.3, delay: drawerState ? 0 : 0.3 }}>
   <motion.div
    className={classes.content}
    initial={{ x: '-100%' }}
    animate={{ x: drawerState ? 0 : '-100%' }}
    transition={{ type: 'spring', bounce: false, duration: 0.3 }}>
    <div
     className={classes.header_wrapper}
     style={{ flexDirection: lng === 'fa' ? 'row-reverse' : 'row' }}>
     <span className={classes.header_text}>
      <h2>{t('profile.favorites')}</h2>
     </span>
     <IconButton
      className={classes.close_btn}
      onClick={toggleDrawer}
      disableRipple={true}>
      <Close className={classes.close_icon} />
     </IconButton>
    </div>
    <div className={classes.items_wrapper}>
     <div className={classes.items_sheet}>
      {favorites &&
       favorites.map(el => {
        return <FavoriteCart key={el.id} data={el} />;
       })}
     </div>
    </div>
   </motion.div>
   <motion.div
    className={classes.backdrop}
    initial={{ display: 'none', opacity: 0 }}
    animate={{
     display: drawerState ? 'flex' : 'none',
     opacity: drawerState ? 1 : 0,
    }}
    onClick={toggleDrawer}
    transition={{ duration: 0.3 }}
   />
  </motion.div>
 );
};

export default FavoritesDrawer;
