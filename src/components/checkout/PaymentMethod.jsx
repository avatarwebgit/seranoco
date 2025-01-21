import React, { useEffect, useState } from 'react';

import classes from './PaymentMethod.module.css';
const PaymentMethod = ({ dataProps }) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    if (dataProps) {
      setData(dataProps);
    }
  }, [dataProps]);

  const test = [1, 2, 3];
  return (
    <div className={classes.wrapper}>
      {data &&
        data.map(el => {
          return (
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
          );
        })}
    </div>
  );
};

export default PaymentMethod;
