import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import classes from './ResultMobile.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { cartActions } from '../../store/store';
const ResultMobile = ({ dataProps }) => {
  const [data, setData] = useState(null);

  const { t, i18n } = useTranslation();

  const dispatch = useDispatch();

  const lng = useSelector(state => state.localeStore.lng);
  const cart = useSelector(state => state.cartStore);
  const token = useSelector(state => state.userStore.token);

  useEffect(() => {
    if (dataProps) {
      setData(dataProps);
    }
  }, [dataProps]);

  const handleAddToCart = (e, el) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(
      cartActions.add({ ...el, selected_quantity: 1, euro_price: 100000 }),
    );
  };

  return (
    <div className={classes.main}>
      {data &&
        data.map(el => {
          return (
            <Link
              key={el.id}
              to={`/${lng}/products/${el.alias}/${el.variation_id}`}
            >
              {console.log(el)}
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
                      <p className={classes.detail_text}>{t('quality')}</p>
                      <p className={classes.detail_text}>{t('cut')}</p>
                      <p className={classes.detail_text}>{t('agta')}</p>
                      <p className={classes.detail_text}>{t('weight')}</p>
                      <p className={classes.detail_text}>{t('size')}</p>
                    </span>
                    <span className={classes.value_wrapper}>
                      <p className={classes.detail_text}>{el.type || 'none'}</p>
                      <p className={classes.detail_text}>
                        {el.quality || 'none'}
                      </p>
                      <p className={classes.detail_text}>{el.cut || 'none'}</p>
                      <p className={classes.detail_text}>{el.agta || 'none'}</p>
                      <p className={classes.detail_text}>
                        {el.weight || 'none'}
                      </p>
                      <p className={classes.detail_text}>{el.size || 'none'}</p>
                    </span>
                  </span>
                  <button
                    className={classes.shop_btn}
                    onClick={e => handleAddToCart(e, el)}
                  >
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
