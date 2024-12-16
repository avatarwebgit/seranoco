import React from 'react';

import classes from './Card.module.css';
const Card = ({ children, className }) => {
  return (
    <section className={`${classes.main} ${className}`}>{children}</section>
  );
};

export default Card;
