import React, { useEffect } from 'react';

import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { formatNumber } from '../../utils/helperFunctions';

import { getShoppingCart } from '../../services/api';
import { cartActions } from '../../store/store';

import classes from './ShoppingCart.module.css';
const ShoppingCart = () => {
 const { t } = useTranslation();

 const card = useSelector(state => state.cartStore);
 const lng = useSelector(state => state.localeStore.lng);
 const euro = useSelector(state => state.cartStore.euro);
 const token = useSelector(state => state.userStore.token);

 const dispatch = useDispatch();

 const handleGetShoppingCart = async () => {
  const serverRes = await getShoppingCart(token);

   if (serverRes.response.ok) {
   dispatch(cartActions.set(serverRes.result.cart));
  }
 };

 useEffect(() => {
  handleGetShoppingCart();
 }, []);

 return (
  <table className={classes.table}>
   <thead>
    <tr className={classes.tr}>
     <td className={classes.td}>{t('pc.image')}</td>
     <td className={classes.td}>{t('pc.color')}</td>
     <td className={classes.td}>{t('pc.size')}</td>
     <td className={classes.td}>
      {t('pc.price')}/{t('1_pcs')}
     </td>
     <td className={classes.td}>{t('quantity')}</td>
     <td className={classes.td}>{t('pc.advance')}</td>
     <td className={classes.td}>
      {t('pc.value')}/{t('pcs')}
     </td>
     <td className={classes.td}>{t('pc.payment')}</td>
    </tr>
   </thead>
     <tbody>

       {card.products.map(el => {
         console.log(el)
     const isByOrder =
      el?.quantity === 0 && el?.variation.is_not_available === 0;
     const totalPrice = el.selected_quantity * el.price;
     return (
      <tr className={classes.tr} key={el.id}>
       <td className={classes.td}>
        <div className={classes.img_wrapper}>
         <img src={el.primary_image} alt='' loading='lazy' />
        </div>
       </td>
       <td className={classes.td}>{el.color}</td>
       <td className={classes.td}>{el.size}</td>
       <td
        className={classes.td}
        style={{ direction: lng === 'fa' ? 'rtl' : 'ltr' }}>
        {lng !== 'fa' ? el.price : formatNumber(el.price * euro)}
        &nbsp;{t('m_unit')}
       </td>
       <td className={classes.td}>{el.selected_quantity}</td>
       <td className={classes.td}>
        {isByOrder && lng !== 'fa' && (totalPrice * 0.2).toFixed(2)}
        {isByOrder && lng === 'fa' && formatNumber(totalPrice * 0.2 * euro)}
        &nbsp;{isByOrder ? t('m_unit') : '_'}
       </td>
       <td
        className={classes.td}
        style={{ direction: lng === 'fa' ? 'rtl' : 'ltr' }}>
        {!isByOrder && lng !== 'fa' && totalPrice.toFixed(2)}
        {!isByOrder && lng === 'fa' && formatNumber(totalPrice * euro)}
        &nbsp;{!isByOrder ? t('m_unit') : '_'}
       </td>
       <td
        className={classes.td}
        style={{ direction: lng === 'fa' ? 'rtl' : 'ltr' }}>
        {!isByOrder && lng !== 'fa' && totalPrice.toFixed(2)}
        {!isByOrder && lng === 'fa' && formatNumber(totalPrice * euro)}
        &nbsp;{!isByOrder && t('m_unit')}
        {isByOrder && lng !== 'fa' && (totalPrice * 0.2).toFixed(2)}
        {isByOrder && lng === 'fa' && formatNumber(totalPrice * 0.2 * euro)}
        &nbsp;{isByOrder && t('m_unit')}
       </td>
      </tr>
     );
    })}
   </tbody>
  </table>
 );
};

export default ShoppingCart;
