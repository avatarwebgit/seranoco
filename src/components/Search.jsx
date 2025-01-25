import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import search from '../assets/svg/search_white.svg';
import search_black from '../assets/svg/search.svg';
import classes from './Search.module.css';

const Search = ({ isHomePage }) => {
  const [isFullSize, setIsFullSize] = useState(false);

  const searchRef = useRef();

  useEffect(() => {
    const handleClickOutside = event => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsFullSize(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleMouseOut = () => {
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
    <motion.div
      ref={searchRef}
      className={classes.main}
      initial={initial}
      animate={{ width: isFullSize ? '100%' : 0 }}
      transition={{ duration: 0.25, type: 'tween' }}
    >
      <motion.input
        className={classes.search_input}
        type='text'
        placeholder={isFullSize ? 'Search...' : ''}
        style={{
          backgroundColor: isFullSize ? 'white' : 'transparent',
        }}
        transition={{ duration: 0.25, type: 'tween' }}
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
        }}
      >
        <motion.img
          className={classes.search_logo}
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
      <motion.div
        className={classes.backdrop}
        initial={{ display: 'none' }}
        animate={{ display: isFullSize ? 'block' : 'none' }}
        onClick={handleMouseOut}
      />
    </motion.div>
  );
};

export default Search;
