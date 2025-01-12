import React, { useEffect, useState } from 'react';
import { Skeleton, Tooltip } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { cartActions } from '../../store/store';

import { formatNumber } from '../../utils/helperFunctions';

import classes from './CartProduct.module.css';
import { DeleteForever, Info } from '@mui/icons-material';
const CartProduct = data => {
  const [productData, setProductData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const { t } = useTranslation();

  const lng = useSelector(state => state.localeStore.lng);
  const dispatch = useDispatch();

  useEffect(() => {
    if (data) {
      setProductData(data.data);
    }
  }, [data]);

  const handleIncrement = () => {
    dispatch(cartActions.increment(productData.id));
  };

  const handleDecrement = () => {
    dispatch(cartActions.decrement(productData.id));
  };

  const handleRemveItem = () => {
    dispatch(cartActions.remove(productData.id));
  };

  return (
    <>
      {productData && (
        <>
          <div
            className={`${classes.main} ${isLoading ? classes.dn : classes.df}`}
            style={{ direction: lng === 'fa' ? 'rtl' : 'ltr' }}
          >
            <div className={classes.img_wrapper}>
              <img
                src={productData.image}
                alt=''
                onLoad={() => setIsLoading(false)}
                onError={() => setIsLoading(false)}
              />
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
                {formatNumber(
                  lng !== 'fa'
                    ? productData.price
                    : productData.price * productData.euro_price,
                )}
                &nbsp;{t('m_unit')}
              </span>
              {lng === 'fa' && (
                <span className={classes.price}>
                  قیمت یورو:
                  {formatNumber(productData.euro_price)}
                  &nbsp;{t('m_unit')}
                </span>
              )}
            </div>
            <div className={classes.actions_wrapper}>
              <div>{productData.selected_quantity}</div>
              <span>
                <button onClick={handleDecrement}>-</button>
                <button onClick={handleIncrement}>+</button>
              </span>
            </div>
            <div className={classes.final}>
              <button onClick={handleRemveItem}>
                <DeleteForever color='error' />
              </button>
              <span
                className={classes.price}
                style={{ direction: lng === 'fa' ? 'rtl' : 'ltr' }}
              >
                {formatNumber(
                  lng !== 'fa'
                    ? productData.price * productData.selected_quantity
                    : productData.price *
                        productData.euro_price *
                        productData.selected_quantity,
                )}
                &nbsp;{t('m_unit')}
              </span>
            </div>
            {productData.quantity === 0 &&
              productData.is_not_available === 0 && (
                <Tooltip
                  title={t('byorder')}
                  className={classes.tip}
                  arrow
                  placement='left'
                >
                  <Info className={classes.info} fontSize='8px' />
                </Tooltip>
              )}
          </div>
          <Skeleton
            className={`${classes.s} ${!isLoading ? classes.dn : classes.df}`}
            height='50px'
            width='100%'
            variant='rectangular'
            animation='wave'
          />
        </>
      )}
    </>
  );
};

export default CartProduct;
