import { Skeleton } from '@mui/material';

import { useState } from 'react';
import classes from './Img.module.css';
const Img = ({ src, alt, className }) => {
 const [isLoading, setIsLoading] = useState(true);

 return (
  <div className={`${classes.img} ${className}`}>
   <img
    src={src}
    alt={alt}
    className={`${isLoading ? classes.hidden : classes.block}`}
    onLoad={() => setIsLoading(false)}
   />
   <Skeleton
    variant='rectangular'
    animation='wave'
    className={`${!isLoading ? classes.hidden : classes.block}`}
    sx={{ width: '100%', height: '65%' }}
   />
  </div>
 );
};

export default Img;
