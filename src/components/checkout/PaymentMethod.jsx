import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import classes from './PaymentMethod.module.css';
import { Link } from 'react-router-dom';
const PaymentMethod = ({ dataProps }) => {
  const lng = useSelector(state => state.localeStore.lng);

  const [data, setData] = useState(null);

  useEffect(() => {
    if (dataProps) {
      setData(dataProps);
      console.log(dataProps);
    }
  }, [dataProps]);

  return (
    <div className={classes.wrapper}>
      {data &&
        data.map(el => {
          return (
            <>
              {el.id !== 10 ? (
                <>
                  <input
                    className={classes.input}
                    type='radio'
                    name={'shapeRadioSelect'}
                    id={el}
                    // value={el}
                  />
                  <label htmlFor={el} className={`${classes.label}`}>
                    <div className={classes.img_wrpper}>
                      <img
                        className={`${classes.img}`}
                        src={el.image}
                        alt={''}
                        loading='lazy'
                      />
                    </div>
                    {el.title}
                  </label>
                </>
              ) : (
                <Link to={`/fa/order/pay`}>
                  <input
                    className={classes.input}
                    type='radio'
                    name={'shapeRadioSelect'}
                    id={el}
                    // value={el}
                  />
                  <label htmlFor={el} className={`${classes.label}`}>
                    <div className={classes.img_wrpper}>
                      <img
                        className={`${classes.img}`}
                        src={el.image}
                        alt={''}
                        loading='lazy'
                      />
                    </div>
                    {el.title}
                  </label>
                </Link>
              )}
            </>
          );
        })}
    </div>
  );
};

export default PaymentMethod;
