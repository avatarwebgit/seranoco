import React from 'react';

import classes from './Wrapper.module.css';
const Wrapper = ({ title, children }) => {
  return (
    <div className={classes.main}>
      <h2 className={classes.title}>{title}</h2>
      {children}
    </div>
  );
};

export default Wrapper;
