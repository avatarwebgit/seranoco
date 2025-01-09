import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';

import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';

import classes from './CustomButton.module.css';
export const CustomButton = ({ children, onClick }) => {
  const [isHovering, setIsHovering] = useState(false);
  const lng = useSelector(state => state.localeStore.lng);
  return (
    <button
      className={classes.main}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onClick={onClick}
    >
      <motion.i
        className={classes.icon}
        initial={{ x: lng === 'fa' ? 15 : -15 }}
        animate={{ x: isHovering ? 0 : lng === 'fa' ? 15 : -15 }}
      >
        {lng === 'fa' ? (
          <ArrowBackIos sx={{ width: '10px', height: '10px' }} />
        ) : (
          <ArrowForwardIos sx={{ width: '10px', height: '10px' }} />
        )}
      </motion.i>
      {children}
    </button>
  );
};
