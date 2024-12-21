import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import search from '../assets/svg/search_white.svg';
import search_black from '../assets/svg/search.svg';
import classes from './Search.module.css';

const Search = ({ isHomePage }) => {
  const [isFullSize, setIsFullSize] = useState(false);

  const handleMouseEnter = () => {
    setIsFullSize(true);
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
      className={classes.main}
      initial={initial}
      animate={{ width: isFullSize ? '100%' : 0 }}
      onMouseEnter={handleMouseEnter}
      transition={{ duration: 0.25, type: 'tween' }}
    >
      <motion.input
        className={classes.search_input}
        type='text'
        placeholder={isFullSize ? 'Search...' : ''}
        onFocus={handleMouseEnter}
        style={{ backgroundColor: isFullSize ? 'white' : 'transparent' }}
        transition={{ duration: 0.25, type: 'tween' }}
      />
      <motion.div
        className={classes.search_logo_wrapper}
        initial={{ border: '1px solid transparent' }}
        animate={{
          border: !isFullSize
            ? isHomePage
              ? '1px solid black'
              : '1px solid white'
            : '1px solid transparent',
        }}
      >
        <motion.img
          className={classes.search_logo}
          src={isHomePage ? search_black : search}
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
        onClick={() => setIsFullSize(false)}
      />
    </motion.div>
  );
};

export default Search;
