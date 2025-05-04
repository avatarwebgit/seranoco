import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import classes from './ResultMobile.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { cartActions, drawerActions } from '../../store/store';
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

 const handleAddToCart = el => {
  // el.stopPropagation();
  // dispatch(drawerActions.open());
  // dispatch(
  //  cartActions.add({
  //   ...el,
  //   selected_quantity: 1,
  //   euro_price: euro,
  //  }),
  // );
 };

 return (
  <div className={classes.main}>
   {data &&
    data.map(el => {
     return (
      <Link key={el.id} to={`/${lng}/products/${el.alias}/${el.variation_id}`}>
       <div className={classes.wrapper}>
        <div className={classes.right_side}>
         <img src={el.primary_image} alt='' loading='lazy' />
        </div>
        <div className={classes.left_side}>
         <span className={classes.name_wrapper}>
          <p className={classes.name}>{el.name}</p>
         </span>
         <span className={classes.details}>
          <span className={classes.text_wrapper}>
           <p className={classes.detail_text}>{t('type')}</p>
           <p className={classes.detail_text}>{t('brand') / t('mine')}</p>
           <p className={classes.detail_text}>{t('size')}</p>
           <p className={classes.detail_text}>{t('color')}</p>
           <p className={classes.detail_text}>{t('detail')}</p>
           <p className={classes.detail_text}>{t('country')}</p>
           <p className={classes.detail_text}>
            {t('price')}&nbsp;1{t('1_pcs')} / {t('m_unit')}
           </p>
          </span>
          <span className={classes.value_wrapper}>
           <p className={classes.detail_text}>{el.type || 'none'}</p>
           <p className={classes.detail_text}>{el.quality || 'none'}</p>
           <p className={classes.detail_text}>{el.size || 'none'}</p>
           <p className={classes.detail_text}>{el.color || 'none'}</p>
           <p className={classes.detail_text}>
            {el?.attribute?.find(attr => attr.attribute.name === 'Details')
             .value.name || 'none'}
           </p>
           <p className={classes.detail_text}>{el.country || 'none'}</p>
           <p className={classes.detail_text}>{el.size || 'none'}</p>
          </span>
         </span>
         <button
          className={classes.shop_btn}
          onClick={e => handleAddToCart(e, el)}>
          {t('add_to_card')}
         </button>
        </div>
       </div>
      </Link>
     );
    })}
  </div>
 );
};

export default ResultMobile;
