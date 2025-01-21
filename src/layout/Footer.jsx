import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { basicInformation } from '../services/api';

import logo from '../assets/svg/Serano-Logo - white.svg';

import classes from './Footer.module.css';
const Footer = () => {
  const [footerData, setFooterData] = useState(null);

  const lng = useSelector(state => state.localeStore.lng);

  const fetchFooterLinks = async () => {
    const serverRes = await basicInformation();
    setFooterData(serverRes.result.data.at(0));
  };

  useEffect(() => {
    fetchFooterLinks();
  }, []);

  return (
    <>
      {footerData && (
        <footer className={classes.footer}>
          <span className={classes.image_wrapper}>
            <img
              className={classes.footer_logo}
              src={footerData.image_white}
              alt=''
            />
          </span>
          <div className={classes.links}>
            <span>
              <p className={classes.title}>{footerData.footer_5}</p>
            </span>
            <span>
              <p className={classes.title}>{footerData.footer_1}</p>
              <a href='#'>Customer Service Overview</a>
              <a href='#'>Git Card Balance</a>
              <a href='#'>Contact Us</a>
            </span>
            <span>
              <p className={classes.title}>{footerData.footer_2}</p>
            </span>
            <span className={classes.support}>
              <p className={classes.title}>{footerData.footer_3}</p>
              <a href='#'>Terms Of Use</a>
              <a href='#'>Terms And Conditions</a>
              <a href='#'>Privacy policy</a>
            </span>
          </div>
        </footer>
      )}
    </>
  );
};

export default Footer;
