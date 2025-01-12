import React, { useEffect, useState } from 'react';
import { Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { useAllPromotions } from '../services/api';

import Body from './filters_page/Body';
import Card from './filters_page/Card';

import classes from './SecandaryPromotionShopCart.module.css';
const SecondaryPromotionShopCart = () => {
  const [proData, setProData] = useState(null);
  const { data, isLoading } = useAllPromotions();

  const lng = useSelector(state => state.localeStore.lng);

  useEffect(() => {
    if (data) {
      setProData(data.data);
    }
  }, [data]);

  const { t } = useTranslation();
  return (
    <Body parentClass={classes.body}>
      {proData &&
        proData.map((el, i) => {
          if (i === 0) return;
          return (
            <section
              className={classes.main}
              style={{ backgroundImage: `url(${el.image})` }}
            >
              <div className={classes.wrapper}>
                <div className={classes.content}>
                  <span className={classes.shop_hero}>
                    <p className={classes.title}>
                      {lng === 'fa' ? el.title_fa : el.title}
                    </p>
                    <p className={classes.caption}>
                      {lng === 'fa' ? el.text_fa : el.text}
                    </p>
                    <Link>
                      <Button
                        className={classes.shop_btn}
                        size='large'
                        variant='outlined'
                      >
                        {t('shop_now')}
                      </Button>
                    </Link>
                  </span>
                </div>
              </div>
            </section>
          );
        })}
    </Body>
  );
};

export default SecondaryPromotionShopCart;
