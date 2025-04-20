import React, { useEffect, useState } from 'react';
import { Skeleton, Tooltip } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { DeleteForever, Info } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { cartActions, drawerActions } from '../../store/store';

import { getProductDetailsWithId } from '../../services/api';
import { formatNumber, notify } from '../../utils/helperFunctions';
import { sendShoppingCart } from '../../services/api';

import classes from './CartProduct.module.css';
const CartProduct = data => {
 const [productData, setProductData] = useState(null);
 const [variationPrice, setVariationPrice] = useState(0);
 const [quantity, setQuantity] = useState(1);
 const [variation, setVariation] = useState([]);

 const { t } = useTranslation();

 const lng = useSelector(state => state.localeStore.lng);
 const euro = useSelector(state => state.cartStore.euro);
 const token = useSelector(state => state.userStore.token);
 const totalPrice = useSelector(state => state.cartStore.totalPrice);
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
   console.log(variation);
   dispatch(
    cartActions.setQuantity({
     id: +variation.product.variation_id,
     quantity: quantity,
    }),
   );
  }
 }, [quantity]);

 //  const handleIncrement = () => {
 //   dispatch(cartActions.increment(productData));
 //  };

 //  const handleDecrement = () => {
 //   dispatch(cartActions.decrement(productData));
 //  };

 const handleRemveItem = () => {
  dispatch(cartActions.remove(productData));
 };

 const handleSendShoppingCart = async () => {
  const serverRes = await sendShoppingCart(
   token,
   productData.id,
   variation.result.product.id,
   +quantity,
  );
  try {
   notify(t('orders.ok'));
   if (serverRes.response.ok) {
    dispatch(
     cartActions.add({
      ...productData,
      selected_quantity: quantity,
      euro_price: euro,
      variation_id: variation.result.product.id.id,
      variation: { quantity: quantity },
     }),
    );
   }
   dispatch(drawerActions.open());
  } catch (err) {
   console.log(err);
  }
 };

 return (
  <>
   {productData && (
    <>
     <div
      className={`${classes.main}`}
      style={{ direction: lng === 'fa' ? 'rtl' : 'ltr' }}>
      <div className={classes.img_wrapper}>
       <img src={productData.primary_image} alt='' loading='lazy' />
      </div>
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
      <div className={classes.actions_wrapper}>
       <div>
        {Object.keys(variation).length > 0 && (
         <input
          type='number'
          value={quantity}
          onChange={e => {
           const inputValue = e.target.value.replace(/[^0-9]/g, ''); 

           if (
            variation?.product?.variation?.is_not_available === 0 &&
            +variation?.product?.variation?.quantity > 0
           ) {
            setQuantity(
             Math.min(+inputValue, +variation.product.variation.quantity),
            );
           } else {
    
            setQuantity(inputValue);
           }
          }}
          className={classes.quantity_input}
         />
        )}
       </div>
       {/* <span>
        <button onClick={handleIncrement}>+</button>
        <button onClick={handleDecrement}>-</button>
       </span> */}
      </div>
      <div className={classes.final}>
       <button onClick={handleRemveItem}>
        <DeleteForever color='error' />
       </button>
       <span
        className={classes.price}
        style={{ direction: lng === 'fa' ? 'rtl' : 'ltr' }}>
        {lng !== 'fa'
         ? (Math.round(quantity * productData.sale_price * 10) / 10).toFixed(2)
         : formatNumber(quantity * productData.sale_price * euro)}
        &nbsp;{t('m_unit')}
       </span>
      </div>
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
    </>
   )}
  </>
 );
};

export default CartProduct;
