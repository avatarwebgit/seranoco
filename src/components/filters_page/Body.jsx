import React from 'react';

import classes from './Body.module.css';
const Body = ({ children }) => {
  return (
    <section className={classes.main}>
      <div className={classes.content}>{children}</div>
    </section>
  );
};

export default Body;
