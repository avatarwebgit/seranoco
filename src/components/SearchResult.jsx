import { OpenInNew } from '@mui/icons-material';
import { IconButton, Tooltip } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import classes from './SearchResult.module.css';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
const SearchResult = ({ dataProp }) => {
 const [data, setData] = useState(null);
 const { t } = useTranslation();
 const lng = useSelector(state => state.localeStore.lng);

 useEffect(() => {
  if (dataProp) {
   setData(dataProp);
  }
 }, [dataProp]);

 return (
  <div className={classes.main}>
   <div className={classes.image_wrapper}>
    <img src={data?.primary_image} alt='' />
   </div>
   <div>
    <span>{data?.name}</span>
    <span>{data?.size}</span>
   </div>
   <Tooltip title={t('details')} arrow placement='top'>
    <Link
     to={`/${lng}/products/${data?.product?.alias}/${data?.product?.variation_id}`}
     target='_blank'
     className={classes.link}>
     <IconButton className={classes.btn} size='medium'>
      <OpenInNew fontSize='13' sx={{ color: 'black' }} />
     </IconButton>
    </Link>
   </Tooltip>
  </div>
 );
};

export default SearchResult;
