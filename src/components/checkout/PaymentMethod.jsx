import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

import { cartActions } from '../../store/store';

import classes from './PaymentMethod.module.css';
import { sendCartPrice } from '../../services/api';
const PaymentMethod = ({ dataProps }) => {
  const lng = useSelector(state => state.localeStore.lng);
  const cart = useSelector(state => state.cartStore);
  const token = useSelector(state => state.userStore.token);

  const dispatch = useDispatch();

  const [data, setData] = useState(null);

  useEffect(() => {
    if (dataProps) {
      setData(dataProps);
    }
  }, [dataProps]);

  const handleSetPaymentMethod = id => {
    dispatch(cartActions.setPaymentMethod(id));
    try {
      sendData(token, cart.selectedAddress, id, cart.finalPayment * cart.euro);
    } catch {
    } finally {
    }
  };

  const sendData = async (token, address, method, amount) => {
    const serverRes = await sendCartPrice(token, address, method, amount);
    if (serverRes.response.ok) {
      console.log(serverRes);
    }
  };

  return (
    <div className={classes.wrapper}>
      {data &&
        data.map(el => {
          console.log(el)
          return (
            <>
              {el.id !== 10 ? (
                <>
                  <button
                    onClick={() => handleSetPaymentMethod(el.id)}
                    className={`${classes.label}`}
                    key={el.id}
                  >
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
                // <Link to={`/fa/order/pay`}>
                <button
                  onClick={() => handleSetPaymentMethod(el.id)}
                  className={`${classes.label}`}
                  key={el.id}
                >
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
                // </Link>
              )}
            </>
          );
        })}
    </div>
  );
};

export default PaymentMethod;
