import React from 'react';

import classes from './PaymentMethod.module.css';
const PaymentMethod = () => {
  const test = [1, 2, 3];
  return (
      <div className={classes.wrapper }>
      {test.map(el => {
        return (
          <>
            <input
              className={classes.input}
              type='radio'
              name={'shapeRadioSelect'}
              id={el}
              value={el}
            />
            <label
              htmlFor={el}
              className={`${classes.label}`}
            >
              <div className={classes.img_wrapper}>
                <img
                  className={`${classes.img}`}
                  src={''}
                  alt={''}
                  loading='lazy'
                />
                    </div>
                    855
            </label>
          </>
        );
      })}
    </div>
  );
};

export default PaymentMethod;
