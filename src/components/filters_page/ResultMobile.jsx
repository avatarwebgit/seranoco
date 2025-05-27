import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import classes from './ResultMobile.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { cartActions, drawerActions } from '../../store/store';
import { formatNumber, notify } from '../../utils/helperFunctions';
import { sendShoppingCart } from '../../services/api';
const ResultMobile = ({ dataProps }) => {
 const [data, setData] = useState(null);

 const { t, i18n } = useTranslation();

 const dispatch = useDispatch();

 const lng = useSelector(state => state.localeStore.lng);
 const cart = useSelector(state => state.cartStore);
 const token = useSelector(state => state.userStore.token);
 const euro = useSelector(state => state.cartStore.euro);

 useEffect(() => {
  if (dataProps) {
   setData(dataProps);
  }
 }, [dataProps]);

 const handleSendShoppingCart = async (el, variation, quantity) => {

  try {
   const serverRes = await sendShoppingCart(token, el.id, +variation, quantity);
   if (serverRes.response.ok) {
    dispatch(drawerActions.open());
   }
  } catch (err) {
   //  console.log(err);
  } finally {
   notify(t('orders.ok'));
  }
 };

 return (
  <div className={classes.main}>
   {data &&
    data.map(el => {
     return (
      <div className={classes.wrapper}>
       <div className={classes.right_side}>
        <Link
         key={el.id}
         to={`/${lng}/products/${el.alias}/${el.variation_id}`}>
         <img src={el.primary_image} alt='' loading='lazy' />
        </Link>
       </div>
       <div className={classes.left_side}>
        <span className={classes.name_wrapper}>
         <p className={classes.name}>{el.name}</p>
        </span>
        <span className={classes.details}>
         <span className={classes.text_wrapper}>
          <p className={classes.detail_text}>{t('type')}</p>
          <p className={classes.detail_text}>{t('size')}</p>
          <p className={classes.detail_text}>{t('color')}</p>
          <p className={classes.detail_text}>{t('details')}</p>
          <p className={classes.detail_text}>{t('country')}</p>
          <p className={classes.detail_text}>
           {t('price')}&nbsp;1{t('1_pcs')} / {t('m_unit')}
          </p>
         </span>
         <span className={classes.value_wrapper}>
          <p className={classes.detail_text}>{el.details || 'none'}</p>
          <p className={classes.detail_text}>{el.size || 'none'}</p>
          <p className={classes.detail_text}>{el.color || 'none'}</p>
          <p className={classes.detail_text}>
           {el?.attribute?.find(attr => attr.attribute.name === 'Details').value
            .name || 'none'}
          </p>
          <p className={classes.detail_text}>{el.country || 'none'}</p>
          <p className={classes.detail_text}>
           {lng === 'en' ? (
            <>
             {+el.sale_price?.toFixed(2)}
             {t('m_unit')}
            </>
           ) : (
            <>
             <>
              {formatNumber(+el.sale_price * euro)}&nbsp;
              {t('m_unit')}
             </>
             <br />
             (€&nbsp; {+el.sale_price?.toFixed(2)})
            </>
           )}
          </p>
         </span>
        </span>
        <button
         className={classes.shop_btn}
         onClick={e => handleSendShoppingCart(el, el.variation_id, 1)}>
         {t('add_to_card')}
        </button>
       </div>
      </div>
     );
    })}
  </div>
 );
};

export default ResultMobile;
