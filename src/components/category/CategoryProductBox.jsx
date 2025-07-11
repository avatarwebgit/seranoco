import React, { useCallback, useState } from 'react';
import { Tooltip } from '@mui/material';
import Img from '../common/Img';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import classes from './CategoryProductBox.module.css';

const CategoryProductBox = ({ src, alt }) => {
 const [colors, setColors] = useState([
  {
   id: 1,
   color: 'قرمز',
   hex: '#FF0000',
   image: 'https://picsum.photos/id/237/500/500',
  },
  { id: 2, color: 'آبی', hex: '#0000FF' },
  { id: 3, color: 'سبز', hex: '#00FF00' },
  { id: 4, color: 'زرد', hex: '#FFFF00' },
  { id: 5, color: 'بنفش', hex: '#800080' },
  { id: 6, color: 'نارنجی', hex: '#FFA500' },
  { id: 7, color: 'صورتی', hex: '#FFC0CB' },
  { id: 8, color: 'قهوه‌ای', hex: '#A52A2A' },
  { id: 9, color: 'سفید', hex: '#FFFFFF' },
  { id: 10, color: 'مشکی', hex: '#000000' },
 ]);

 const renderColors = useCallback(() => {
  return colors.slice(0, 4).map(option => (
   <Tooltip
    key={option.id}
    title={option.color}
    arrow
    placement='top'
    slotProps={{
     tooltip: { sx: { fontSize: '10px' } },
     arrow: { sx: { fontSize: '10px' } },
    }}>
    <div className={`${classes['color-wrapper']}`}>
     <div className={`${classes['color-input-wrapper']} ${classes.rtl}`}>
      <input
       type='color'
       name={`color-${option.id}`}
       id={`color-${option.id}`}
       readOnly
       hidden
      />
      <div
       className={`${classes['custom-color']}`}
       style={{
        background: option.image ? `url(${option.image})` : option.hex,
        backgroundColor: option.hex,
       }}
      />
     </div>
    </div>
   </Tooltip>
  ));
 }, [colors]);

 return (
  <a
   className={classes['product-box']}
   href='http://localhost:3000/product/1736236632/378'>
   <div className={classes['img-wrapper']}>
    <Img src={src} alt={alt} className={classes.img} />
   </div>
   <div className={classes.title}>
    لپ تاپ 15.6 اینچی ایسوس مدل Vivobook 15 X1504VA-NJ107-i7 1355U-16GB DDR4-1TB
    SSD-TFT
   </div>
   <div className={classes.caption}>
    لپ تاپ 15.6 اینچی ایسوس مدل Vivobook 15 X1504VA-NJ107-i7 1355U-16GB DDR4-1TB
    SSD-TFT
   </div>
   <div className={classes.price}>
    <span>۵۶,۸۰۰,۰۰۰</span>
    <span>تومان</span>
   </div>
   <div className={classes['color-wrapper-main']}>
    {renderColors()}
    {colors.length > 5 && (
     <Tooltip
      title={'مشاهده همه رنگ ها'}
      arrow
      placement='top'
      slotProps={{
       tooltip: { sx: { fontSize: '10px' } },
       arrow: { sx: { fontSize: '10px' } },
      }}>
      <div className={`${classes['color-input-wrapper']} ${classes.rtl}`}>
       <div
        className={`${classes['more-wrapper']}`}
        style={{
         backgroundColor: '#fff',
        }}>
        <MoreVertIcon sx={{ fontSize: '20px' }} />
       </div>
      </div>
     </Tooltip>
    )}
   </div>
  </a>
 );
};

export default CategoryProductBox;
