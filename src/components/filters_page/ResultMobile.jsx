import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux';
import { sendShoppingCart } from '../../services/api';
import {
 accesModalActions,
 cartActions,
 drawerActions,
} from '../../store/store';

import { formatNumber, notify } from '../../utils/helperFunctions';

import classes from './ResultMobile.module.css';
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

 const handleAddToTemporaryCard = (el, variation, quantity) => {
  cartActions.addToTemporaryCart(el.id, +variation, quantity);
 };

 return (
  <div className={classes.main} dir={lng === 'fa' ? 'rtl' : 'ltr'}>
   {data &&
    data.map(el => {
     const colorAttr = el?.attribute.find(
      attr => attr.attribute.name === 'Color',
     ).value;
     const detailAttr = el?.attribute?.find(
      attr => attr.attribute.name === 'Details',
     ).value;
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
         <p className={classes.name}>{!lng === 'fa' ? el.name : el.name_fa}</p>
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
          <p className={classes.detail_text}>{el?.details || 'none'}</p>
          <p className={classes.detail_text}>{el?.size || 'none'}</p>
          <p className={classes.detail_text}>
           {lng === 'fa' ? colorAttr.name_fa : colorAttr.name || 'none'}
          </p>
          <p className={classes.detail_text}>
           {lng === 'fa' ? detailAttr.name_fa : detailAttr.name || 'none'}
          </p>
          <p className={classes.detail_text}>{el?.country || 'none'}</p>
          <p className={classes.detail_text}>
           <div className={classes.price_wrapper}>
            {lng !== 'fa' ? (
             <>
              {+el.percent_sale_price !== 0 && (
               <span className={classes.prev_price}>
                <p
                 style={{
                  textDecoration: 'line-through',
                  fontSize: '.5rem',
                 }}>
                 {el.price}
                 {t('m_unit')}
                </p>{' '}
                <p className={classes.off_text}>{el.percent_sale_price}%</p>
               </span>
              )}

              <p className={classes.current_price}>{el.sale_price}&nbsp;€</p>
             </>
            ) : (
             <>
              {el.percent_sale_price !== 0 && (
               <span className={classes.prev_price}>
                <p
                 style={{
                  textDecoration: 'line-through',
                  fontSize: '.5rem',
                 }}>
                 {el?.price * euro} {t('m_unit')}
                </p>{' '}
                <p className={classes.off_text}>{el.percent_sale_price}%</p>
               </span>
              )}

              <p className={classes.current_price}>
               {formatNumber(el.sale_price * euro)}
               تومان (&nbsp;€&nbsp;
               {el.sale_price} )
              </p>
             </>
            )}
           </div>
          </p>
         </span>
        </span>
        {token ? (
         <button
          className={classes.shop_btn}
          onClick={e => handleSendShoppingCart(el, el?.variation_id, 1)}>
          {t('add_to_card')}
         </button>
        ) : (
         <button
          className={classes.shop_btn}
          onClick={e => handleAddToTemporaryCard(el, el.variation_id, 1)}>
          {t('add_to_card')}
         </button>
        )}
       </div>
      </div>
     );
    })}
  </div>
 );
};

export default ResultMobile;
