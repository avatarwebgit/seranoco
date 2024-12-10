import React from "react";

import logo from "../assets/svg/Serano-Logo - white.svg";

import classes from "./Footer.module.css";
const Footer = () => {
  return (
    <footer className={classes.footer}>
      <span className={classes.image_wrapper}>
        <img className={classes.footer_logo} src={logo} alt="" />
      </span>
      <div className={classes.links}>
        <span>
          <p className={classes.title}>Adress</p>
        </span>
        <span>
          <p className={classes.title}>Customer service & FAQ</p>
          <a href="#">Customer Service Overview</a>
          <a href="#">Git Card Balance</a>
          <a href="#">Contact Us</a>
        </span>
        <span>
          <p className={classes.title}>About us</p>
        </span>
        <span>
          <p className={classes.title}>Legal</p>
          <a href="#">Terms Of Use</a>
          <a href="#">Terms And Conditions</a>
          <a href="#">Privacy policy</a>
        </span>
      </div>
    </footer>
  );
};

export default Footer;
