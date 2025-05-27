import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { IconButton } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';

import {
 accesModalActions,
 cartActions,
 drawerActions,
} from '../../store/store';

import { ReactComponent as Plus } from '../../assets/svg/plus.svg';
import { ReactComponent as Minus } from '../../assets/svg/minus.svg';

import { Lock } from '@mui/icons-material';
import { formatNumber, notify } from '../../utils/helperFunctions';
import { sendShoppingCart } from '../../services/api';
import classes from './ResultRow.module.css';
const ResultRow = ({ dataProp }) => {
 const [data, setData] = useState(null);
 const [isLoadingImage, setIsLoadingImage] = useState(true);
 const [isLoading, setIsLoading] = useState(true);
 const [quantities, setQuantities] = useState({});
 const [isByOrder, setIsByOrder] = useState(false);

 const { t, i18n } = useTranslation();

 const dispatch = useDispatch();

 const lng = useSelector(state => state.localeStore.lng);
 const cart = useSelector(state => state.cartStore);
 const token = useSelector(state => state.userStore.token);
 const euro = useSelector(state => state.cartStore.euro);

 useEffect(() => {
  if (dataProp) {
   setData(dataProp);
  }
  if (isLoadingImage) {
   setIsLoading(true);
  } else {
   setIsLoading(false);
  }
 }, [dataProp, isLoadingImage]);

 const handleAddQuantity = el => {
  setQuantities(prevQuantities => {
   const newQuantity = prevQuantities[el.variation_id]
    ? prevQuantities[el.variation_id] + 1
    : 1;
   return newQuantity <= el.quantity
    ? { ...prevQuantities, [el.variation_id]: newQuantity }
    : prevQuantities;
  });
 };

 const handleReduceQuantity = el => {
  setQuantities(prevQuantities => {
   const newQuantity = prevQuantities[el.variation_id]
    ? prevQuantities[el.variation_id] - 1
    : 0;
   return newQuantity >= 0
    ? { ...prevQuantities, [el.variation_id]: newQuantity }
    : prevQuantities;
  });
 };

 const handleSendShoppingCart = async (el, variation, quantity) => {
  el.id, +variation, quantity;

  try {
   const serverRes = await sendShoppingCart(token, el.id, +variation, quantity);
   if (serverRes.response.ok) {
    dispatch(drawerActions.open());
   }
  } catch (err) {
   //  (err);
  } finally {
   notify(t('orders.ok'));
  }
 };

 return (
  <>
   <table className={`${classes.main}`}>
    <thead>
     {data && data.length > 0 && (
      <tr>
       <th className={classes.title_text} style={{ opacity: 0 }}>
        {t('type')}
       </th>
       <th className={classes.title_text}>
        {t('brand')}&nbsp;/&nbsp;{t('mine')}
       </th>
       <th className={classes.title_text}>{t('size')}</th>
       <th className={classes.title_text}>{t('color')}</th>
       <th className={classes.title_text}>{t('details')}</th>
       <th className={classes.title_text}>{t('country')}</th>
       <th className={classes.title_text}>
        {t('price')}&nbsp;1{t('1_pcs')} / {t('m_unit')}
       </th>
       <th className={classes.title_text}>
        {t('quantity')} / {t('pcs')}
       </th>
       <th className={classes.title_text}>
        {t('total_price')} / {t('m_unit')}
       </th>
       <th className={classes.title_text} style={{ opacity: 0 }}>
        {t('action')}
       </th>
      </tr>
     )}
    </thead>
    <tbody>
     {data &&
      data.map(el => {
       return (
        <tr className={classes.tr} key={el.id} style={{ height: '80px' }}>
         {/* Image Column */}
         <td className={classes.img_wrapper}>
          <img
           src={el?.primary_image}
           onLoad={() => setIsLoadingImage(false)}
           loading='lazy'
           style={{ maxHeight: '70px' }}
          />
         </td>
         {/* Detail Column */}
         <td className={classes.detail_text}>
          <Link
           to={`/${lng}/products/${el.alias}/${el.variation_id}`}
           target='_blank'
           className={classes.link}>
           {el.details}
          </Link>
         </td>
         {/* Size */}
         <td className={classes.detail_text}>{el.size}</td>
         {/* Color */}
         <td className={classes.detail_text}>{el.color}</td>
         {/* Quality */}

         {/* AGTA */}
         <td className={classes.detail_text}>
          {
           el?.attribute?.find(attr => attr.attribute.name === 'Details').value
            .name
          }
         </td>
         <td className={classes.detail_text}>{el.country}</td>
         {/* Price */}
         <td
          className={classes.detail_text}
          style={{
           direction: lng === 'fa' ? 'rtl' : 'ltr',
          }}>
          {lng === 'en' ? (
           <>
            {+el.sale_price}
            {t('m_unit')}
           </>
          ) : (
           <>
            <>
             {formatNumber(el.sale_price * euro)}&nbsp;
             {t('m_unit')}
            </>
            <br />
            (€&nbsp; {+el.sale_price?.toFixed(2)})
           </>
          )}
          &nbsp;
         </td>
         {/* Quantity Controls */}
         <td className={classes.detail_text}>
          <div className={classes.quantity_controls}>
           <p className={classes.totoal_quantity}>
            {quantities[el.variation_id] || 0}
           </p>
           <span className={classes.button_wrapper}>
            <IconButton
             className={classes.action_btn}
             onClick={() => handleAddQuantity(el)}
             disabled={el.quantity === 0}>
             <Plus width={20} height={20} />
            </IconButton>
            <IconButton
             className={classes.action_btn}
             onClick={() => handleReduceQuantity(el)}
             disabled={quantities[el.id] === 0}>
             <Minus width={20} height={20} />
            </IconButton>
           </span>
          </div>
         </td>
         {/* Total Price */}
         <td
          className={classes.detail_text}
          style={{
           direction: lng === 'fa' ? 'rtl' : 'ltr',
          }}>
          &nbsp;
          {lng === 'en'
           ? quantities[el.variation_id]
             ? (+quantities[el.variation_id] * +el.price).toFixed(2)
             : 0
           : quantities[el.variation_id]
           ? formatNumber(
              Math.round(quantities[el.variation_id] * +el.price * euro),
             )
           : 0}
          &nbsp;
          {t('m_unit')}
         </td>
         {/* Action Button */}
         <td>
          <center>
           {token ? (
            <button
             className={classes.add_to_card}
             onClick={() => {
              handleSendShoppingCart(
               el,
               el.variation_id,
               quantities[el.variation_id] || 1,
              );
             }}>
             {el?.variation?.quantity === 0
              ? t('addtoorder')
              : t('add_to_card')}
            </button>
           ) : (
            <button
             className={classes.login_btn}
             onClick={() => {
              dispatch(accesModalActions.login());
             }}>
             {t('login')}
             <Lock sx={{ width: '17px', height: '17px' }} />
            </button>
           )}
          </center>
         </td>
        </tr>
       );
      })}
    </tbody>
   </table>
  </>
 );
};

export default ResultRow;
