import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { IconButton, Tooltip } from '@mui/material';
import { Add, Clear, Info, OpenInNew } from '@mui/icons-material';

import image from '../../assets/images/1736155352677ba0d8f00e8.webp';
import { cartActions, drawerActions, favoriteActions } from '../../store/store';

import classes from './Product.module.css';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { formatNumber, notify } from '../../utils/helperFunctions';
import { removeFromFavorite } from '../../services/api';

const Product = ({ dataProps, up, av, newItem, closeButtonClick, action }) => {
  const [data, setData] = useState(null);
  const [tipText, setTipText] = useState('new');
  const [tipBg, setTipBg] = useState('#641e16');
  const [inStock, setInStock] = useState(false);
  const [euro, setEuro] = useState(0);

  useEffect(() => {
    if (dataProps) {
      setData(dataProps);
      console.log(dataProps);
    }
    if (up) {
      setEuro(up);
    }
  }, [dataProps, up]);

  const token = useSelector(state => state.userStore.token);

  const { t } = useTranslation();

  const lng = useSelector(state => state.localeStore.lng);

  const dispatch = useDispatch();

  const handleAddToCart = el => {
    dispatch(drawerActions.open());
    dispatch(
      cartActions.add({
        ...data.product,
        ...data.product.variation,
        variation_id: data.product.variation_id,
        selected_quantity: 1,
        euro_price: 100000,
      }),
    );
  };

  const returnQuantity = () => {
    if (data) {
      if (data?.product.variation.quantity > 0) {
        return t('newpage.av');
      } else if (
        data?.product.variation.quantity === 0 &&
        data?.product.variation.is_not_available !== 1
      ) {
        return t('byorder');
      } else {
        return t('newpage.notav');
      }
    }
  };

  const handleRemoveFromFavorites = async () => {
    const serverRes = await removeFromFavorite(
      token,
      +data?.product.variation_id,
    );
    if (serverRes.response.ok) {
      notify(t('product.removed'));
      action();
      dispatch(favoriteActions.remove(+data?.product.variation_id));
    } else {
      notify(t('product.err'));
    }
  };

  return (
    <div className={classes.main}>
      <div className={classes.img_wrapper}>
        <img
          className={classes.img}
          src={data?.product.primary_image}
          alt=''
          loading='lazy'
        />
      </div>
      <p className={classes.name}>{data?.product.name}</p>
      <div
        className={classes.wrapper}
        style={{ flexDirection: lng !== 'fa' ? 'row-reverse' : 'row' }}
      >
        <p
          className={classes.availability}
          style={{ direction: lng === 'fa' ? 'rtl' : 'ltr' }}
        >
          {lng !== 'fa'
            ? +data?.product.price
            : formatNumber(+data?.product.price * euro)}
          {t('m_unit')}{' '}
        </p>
        <p className={classes.availability}>{data?.product.size}</p>
      </div>

      <p
        className={classes.availability}
        style={{ color: av ? 'green' : 'blue' }}
      >
        {returnQuantity()}
      </p>
      <div className={classes.actions_wrapper} arrow placement='top'>
        <Tooltip title={t('product.remove_ow')}>
          {!newItem && (
            <IconButton
              className={`${classes.btn} ${classes.close_btn}`}
              size='medium'
              onClick={handleRemoveFromFavorites}
            >
              <Clear fontSize='13' sx={{ color: 'black' }} />
            </IconButton>
          )}
        </Tooltip>
        <Tooltip title={t('addtocart')} arrow placement='top'>
          <IconButton
            className={classes.btn}
            size='medium'
            onClick={handleAddToCart}
          >
            <Add fontSize='13' sx={{ color: 'black' }} />
          </IconButton>
        </Tooltip>
        <Tooltip title={t('details')} arrow placement='top'>
          <Link
            to={`/${lng}/products/${data?.product.alias}/${data?.product.variation_id}`}
            target='_blank'
            className={classes.link}
          >
            <IconButton className={classes.btn} size='medium'>
              <OpenInNew fontSize='13' sx={{ color: 'black' }} />
            </IconButton>
          </Link>
        </Tooltip>
      </div>
      {newItem && (
        <div className={classes.tip} style={{ backgroundColor: tipBg }}>
          {tipText}
        </div>
      )}
    </div>
  );
};

export default Product;
