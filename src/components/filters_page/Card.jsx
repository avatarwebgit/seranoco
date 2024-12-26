import React from 'react';

import classes from './Card.module.css';

const Card = React.forwardRef(({ children, className, ...props }, ref) => {
  return (
    <section
      ref={ref}
      className={`${classes.main} ${className}`}
      {...props} 
    >
      {children}
    </section>
  );
});

export default Card;
