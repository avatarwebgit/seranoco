import React from "react";

import arrow from "../assets/svg/arrow.svg";

import classes from "./ArrowButton.module.css";
const ArrowButton = ({ onClick, className, varient, alt }) => {
  const returnStyles = () => {
    if (varient === "right") {
      return {
        transform: "rotate(180deg)",
      };
    } else {
      return "";
    }
  };
  return (
    <button onClick={onClick} className={`${classes.main} ${className}`}>
      <div
        className={classes.icon_wrapper}
        style={{
          transform: `${
            varient === "right" ? "rotate(180deg)" : ""
          }`,
        }}
      >
        <img src={arrow} alt={alt} className={classes.arrow_icon} />
      </div>
    </button>
  );
};

export default ArrowButton;
