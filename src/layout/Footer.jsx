import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { basicInformation } from '../services/api';

import logo from '../assets/svg/Serano-Logo - white.svg';
import Body from '../components/filters_page/Body';
import Card from '../components/filters_page/Card';

import classes from './Footer.module.css';
import { GitHub, Instagram, LinkedIn, Twitter } from '@mui/icons-material';
import { Tooltip } from '@mui/material';
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
          <Body parentClass={classes.body}>
            <Card className={classes.card}>
              <div className={classes.content}>
                <a href={`/${lng}/`} className={classes.image_wrapper}>
                  <img
                    className={classes.footer_logo}
                    src={footerData.image_white}
                    alt=''
                  />
                </a>
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
              </div>
              <div className={classes.divider}></div>
              <div className={classes.social_media_links}>
                <Tooltip title={'instagram'} arrow placement='top' >
                  <a href='/'>
                    <Instagram sx={{ color: 'grey' }} fontSize='10' />
                  </a>
                </Tooltip>
                <Tooltip title={'twitter'} arrow placement='top' >
                  <a href='/'>
                    <Twitter sx={{ color: 'grey' }} fontSize='10' />
                  </a>
                </Tooltip>
                <Tooltip title={'linkedin'} arrow placement='top' >
                  <a href='/'>
                    <LinkedIn sx={{ color: 'grey' }} fontSize='10' />
                  </a>
                </Tooltip>
                <Tooltip title={'github'} arrow placement='top' >
                  <a href='/'>
                    <GitHub sx={{ color: 'grey' }} fontSize='10' />
                  </a>
                </Tooltip>
              </div>
            </Card>
          </Body>
        </footer>
      )}
    </>
  );
};

export default Footer;
