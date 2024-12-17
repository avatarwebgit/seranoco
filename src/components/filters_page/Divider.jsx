import React from 'react';

import classes from './Divider.module.css';
const Divider = ({ text, className }) => {
  return (
    <div className={`${className} ${classes.main}`}>
      {text && <span className={classes.text}>{text}</span>}
    </div>
  );
};

export default Divider;
