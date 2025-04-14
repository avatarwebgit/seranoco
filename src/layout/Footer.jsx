import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { basicInformation, usePages } from '../services/api';

import Body from '../components/filters_page/Body';
import Card from '../components/filters_page/Card';

import logo from '../assets/images/footer-logo.png';

import classes from './Footer.module.css';
import { Facebook, Instagram } from '@mui/icons-material';
import { Tooltip } from '@mui/material';
const Footer = () => {
 const [footerData, setFooterData] = useState(null);
 const { data: pageData } = usePages();

 const lng = useSelector(state => state.localeStore.lng);

 const fetchFooterLinks = async () => {
  const serverRes = await basicInformation();
  if (serverRes.response.ok) {
   setFooterData(serverRes.result.data.at(0));
  }
 };

 useEffect(() => {
  fetchFooterLinks();
 }, []);

 const getKeys = (data, dataKey) => {
  const keys = Object.keys(data).filter(key => {
   const startsWithPrefix = key.startsWith(dataKey);
   return startsWithPrefix;
  });

  return keys.map(key => (
   <a key={key} href='#'>
    {data[key]}
   </a>
  ));
 };

 return (
  <>
   {footerData && (
    <footer className={classes.footer}>
     <Body parentClass={classes.body}>
      <Card className={classes.card}>
       <div className={classes.content}>
        <a href={`/${lng}/`} className={classes.image_wrapper}>
         <img className={classes.footer_logo} src={logo} alt='' />
        </a>
        <div className={classes.links}>
         <span>
          <p className={classes.title}>{footerData.footer_1}</p>

          {pageData &&
           pageData.data.map((elem, i) => {
            if (i < 5) {
             return (
              <a key={i} href={`/${lng}/page/${elem.alias}`}>
               {elem.title}
              </a>
             );
            }
           })}
         </span>
         <span>
          <p className={classes.title}>{footerData.footer_2}</p>
          {pageData &&
           pageData.data.map((elem, i) => {
            if (i >= 5 && i < 7) {
             return (
              <a key={i} href={`/${lng}/page/${elem.alias}`}>
               {elem.title}
              </a>
             );
            }
           })}
         </span>
         <span className={classes.support}>
          <p className={classes.title}>{footerData.footer_3}</p>
          {pageData &&
           pageData.data.map((elem, i) => {
            if (i >= 7 && i < 9) {
             return (
              <a key={i} href={`/${lng}/page/${elem.alias}`}>
               {elem.title}
              </a>
             );
            }
           })}
         </span>
        </div>
       </div>
       <div className={classes.divider}></div>
       <div className={classes.social_media_links}>
        <Tooltip title={'Instagram'} arrow placement='top'>
         <a href={footerData.instagram}>
          <Instagram sx={{ color: 'grey' }} fontSize='10' />
         </a>
        </Tooltip>
        <Tooltip title={'Facebook'} arrow placement='top'>
         <a href={footerData.facebook}>
          <Facebook sx={{ color: 'grey' }} fontSize='10' />
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
