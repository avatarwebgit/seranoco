import { KeyboardArrowRight, Lock } from '@mui/icons-material';
import {
 FormControlLabel,
 FormGroup,
 IconButton,
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
 const [payWithWalletChecked, setPayWithWalletChecked] = useState(false);
 const dispatch = useDispatch();
 const drawerState = useSelector(state => state.drawerStore.drawerOpen);
 const cart = useSelector(state => state.cartStore);
 const lng = useSelector(state => state.localeStore.lng);
 const token = useSelector(state => state.userStore.token);
 const walletBalance = useSelector(state => state.walletStore.balance);
 const walletStatus = useSelector(state => state.walletStore.useWallet);

 const [productData, setProductData] = useState([]);

 const { t } = useTranslation();

 const toggleDrawer = () => {
  dispatch(drawerActions.close());
 };

 const handleGetShoppingCart = async () => {
  const serverRes = await getShoppingCart(token);
  if (serverRes.response.ok) {
   dispatch(cartActions.set(serverRes.result.cart));
   dispatch(walletActions.setBalance(serverRes.result.wallet_balance));
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

//  useEffect(() => {
//   dispatch(walletActions.setWalletUse(payWithWalletChecked));
//   if (payWithWalletChecked) {
//    dispatch(
//     cartActions.setTotalPrice(Math.max(cart?.totalPrice - walletBalance, 0)),
//    );
//   } else {
//    dispatch(cartActions.setTotalPrice(cart?.totalPrice));
//   }
//  }, [payWithWalletChecked]);

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
     <div
      className={classes.total}
      style={{ direction: lng === 'fa' ? 'rtl' : 'ltr' }}>
      <p>{t('shopping_cart.total')}&nbsp;:&nbsp;</p>
      <div>
       {cart.totalPriceBeforeDiscount && lng !== 'fa'
        ? cart?.totalPriceBeforeDiscount?.toFixed(2)
        : formatNumber(Math.round(cart.totalPriceBeforeDiscount * cart.euro))}
       &nbsp;
       {t('m_unit')}
      </div>
     </div>
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
        control={
         <IOSSwitch
          checked={payWithWalletChecked}
          onChange={e => setPayWithWalletChecked(e.target.checked)}
         />
        }
        label={t('pay_by_wallet')}
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
      <div
       style={{
        direction: lng === 'fa' ? 'rtl' : 'ltr',
        display: 'flex',
        color: payWithWalletChecked ? '#000000' : '#616161',
       }}>
       <p style={{ whiteSpace: 'nowrap' }}>{t('wallet')}&nbsp;:&nbsp;</p>
       <span dir='ltr'>
        -
        {walletBalance && lng !== 'fa'
         ? walletBalance?.toFixed(2)
         : formatNumber(Math.round(walletBalance * cart.euro))}
        &nbsp;
       </span>
       {t('m_unit')}
      </div>
     </div>
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

     <div
      className={classes.total}
      style={{ direction: lng === 'fa' ? 'rtl' : 'ltr' }}>
      <p>{t('payment')}&nbsp;:&nbsp;</p>
      <div>
       {walletStatus ? (
        <>
         {cart.totalPrice && walletBalance && lng !== 'fa'
          ? Math.max(cart?.totalPrice - walletBalance, 0).toFixed(2)
          : formatNumber(
             Math.round(
              Math.max(cart?.totalPrice - walletBalance, 0) * cart.euro,
             ),
            )}
         &nbsp;
         {t('m_unit')}
        </>
       ) : (
        <>
         {cart.totalPrice && walletBalance && lng !== 'fa'
          ? cart?.totalPrice?.toFixed(2)
          : formatNumber(Math.round(cart.totalPrice * cart.euro))}
         &nbsp;
         {t('m_unit')}
        </>
       )}
      </div>
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

export default Drawer;
