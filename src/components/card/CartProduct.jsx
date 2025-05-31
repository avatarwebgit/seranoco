import React, { memo, useEffect, useState, useRef } from 'react'; // Import useRef
import { Skeleton, Tooltip } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { DeleteForever, Info } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { cartActions, drawerActions } from '../../store/store';

import {
 getProductDetailsWithId,
 removeShoppingCart,
} from '../../services/api';
import { formatNumber, notify } from '../../utils/helperFunctions';
import { sendShoppingCart } from '../../services/api';

import classes from './CartProduct.module.css';
import { Link } from 'react-router-dom';

const CartProduct = data => {
 const [productData, setProductData] = useState(null);
 const [variationPrice, setVariationPrice] = useState(0);
 const [quantity, setQuantity] = useState(1);
 const [variation, setVariation] = useState([]);
 const [isMoreThanQuantity, setIsMoreThanQuantity] = useState(false);

 const abortControllerRef = useRef(new AbortController());

 const { t } = useTranslation();
 const lng = useSelector(state => state.localeStore.lng);
 const euro = useSelector(state => state.cartStore.euro);
 const token = useSelector(state => state.userStore.token);
 const dispatch = useDispatch();

 const getVariationDetails = async e => {
  const serverRes = await getProductDetailsWithId(e.variation_id);
  setVariationPrice(serverRes.result.product.sale_price);
  setVariation(serverRes.result);
  setQuantity(e.selected_quantity);
 };

 useEffect(() => {
  if (data) {
   setProductData(data.data);
   getVariationDetails(data.data);
  }

  return () => {
   abortControllerRef.current.abort();
   abortControllerRef.current = new AbortController();
  };
 }, [data]);

 const handleSendShoppingCart = async quantity => {
  try {
   abortControllerRef.current.abort();
   abortControllerRef.current = new AbortController();

   const serverRes = await sendShoppingCart(
    token,
    data.data.id,
    +variation.product.variation_id,
    +quantity,
    abortControllerRef.current.signal,
   );
   notify(t('orders.ok'));
   dispatch(drawerActions.open());
   dispatch(cartActions.setTotalPrice(serverRes.result.total_price));
  } catch (err) {
   if (err.name !== 'AbortError') {
    console.error(err);
   }
  }
 };

 const handleRemveItem = async () => {
  const serverRes = await removeShoppingCart(
   token,
   productData.id,
   variation.product.variation_id,
  );
  if (serverRes.response.ok) {
   dispatch(cartActions.remove(productData));
  } else {
   notify(t(''));
  }
 };

 return (
  <>
   {productData && (
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
        {t('color')}: {productData.color}
       </span>
       <span className={classes.size}>
        {t('size')}: {productData.size}
       </span>
       <span className={classes.price}>
        {t('price')}:
        {lng !== 'fa'
         ? productData.sale_price
         : formatNumber(productData.sale_price * euro)}
        &nbsp;{t('m_unit')}
       </span>
      </div>
     </span>

     <span className={classes.left_wrapper}>
      <div className={classes.actions_wrapper}>
       <div>
        {Object.keys(variation).length > 0 && (
         <div className={classes.input_wrapper}>
          <p style={{ textAlign: lng === 'fa' ? 'right' : 'left' }}>
           {t('quantity')}:
          </p>
          <input
           type='number'
           value={quantity}
           onChange={e => {
            const inputValue = e.target.value.replace(/[^0-9]/g, '');
            const availableQuantity = +variation?.product?.variation?.quantity;

            if (
             variation?.product?.variation?.is_not_available === 0 &&
             availableQuantity > 0
            ) {
             const newQuantity = +inputValue;
             if (newQuantity > availableQuantity) {
              setIsMoreThanQuantity(true);
              setQuantity(availableQuantity);
              handleSendShoppingCart(availableQuantity);
             } else {
              setIsMoreThanQuantity(false);
              setQuantity(newQuantity);
              handleSendShoppingCart(newQuantity);
             }
            } else {
             setIsMoreThanQuantity(false);
             setQuantity(inputValue);
             handleSendShoppingCart(inputValue);
            }
           }}
           className={classes.quantity_input}
           style={{ borderColor: isMoreThanQuantity ? 'red' : 'black' }}
          />
          {isMoreThanQuantity && (
           <p style={{ opacity: 1, color: 'red', width: '50px' }}>
            {t('availableQuantity')}: {+variation.product.variation.quantity}
           </p>
          )}
         </div>
        )}
       </div>
      </div>

      <div className={classes.final}>
       <button onClick={handleRemveItem}>
        <DeleteForever color='error' />
       </button>
       <span
        className={classes.price}
        style={{ direction: lng === 'fa' ? 'rtl' : 'ltr' }}>
        {lng !== 'fa'
         ? (quantity * productData.sale_price).toFixed(2)
         : formatNumber(Math.round(quantity * productData.sale_price * euro))}
        &nbsp;
        <br />
        {t('m_unit')}
       </span>
      </div>
     </span>

     {productData.variation?.quantity === 0 &&
      productData.variation?.is_not_available === 0 && (
       <Tooltip
        title={t('byorder')}
        className={classes.tip}
        arrow
        placement='left'>
        <Info className={classes.info} fontSize='8px' />
       </Tooltip>
      )}
    </div>
   )}
  </>
 );
};

export default memo(CartProduct);
