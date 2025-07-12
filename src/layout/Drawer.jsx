import { KeyboardArrowRight, Lock } from '@mui/icons-material';
import {
 FormControlLabel,
 FormGroup,
 IconButton,
 Skeleton,
 styled,
 Switch,
} from '@mui/material';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { ReactComponent as Close } from '../assets/svg/close.svg';

import {
 accesModalActions,
 cartActions,
 drawerActions,
 walletActions,
} from '../store/store';

import CartProduct from '../components/card/CartProduct';

import { getShoppingCart } from '../services/api';
import { formatNumber } from '../utils/helperFunctions';

import classes from './Drawer.module.css';
const IOSSwitch = styled(props => (
 <Switch focusVisibleClassName='.Mui-focusVisible' disableRipple {...props} />
))(({ theme }) => ({
 width: 42,
 height: 26,
 padding: 0,
 display: 'flex',
 '& .MuiSwitch-switchBase': {
  padding: 0,
  margin: 2,
  transition: 'transform 300ms',
  '&.Mui-checked': {
   transform: 'translateX(16px)',
   color: '#fff',
   '& + .MuiSwitch-track': {
    backgroundColor: '#000',
    opacity: 1,
    border: 0,
   },
  },
 },
 '& .MuiSwitch-thumb': {
  boxSizing: 'border-box',
  width: 22,
  height: 22,
  transition: 'all 300ms',
 },
 '& .MuiSwitch-track': {
  borderRadius: 13,
  backgroundColor: '#c2c2c2',
  opacity: 1,
  transition: 'background-color 300ms',
 },
}));
const Drawer = ({ children, size }) => {
 const dispatch = useDispatch();
 const drawerState = useSelector(state => state.drawerStore.drawerOpen);
 const cart = useSelector(state => state.cartStore);
 const lng = useSelector(state => state.localeStore.lng);
 const token = useSelector(state => state.userStore.token);
 const walletBalance = useSelector(state => state.walletStore.balance);
 const walletStatus = useSelector(state => state.walletStore.useWallet);

 const [isLoadingData, setIsLoadingData] = useState(true);

 const [productData, setProductData] = useState([]);

 const { t } = useTranslation();

 const toggleDrawer = () => {
  dispatch(drawerActions.close());
 };

 const handleGetShoppingCart = async () => {
  try {
   setIsLoadingData(true);
   const serverRes = await getShoppingCart(token);

   if (serverRes.response.ok) {
    dispatch(cartActions.set(serverRes.result.cart));
    dispatch(walletActions.setBalance(serverRes.result.wallet_balance));
   }
  } catch (error) {
   setIsLoadingData(false);
  } finally {
   setIsLoadingData(false);
  }
 };

 useEffect(() => {
  if (drawerState && token) {
   handleGetShoppingCart();
   document.body.style.overflow = 'hidden';
  } else {
   document.body.style.overflow = '';
  }

  return () => {
   document.body.style.overflow = '';
  };
 }, [drawerState, token]);

 useEffect(() => {
  if (cart.products || drawerState) {
   setProductData(cart.products);
  }
 }, [cart, drawerState]);

 useEffect(() => {
  if (walletBalance > 0) {
   if (walletStatus) {
    dispatch(
     cartActions.setTotalPriceAfterDiscout(
      Math.max(cart?.totalPrice - walletBalance, 0),
     ),
    );
   } else {
    dispatch(cartActions.setTotalPriceAfterDiscout(cart?.totalPrice));
   }
  } else {
   dispatch(walletActions.setWalletUse(false));
  }
 }, [cart.totalPrice, walletBalance, walletStatus]);

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
      <h2>{t('shopping_cart.cart')}</h2>
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
      {productData.map(el => {
       return <CartProduct key={el.id} data={el} />;
      })}
     </div>
    </div>

    <div className={classes.wallet_wrapper}>
     {isLoadingData ? (
      <Skeleton variant='text' className={classes.skeleton} animation='wave' />
     ) : (
      <div
       className={classes.total}
       style={{ direction: lng === 'fa' ? 'rtl' : 'ltr' }}>
       <p>{t('shopping_cart.total')}&nbsp;:&nbsp;</p>
       <div>
        {cart.totalPrice && lng !== 'fa'
         ? cart?.totalPrice?.toFixed(2)
         : formatNumber(Math.round(cart.totalPrice * cart.euro))}
        &nbsp;
        {t('m_unit')}
       </div>
      </div>
     )}
     {
      <div className={classes.wallet_btn_wrapper}>
       <FormGroup
        sx={{
         display: 'flex',
         flexDirection: 'column',
         alignContent: 'center',
         justifyContent: 'center',
         direction: 'rtl',
        }}>
        <FormControlLabel
         disabled={walletBalance <= 0}
         control={
          <IOSSwitch
           checked={walletStatus}
           onChange={e => {
            dispatch(walletActions.setWalletUse(e.target.checked));
            dispatch(walletActions.setUserIntraction());
           }}
          />
         }
         label={t('use_wallet')}
         sx={{
          display: 'flex',
          flexDirection: 'column-reverse',
          alignContent: 'flex-start',
          '& .MuiFormControlLabel-label': {
           fontSize: '0.5rem',
           color: '#000000',
           padding: '0 5px',
          },
         }}
        />
       </FormGroup>
       {isLoadingData && walletBalance > 0 ? (
        <Skeleton
         variant='text'
         className={classes.skeleton}
         animation='wave'
        />
       ) : (
        <div
         style={{
          direction: lng === 'fa' ? 'rtl' : 'ltr',
          display: 'flex',
          color: walletStatus ? '#000000' : '#616161',
         }}>
         <p style={{ whiteSpace: 'nowrap' }}>{t('wallet')}&nbsp;:&nbsp;</p>
         <span dir='ltr' style={{ margin: '0 10px' }}>
          {lng !== 'fa'
           ? walletBalance
           : formatNumber(walletBalance * cart.euro)}
          &nbsp;
         </span>
         {t('m_unit')}
        </div>
       )}
      </div>
     }
    </div>
    <div className={classes.actions_wrapper}>
     {token ? (
      <Link to={`/${lng}/precheckout`} target='_blank'>
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
       }}>
       <Lock fontSize='17px !important' />
       &nbsp;&nbsp; {t('login')}&nbsp;&nbsp;
      </IconButton>
     )}

     {isLoadingData ? (
      <Skeleton variant='text' className={classes.skeleton} animation='wave' />
     ) : (
      <div
       className={classes.total}
       style={{ direction: lng === 'fa' ? 'rtl' : 'ltr' }}>
       <p>{t('payment')}&nbsp;:&nbsp;</p>
       <div>
        {walletStatus ? (
         <>
          {cart.totalPrice && walletBalance && (
           <>
            {console.log(cart)}
            {lng !== 'fa'
             ? cart.totalPriceAfterDiscount.toFixed(2)
             : formatNumber(
                Math.round(cart.totalPriceAfterDiscount * cart.euro),
               )}
            &nbsp;
            {t('m_unit')}
           </>
          )}
         </>
        ) : (
         <>
          {lng !== 'fa'
           ? cart?.totalPrice?.toFixed(2)
           : formatNumber(Math.round(cart.totalPrice * cart.euro))}
          &nbsp;
          {t('m_unit')}
         </>
        )}
       </div>
      </div>
     )}
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
