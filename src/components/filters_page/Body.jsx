import React from 'react';

import classes from './Body.module.css';
const Body = ({ children, className }) => {
  return (
    <section className={`${classes.main}`}>
      <div className={`${classes.content} ${className}`}>{children}</div>
    </section>
  );
};

export default Body;
