import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { accesModalActions, cartActions, drawerActions } from '../store/store';
import { ReactComponent as Close } from '../assets/svg/close.svg';
import { IconButton } from '@mui/material';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { KeyboardArrowRight, Lock } from '@mui/icons-material';

import CartProduct from '../components/card/CartProduct';

import classes from './Drawer.module.css';
const Drawer = ({ children, size }) => {
  const dispatch = useDispatch();
  const drawerState = useSelector(state => state.drawerStore.drawerOpen);
  const cart = useSelector(state => state.cartStore);

  const lng = useSelector(state => state.localeStore.lng);
  const token = useSelector(state => state.userStore.token);

  const { t } = useTranslation();

  const toggleDrawer = () => {
    dispatch(drawerActions.close());
  };

  useEffect(() => {
    if (drawerState) {
      dispatch(cartActions.calculateTotalPrice());
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
      transition={{ duration: 0.3, delay: drawerState ? 0 : 0.3 }}
    >
      <motion.div
        className={classes.content}
        initial={{ x: '-100%' }}
        animate={{ x: drawerState ? 0 : '-100%' }}
        transition={{ type: 'spring', bounce: false, duration: 0.3 }}
      >
        <div
          className={classes.header_wrapper}
          style={{ flexDirection: lng === 'fa' ? 'row-reverse' : 'row' }}
        >
          <span className={classes.header_text}>
            <h2>{t('shopping_cart.cart')}</h2>
          </span>
          <IconButton
            className={classes.close_btn}
            onClick={toggleDrawer}
            disableRipple={true}
          >
            <Close className={classes.close_icon} />
          </IconButton>
        </div>
        <div className={classes.items_wrapper}>
          <div className={classes.items_sheet}>
            {cart.products.map(el => {
              return <CartProduct key={el.id} data={el} />;
            })}
          </div>
        </div>

        <div className={classes.actions_wrapper}>
          {token ? (
            <Link to={`/${lng}/precheckout`}>
              <IconButton className={classes.pay_btn} disableRipple={true}>
                <KeyboardArrowRight fontSize='10' />
                &nbsp;&nbsp; {t('shopping_cart.pay')}&nbsp;&nbsp;
              </IconButton>
            </Link>
          ) : (
            <IconButton
              className={classes.pay_btn}
              onClick={() => {
                dispatch(accesModalActions.login());
              }}
            >
              <Lock fontSize='17px !important' />
              &nbsp;&nbsp; {t('login')}&nbsp;&nbsp;
            </IconButton>
          )}
          <span
            className={classes.total}
            style={{ direction: lng === 'fa' ? 'rtl' : 'ltr' }}
          >
            <p>{t('shopping_cart.total')}&nbsp;:&nbsp;</p>
            <span>
              {cart.totalPrice.toFixed(2)}&nbsp;{t('m_unit')}
            </span>
          </span>
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

export default Drawer;
