import React from "react";

import classes from "./CustomSection.module.css";
const CustomSection = ({ children, className, card, style, cardStyle }) => {
  return (
    <section className={`${classes.card} ${card}`} style={cardStyle}>
      <div className={`${classes.content_wrapper} ${className}`} style={style}>
        {children}
      </div>
    </section>
  );
};

export default CustomSection;
