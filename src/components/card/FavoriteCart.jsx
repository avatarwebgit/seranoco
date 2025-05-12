import React, { useEffect, useState } from 'react';
import { Skeleton, Tooltip } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { DeleteForever, Info } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { cartActions, drawerActions, favoriteActions } from '../../store/store';

import {
 getAllFavorites,
 getProductDetailsWithId,
 removeFromFavorite,
 removeShoppingCart,
} from '../../services/api';
import { formatNumber, notify } from '../../utils/helperFunctions';
import { sendShoppingCart } from '../../services/api';

import classes from './CartProduct.module.css';
import { Link } from 'react-router-dom';
const FavoriteCart = data => {
 const [productData, setProductData] = useState(null);
 const [variationPrice, setVariationPrice] = useState(0);
 const [quantity, setQuantity] = useState(1);
 const [variation, setVariation] = useState([]);

 const { t } = useTranslation();

 const lng = useSelector(state => state.localeStore.lng);
 const euro = useSelector(state => state.cartStore.euro);
 const token = useSelector(state => state.userStore.token);

 const dispatch = useDispatch();

 useEffect(() => {
  if (data) {
   setProductData(data.data);

   const getVariationDetails = async () => {
    const serverRes = await getProductDetailsWithId(data.data.variation_id);
    setVariationPrice(serverRes.result.product.sale_price);
    setVariation(serverRes.result);
   };
   getVariationDetails();
  }
 }, [data]);

 useEffect(() => {
  if (quantity && productData) {
   dispatch(
    cartActions.setQuantity({
     id: +variation.product.variation_id,
     quantity: quantity,
    }),
   );
  }
 }, [quantity]);

 const getFavoriteItems = async () => {
  const serverRes = await getAllFavorites(token);
  if (serverRes.response.ok) {
   dispatch(favoriteActions.setFetchedProducts(serverRes.result.wishlist));
  }
 };

 //  const handleIncrement = () => {
 //   dispatch(cartActions.increment(productData));
 //  };

 //  const handleDecrement = () => {
 //   dispatch(cartActions.decrement(productData));
 //  };
 const handleRemoveToFavorites = async () => {
  const serverRes = await removeFromFavorite(token, +data.data.variation_id);
  if (serverRes.response.ok) {
   notify(t('product.removed'));
   //  dispatch(favoriteActions.setCount(favoritesCount - 1));
   getFavoriteItems();
  } else {
   notify(t('product.err'));
  }
 };

 return (
  <>
   {productData && (
    <>
     <div
      className={`${classes.main}`}
      style={{ direction: lng === 'fa' ? 'rtl' : 'ltr' }}>
      <span className={classes.righ_wrapper}>
       <Link
        className={classes.img_wrapper}
        to={`${lng}/products/${productData.alias}/${variation?.product?.variation_id}`}
        target='_blank'>
        <img src={productData.primary_image} alt='' loading='lazy' />
       </Link>
       <div className={classes.details_wrapper}>
        <span className={classes.color}>
         {t('color')}:{productData.color}
        </span>
        <span className={classes.size}>
         {t('size')}:{productData.size}
        </span>
        <span className={classes.price}>
         {t('price')}:
         {lng !== 'fa'
          ? productData.sale_price
          : formatNumber(productData.sale_price * euro)}
         &nbsp;{t('m_unit')}
        </span>
        {lng === 'fa' && (
         <span className={classes.price}>
          قیمت یورو:
          {formatNumber(+euro)}
          &nbsp;{t('m_unit')}
         </span>
        )}
       </div>
      </span>
      <div className={classes.actions_wrapper}></div>
      <div className={classes.final}>
       <button onClick={handleRemoveToFavorites}>
        <DeleteForever color='error' />
       </button>
      </div>
     </div>
    </>
   )}
  </>
 );
};

export default FavoriteCart;
