import React from "react";

import classes from "./CustomSection.module.css";
const CustomSection = ({ children, className, card }) => {
  return (
    <section className={`${classes.card} ${card}`}>
      <div className={`${classes.content_wrapper} ${className}`}>
        {children}
      </div>
    </section>
  );
};

export default CustomSection;
