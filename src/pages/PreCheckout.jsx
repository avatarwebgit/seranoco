import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { cartActions, drawerActions, walletActions } from '../store/store';

import BannerCarousel from '../components/BannerCarousel';
import Checkout from '../components/checkout/Checkout';
import Payment from '../components/checkout/Payment';
import ShoppingCart from '../components/checkout/ShoppingCart';
import CustomStepper from '../components/common/CustomStepper';
import Body from '../components/filters_page/Body';
import Card from '../components/filters_page/Card';
import Footer from '../layout/Footer';
import Header from '../layout/Header';

import { getOrderStatusDetail, getPayments } from '../services/api';

import {
 Button,
 FormControlLabel,
 FormGroup,
 styled,
 Switch,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PaymentMethod from '../components/checkout/PaymentMethod';
import { formatNumber, notify } from '../utils/helperFunctions';

import classes from './PreCheckout.module.css';
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
const PreCheckout = ({ windowSize }) => {
 const [step, setStep] = useState(0);
 const [isDataValid, setIsDataValid] = useState(false);
 const [paymentMethods, setPaymentMethods] = useState([]);
 const [detailsData, setDetailsData] = useState([]);

 const { t } = useTranslation();

 const card = useSelector(state => state.cartStore);
 const lng = useSelector(state => state.localeStore.lng);
 const token = useSelector(state => state.userStore.token);
 const euro = useSelector(state => state.cartStore.euro);
 const walletBalance = useSelector(state => state.walletStore.balance);
 const cart = useSelector(state => state.cartStore);
 const walletStatus = useSelector(state => state.walletStore.useWallet);

 const dispatch = useDispatch();
 const navigate = useNavigate();

 const p = async () => {
  const serverRes = await getPayments();
  if (serverRes.response.ok) {
   setPaymentMethods(serverRes.result.data);
  }
 };

 const handleGetdetails = async orderId => {
  if (orderId) {
   const serverRes = await getOrderStatusDetail(token, orderId);

   if (serverRes.response.ok) {
    setDetailsData(serverRes.result.orders);
   } else {
    notify(t('trylater'));
   }
  }
 };

 useEffect(() => {
  document.title = t('precheckout');
  dispatch(drawerActions.close());
  dispatch(cartActions.calculateTotalPrice());
  p();
  handleGetdetails();
 }, []);

//  useEffect(() => {
//   if (card.products.length === 0) {
//    navigate(`/${lng}/`);
//   }
//  }, [card]);

 const handleGotoNextStep = () => {
  if (step === 0) {
   const products = card.products.filter(el => el.selected_quantity !== 0);
   dispatch(cartActions.setFinalCart(products));
   setStep(step < 2 ? step + 1 : 2);
  }
  if (step === 1 && isDataValid) {
   setStep(step < 2 ? step + 1 : 2);
  }
 };

 return (
  <div className={classes.main}>
   <BannerCarousel />
   <Header windowSize={windowSize} />
   <CustomStepper activeStep={step} className={classes.stepper} />
   <Body>
    <Card className={classes.card}>
     {step === 0 && <ShoppingCart />}
     {step === 1 && <Checkout isDataValid={setIsDataValid} />}
     {step === 2 && <Payment />}
     <div className={classes.action_wrapper}>
      <div
       className={classes.total_wrapper}
       style={{ direction: lng === 'fa' ? 'rtl' : 'ltr' }}>
       <span className={classes.title}>{t('pc.payment')}</span>
       {card && (
        <>
         {step !== 2 ? (
          <span className={classes.amont}>
           {lng !== 'fa'
            ? card?.totalPrice?.toFixed(2)
            : formatNumber(+card?.totalPrice * card.euro)}
           &nbsp;{t('m_unit')}
          </span>
         ) : (
          <span className={classes.amont}>
           {lng !== 'fa'
            ? card?.finalPayment.toFixed(2)
            : formatNumber(+card?.finalPayment * card.euro)}
           &nbsp;{t('m_unit')}
          </span>
         )}
        </>
       )}
      </div>
      <div
       className={classes.total_wrapper}
       style={{ direction: lng === 'fa' ? 'rtl' : 'ltr' }}>
       <span className={classes.title}>{t('pc.off')}</span>
       <FormGroup
        sx={{
         display: 'flex',
         flexDirection: 'column',
         alignContent: 'center',
         justifyContent: 'center',
         direction: 'rtl',
        }}>
        <FormControlLabel
         disabled={!walletBalance > 0}
         control={
          <IOSSwitch
           checked={walletStatus}
           onChange={e => {
            dispatch(walletActions.setWalletUse(e.target.checked));
            dispatch(walletActions.setUserIntraction());
           }}
          />
         }
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
       {step !== 2 && (
        <span
         className={classes.amont}
         style={{ color: walletBalance && walletStatus ? '#000' : '#c2c2c2' }}>
         {walletBalance && lng !== 'fa' ? walletBalance : walletBalance}
         &nbsp;{t('m_unit')}
        </span>
       )}
      </div>
      <div
       className={classes.total_wrapper}
       style={{ direction: lng === 'fa' ? 'rtl' : 'ltr' }}>
       <span className={classes.title}>{t('pc.dprice')}</span>
       {step !== 3 && (
        <span className={classes.amont}>
         {walletStatus ? (
          <>
           {lng !== 'fa'
            ? cart.totalPriceAfterDiscount.toFixed(2)
            : formatNumber(
               Math.round(cart.totalPriceAfterDiscount * cart.euro),
              )}
           &nbsp;
           {t('m_unit')}
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
        </span>
       )}
      </div>
      {step < 2 && (
       <Button
        className={classes.step_btn}
        onClick={handleGotoNextStep}
        variant='contained'
        size='large'
        disabled={step === 1 && !isDataValid}>
        {t('pc.nstep')}
       </Button>
      )}
      {step === 2 && <PaymentMethod dataProps={paymentMethods} />}
      <Button
       className={classes.step_btn_back}
       onClick={() => setStep(step > 0 ? step - 1 : 0)}
       variant='text'
       size='large'>
       {t('pc.pstep')}
      </Button>
     </div>
    </Card>
   </Body>

   <Footer />
  </div>
 );
};

export default PreCheckout;
