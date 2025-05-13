import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

import { cartActions } from '../../store/store';

import classes from './PaymentMethod.module.css';
import { sendCartPrice } from '../../services/api';
import { notify } from '../../utils/helperFunctions';
const PaymentMethod = ({ dataProps }) => {
 const lng = useSelector(state => state.localeStore.lng);
 const cart = useSelector(state => state.cartStore);
 const token = useSelector(state => state.userStore.token);

 const dispatch = useDispatch();
 const navigate = useNavigate();

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
    cart.finalPayment * cart.euro,
   );
  } catch {
  } finally {
  }
 };

 const sendData = async (token, address, method, amount) => {
  const serverRes = await sendCartPrice(token, address, method, amount);

   if (serverRes.response.ok) {
    navigate(`/fa/order/pay/${serverRes.result.order.id}`);
  } else {
   notify(' خطایی رخ داد لطفا دوباره تلاش کنید');
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
          { el.title}
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
