import { useState } from 'react';

import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { formatNumber } from '../../utils/helperFunctions';

import classes from './Payment.module.css';
const Payment = () => {
 const [advancedPayment, setAdvancedPayment] = useState(1);
 const { t } = useTranslation();

 const card = useSelector(state => state.cartStore);
 const lng = useSelector(state => state.localeStore.lng);
 return (
  <table className={classes.table}>
   <thead>
    <tr className={classes.tr}>
     <td className={classes.td}>{t('pc.image')}</td>
     <td className={classes.td}>{t('pc.color')}</td>
     <td className={classes.td}>{t('pc.size')}</td>
     <td className={classes.td}>{t('quantity')}</td>
     <td className={classes.td}>{t('pc.advance')}</td>
     <td className={classes.td}>
      {t('pc.value')}/{t('pcs')}
     </td>
     <td className={classes.td}>{t('pc.payment')}</td>
    </tr>
   </thead>
   <tbody>
    {card.finalCart.map(el => {
     const isByOrder =
      el.variation.quantity === 0 && el.variation.is_not_available === 0;
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
       <td className={classes.td}>{el.selected_quantity}</td>
       <td className={classes.td}>
        {isByOrder && lng !== 'fa' && (totalPrice * advancedPayment).toFixed(2)}
        {isByOrder &&
         lng === 'fa' &&
         formatNumber(totalPrice * advancedPayment * card.euro)}
        &nbsp;{isByOrder ? t('m_unit') : '_'}
       </td>
       <td
        className={classes.td}
        style={{ direction: lng === 'fa' ? 'rtl' : 'ltr' }}>
        {!isByOrder && lng !== 'fa' && totalPrice.toFixed(2)}
        {!isByOrder && lng === 'fa' && formatNumber(totalPrice * card.euro)}
        &nbsp;{!isByOrder ? t('m_unit') : '_'}
       </td>
       <td
        className={classes.td}
        style={{ direction: lng === 'fa' ? 'rtl' : 'ltr' }}>
        {!isByOrder && lng !== 'fa' && totalPrice.toFixed(2)}
        {!isByOrder && lng === 'fa' && formatNumber(totalPrice * card.euro)}
        &nbsp;{!isByOrder && t('m_unit')}
        {isByOrder && lng !== 'fa' && (totalPrice * advancedPayment).toFixed(2)}
        {isByOrder &&
         lng === 'fa' &&
         formatNumber(totalPrice * advancedPayment * card.euro)}
        &nbsp;{isByOrder && t('m_unit')}
       </td>
      </tr>
     );
    })}
   </tbody>
  </table>
 );
};

export default Payment;
