import React from 'react';

import classes from './Body.module.css';
const Body = ({ children, className, parentClass }) => {
  return (
    <section className={`${classes.main} ${parentClass}`}>
      <div className={`${classes.content} ${className}`}>{children}</div>
    </section>
  );
};

export default Body;
