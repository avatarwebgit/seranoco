import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { cartActions } from '../../store/store';

import { useTranslation } from 'react-i18next';
import { sendCartPrice } from '../../services/api';
import { notify } from '../../utils/helperFunctions';

import classes from './PaymentMethod.module.css';
const PaymentMethod = ({ dataProps }) => {
 const lng = useSelector(state => state.localeStore.lng);
 const cart = useSelector(state => state.cartStore);
 const token = useSelector(state => state.userStore.token);
 const walletStatus = useSelector(state => state.walletStore.useWallet);

 const dispatch = useDispatch();
 const navigate = useNavigate();

 const { t } = useTranslation();

 const [data, setData] = useState(null);

 useEffect(() => {
  if (dataProps) {
   setData(dataProps);
  }
 }, [dataProps]);

 const handleSetPaymentMethod = async id => {
  dispatch(cartActions.setPaymentMethod(id));
  try {
   const serverRes = await sendData(
    token,
    cart.selectedAddress,
    id,
    cart.finalPayment,
    walletStatus,
   );
  } catch {
  } finally {
  }
 };

 const sendData = async (token, address, method, amount, use_wallet) => {
  const serverRes = await sendCartPrice(
   token,
   address,
   method,
   amount,
   use_wallet,
  );

  const handleNavToAcc = (activeAccordion, activeButton) => {
   navigate(`/${lng}/myaccount`, { state: { activeAccordion, activeButton } });
  };
console.log(method)
  if (serverRes.response.ok && method === 10) {
   navigate(`/fa/order/pay/${serverRes.result.order.id}`);
   notify(t('order_ok'));
  } else if (serverRes.response.ok && method !== 10) {
   handleNavToAcc(1, 0);
   notify(t('order_ok'));
  } else {
   notify(t('order_err'));
  }
 };

 return (
  <div className={classes.wrapper}>
   {data &&
    data.map(el => {
     return (
      <>
       {el.id !== 10 ? (
        <>
         <button
          onClick={() => handleSetPaymentMethod(el.id)}
          className={`${classes.label}`}
          key={el.id}>
          <div className={classes.img_wrpper}>
           <img
            className={`${classes.img}`}
            src={el.image}
            alt={''}
            loading='lazy'
           />
          </div>
          {lng === 'fa' ? el.title : el.name}
         </button>
        </>
       ) : (
        <>
         <button
          onClick={() => handleSetPaymentMethod(el.id)}
          className={`${classes.label}`}
          key={el.id}>
          <div className={classes.img_wrpper}>
           <img
            className={`${classes.img}`}
            src={el.image}
            alt={''}
            loading='lazy'
           />
          </div>
          {el.title}
         </button>
        </>
       )}
      </>
     );
    })}
  </div>
 );
};

export default PaymentMethod;
