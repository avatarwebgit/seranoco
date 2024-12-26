import React from 'react';

import classes from './Divider.module.css';
import { useSelector } from 'react-redux';
const Divider = ({ title }) => {
  const lng = useSelector(state => state.localeStore.lng);
  return (
    <div
      className={classes.main}
      style={{ direction: lng === 'fa' ? 'rtl' : 'ltr' }}
    >
      <p className={classes.title_text}>{title}</p>
      <div className={classes.line}></div>
    </div>
  );
};

export default Divider;
