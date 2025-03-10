import React from 'react';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';

import { Button } from '@mui/material';
import { useTranslation } from 'react-i18next';

import classes from './SingleBlog.module.css';
const SingleBlog = ({ title, href, imgUrl, alt, className, description }) => {
 const { t } = useTranslation();
 const lng = useSelector(state => state.localeStore.lng);
 return (
  <motion.div
   className={classes.main}
   initial={{ y: 0, boxShadow: '0px 10px 5px rgb(238, 238, 238)' }}
   whileHover={{
    boxShadow: [
     '0px 10px 5px rgb(238, 238, 238)',
     '0px 10px 8px rgb(209, 209, 209)',
     '0px 10px 5px rgb(224, 224, 224)',
    ],
   }}
   style={{ direction: lng === 'fa' ? 'rtl' : 'ltr' }}
   transition={{ type: 'tween', duration: 0.5 }}
   target='_blank'>
   <span className={`${classes.img_container} ${className}`}>
    {imgUrl && <img className={`${classes.img} `} src={imgUrl} alt={alt} />}
   </span>
   <div className={classes.content_wrapper}>
    <div className={classes.title}>{title}</div>
    <div className={classes.description}>{description}</div>
    <a href={href} target='_blank'>
     <Button className={classes.more_button}>{t('showmore')}</Button>
    </a>
   </div>
  </motion.div>
 );
};

export default SingleBlog;
