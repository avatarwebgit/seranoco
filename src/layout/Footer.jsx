import React from "react";

import logo from "../assets/svg/Serano-Logo - white.svg";

import classes from "./Footer.module.css";
const Footer = () => {
  return (
    <footer className={classes.footer}>
      <span className={classes.image_wrapper}>
        <img src={logo} alt="" />
      </span>
      <span className={classes.first}></span>
      <span className={classes.second}></span>
      <span className={classes.third}></span>
      <span className={classes.four}></span>
    </footer>
  );
};

export default Footer;
