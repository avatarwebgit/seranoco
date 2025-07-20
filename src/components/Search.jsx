import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useSearch } from '../services/api';
import { debounce } from 'lodash';

import LoadingSpinner from '../components/common/LoadingSpinner';

import search from '../assets/svg/search_white.svg';
import search_black from '../assets/svg/search.svg';
import classes from './Search.module.css';
import SearchResult from './SearchResult';
import { useSelector } from 'react-redux';
import { Close } from '@mui/icons-material';
import { IconButton } from '@mui/material';

const Search = ({ isHomePage, isMobile }) => {
 const [isFullSize, setIsFullSize] = useState(false);
 const [searchQuery, setSearchQuery] = useState('');
 const [searchTerm, setSearchTerm] = useState('');
 const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
 const { data, isLoading, isError, error } = useSearch(debouncedSearchTerm);
 const [resultDetail, setResultDetail] = useState([]);

 const lng = useSelector(state => state.localeStore.lng);

 const searchRef = useRef();
 const { t } = useTranslation();

 const debouncedSearch = debounce(value => {
  setDebouncedSearchTerm(value);
 }, 300);

 const handleInputChange = e => {
  const value = e.target.value;
  setSearchTerm(value);
  debouncedSearch(value);
 };

 useEffect(() => {
  if (data && data.data.length > 0) {
   setResultDetail(data.data);
  }
 }, [data]);

 useEffect(() => {
  if (isMobile) {
   setIsFullSize(true);
  }
 }, [isMobile]);

 useEffect(() => {
  const handleClickOutside = event => {
   if (searchRef.current && !searchRef.current.contains(event.target)) {
    if (isMobile) return;
    setIsFullSize(false);
   }
  };

  document.addEventListener('mousedown', handleClickOutside);

  return () => {
   document.removeEventListener('mousedown', handleClickOutside);
  };
 }, []);

 const handleMouseOut = () => {
  if (isMobile) {
   return;
  }
  setIsFullSize(false);
 };

 const initial = {
  width: 0,
 };

 useEffect(() => {
  if (isFullSize) {
   document.body.style.overflowY = 'hidden';
  } else {
   document.body.style.overflowY = 'auto';
  }
 }, [isFullSize]);

 return (
  <motion.form
   ref={searchRef}
   className={classes.main}
   initial={initial}
   animate={{ width: isFullSize ? '250px' : 0 }}
   transition={{ duration: 0.25, type: 'tween' }}>
   <motion.input
    value={searchTerm}
    onChange={e => handleInputChange(e)}
    className={classes.search_input}
    type='text'
    placeholder={isFullSize ? t('search') : ''}
    transition={{ duration: 0.25, type: 'tween' }}
    initial={{
     boxShadow: '0 0 5px rgba(65, 65, 65, 0)',
     background: 'rgba(0, 0, 0, 0)',
    }}
    animate={{
     boxShadow: isFullSize
      ? '0 0 5px rgba(65, 65, 65, 1)'
      : '0 0 5px rgba(65, 65, 65, 0)',
     background: isFullSize ? 'rgba(255, 255, 255, 1)' : 'rgba(0, 0, 0, 0)',
    }}
    style={{ direction: `${lng === 'fa' ? 'rtl' : 'ltr'}` }}
   />
   <motion.div
    className={classes.search_logo_wrapper}
    onClick={() => setIsFullSize(true)}
    initial={{ border: '1.5px solid transparent' }}
    animate={{
     border: !isFullSize
      ? isHomePage
        ? '1.5px solid black'
        : '1.5px solid white'
      : '1px solid transparent',
    }}>
    <motion.img
     className={classes.remove}
     src={isHomePage ? search_black : isFullSize ? search_black : search}
     alt='search logo'
     initial={{ width: '40%', height: '40%' }}
     animate={{
      width: isFullSize ? '50%' : '40%',
      height: isFullSize ? '50%' : '40%',
     }}
     transition={{ duration: 0.25, type: 'tween' }}
    />
   </motion.div>
   <IconButton
    className={classes.close_btn}
    sx={{ display: isFullSize ? 'flex' : 'none' }}
    onClick={() => {
     setSearchQuery('');
     setSearchTerm('');
     setResultDetail([]);
    }}>
    <Close fontSize='10px' />
   </IconButton>
   {!isMobile && (
    <motion.div
     className={classes.backdrop}
     initial={{ display: 'none' }}
     animate={{ display: isFullSize ? 'block' : 'none' }}
     onClick={handleMouseOut}
    />
   )}
   <motion.div
    className={classes.result_wrapper}
    initial={{ paddingTop: 0, height: 0 }}
    animate={{
     paddingTop: isFullSize && searchTerm.length > 0 ? '20px' : 0,
     height: isFullSize && searchTerm.length > 0 ? '400px' : 0,
    }}
    transition={{ delay: !isFullSize ? 0 : 0.5 }}>
    {isLoading && <LoadingSpinner size={'20px'} />}

    <div className={classes.sheet}>
     {resultDetail.length > 0 &&
      resultDetail.map(el => {
       return <SearchResult dataProp={el} />;
      })}
    </div>
   </motion.div>
   {searchQuery.length > 0 && (
    <button type='submit' className={classes.search_btn}>
     {t('search')}
    </button>
   )}
  </motion.form>
 );
};

export default Search;
