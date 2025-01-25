import React from 'react';

import classes from './Wrapper.module.css';
const Wrapper = ({ title, children, className, style }) => {
  return (
    <div className={`${classes.main} ${className}`} style={style}>
      <h2 className={classes.title}>{title}</h2>
      {children}
    </div>
  );
};

export default Wrapper;
