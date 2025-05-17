import React, { memo, useEffect, useState } from 'react';
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

 const { t } = useTranslation();

 const lng = useSelector(state => state.localeStore.lng);
 const euro = useSelector(state => state.cartStore.euro);
 const token = useSelector(state => state.userStore.token);
 const totalPrice = useSelector(state => state.cartStore.totalPrice);
 const dispatch = useDispatch();

 useEffect(() => {
  if (data) {
   setProductData(data.data);
    console.log(data.data)
   const getVariationDetails = async () => {
    const serverRes = await getProductDetailsWithId(data.data.variation_id);
    setVariationPrice(serverRes.result.product.sale_price);
     setVariation(serverRes.result);
     setQuantity(data.data.selected_quantity);
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

 //  const handleIncrement = () => {
 //   dispatch(cartActions.increment(productData));
 //  };

 //  const handleDecrement = () => {
 //   dispatch(cartActions.decrement(productData));
 //  };

  const handleSendShoppingCart = async () => {
  console.log(data.data.id, +variation.product.variation_id, +quantity);
  const serverRes = await sendShoppingCart(
   token,
   data.data.id,
   +variation.product.variation_id,
   +quantity,
  );
  try {
   notify(t('orders.ok'));
   if (serverRes.response.ok) {
    dispatch(
     cartActions.add({
      ...data,
      sdataected_quantity: quantity,
      euro_price: euro,
      variation_id: variation,
      variation: { quantity: data.quantity },
     }),
    );
   }
   dispatch(drawerActions.open());
  } catch (err) {
   //  console.log(err);
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
              } else {
               setIsMoreThanQuantity(false);
               setQuantity(newQuantity);
               handleSendShoppingCart();
              }
             } else {
              setIsMoreThanQuantity(false);
              setQuantity(inputValue);
              handleSendShoppingCart();
             }
            }}
            className={classes.quantity_input}
            style={{ borderColor: isMoreThanQuantity ? 'red' : 'black' }}
           />
           {
            <p
             style={{
              opacity: `${isMoreThanQuantity ? 1 : 0}`,
              color: 'red',
              whiteSpace: 'nowrap',
             }}>
             {t('availableQuantity')}: {+variation.product.variation.quantity}
            </p>
           }
          </div>
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
          ? (quantity * productData.sale_price).toFixed(2)
          : formatNumber(quantity * productData.sale_price * euro)}
         &nbsp;<br/>{t('m_unit')}
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
    </>
   )}
  </>
 );
};

export default memo(CartProduct);
