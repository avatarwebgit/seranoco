import React from "react";

import classes from "./CustomButton.module.css";
const CustomButton = ({ children }) => {
  return (
    <button class={`${classes.draw} ${classes.custom_btn}`}>{children}</button>
  );
};

export default CustomButton;
