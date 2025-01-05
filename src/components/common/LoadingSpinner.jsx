import React from 'react';

import classes from './LoadingSpinner.module.css';
const LoadingSpinner = ({ size }) => {
  return (
    <div className={classes.main}>
      <div className={classes.loader} style={{ width: size || '20px' }}></div>
    </div>
  );
};

export default LoadingSpinner;
