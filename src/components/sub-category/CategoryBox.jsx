import React, { useEffect, useState } from 'react';

import Img from '../common/Img';

import classes from './CategoryBox.module.css';
import { Skeleton } from '@mui/material';

const CategoryBox = ({ data, isLoadingData }) => {
 const [isLoading, setIsLoading] = useState(true);

 useEffect(() => {
  setIsLoading(isLoadingData);
 }, [isLoadingData]);

 return (
  <a className={classes.main} href=''>
   <Img
    src={'https://picsum.photos/200/300?colorfull'}
    className={classes.img}
   />
   {isLoading ? (
    <Skeleton variant='text' sx={{ width: '80%', margin: '.7rem' }} />
   ) : (
    <p className={classes.title}>sadfsadfsadf</p>
   )}
  </a>
 );
};

export default CategoryBox;
