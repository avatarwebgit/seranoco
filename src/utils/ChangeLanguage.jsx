import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import i18next from '../utils/i18next';
import { localeActions } from '../store/store';
import { duration, Icon, IconButton } from '@mui/material';

import { ReactComponent as EarthWhite } from '../assets/svg/earth_white.svg';
import { ReactComponent as EarthBlack } from '../assets/svg/earth.svg';

import classes from './ChangeLanguage.module.css';
const ChangeLanguage = props => {
 const [isOpen, setIsOpen] = useState(false);
 const lng = useSelector(state => state.localeStore.lng);
 const dispatch = useDispatch();
 const navigate = useNavigate();
 const location = useLocation();

 const handleChangeLngFa = () => {
  dispatch(localeActions.fa());
  i18next.changeLanguage('fa');
  toggle('fa');
  setIsOpen(false);
 };

 const handleChangeLngEn = () => {
  dispatch(localeActions.en());
  i18next.changeLanguage('en');
  toggle('en');
  setIsOpen(false);
 };

 const toggle = newLang => {
  const currentPath = location.pathname.split('/').slice(2).join('/');
  const searchParams = location.search;
  if (currentPath === '') {
   return navigate(`/${newLang}${searchParams}`);
  } else {
   return navigate(`/${newLang}/${currentPath}${searchParams}`);
  }
 };

 return (
  <IconButton
   className={`${classes.main} ${
    props.ishomepage ? classes.black : classes.white
   } ${props.className}`}
   onMouseEnter={() => setIsOpen(true)}
   onMouseLeave={() => setIsOpen(false)}>
   {props.ishomepage ? (
    <EarthBlack className={classes.svg} />
   ) : (
    <EarthWhite className={classes.svg} />
   )}

   <motion.div
    className={classes.dropdown_wrapper}
    initial={{ display: 'none' }}
    animate={{
     display: isOpen ? 'flex' : 'none',
    }}
    transition={{ duration: 0.2 }}>
    <span className={classes.lng_item} onClick={handleChangeLngEn}>
     <p className={classes.text}>En</p>
    </span>
    <span className={classes.lng_item} onClick={handleChangeLngFa}>
     <p className={classes.text}>Fa</p>
    </span>
   </motion.div>
  </IconButton>
 );
};

export default ChangeLanguage;
