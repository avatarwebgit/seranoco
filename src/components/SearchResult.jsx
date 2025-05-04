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
   <Link
    className={classes.main}
    to={`/${lng}/products/${data?.product.alias}/${data?.id}`}
    target='_blank'>
    <div className={classes.image_wrapper}>
       <img className={classes.img } src={data?.primary_image} alt=''/>
    </div>
    <div className={classes.text_wrapper}>
     <div className={classes.name}>{data?.product?.name}</div>
     <div className={classes.size}>{data?.size}</div>
    </div>
   </Link>
 );
};

export default SearchResult;
