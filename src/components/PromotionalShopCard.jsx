import React, { useEffect, useState } from 'react';
import { Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { useAllPromotions } from '../services/api';

import classes from './PromotionalShopCard.module.css';
const PromotionalShopCard = () => {
  const [proData, setProData] = useState(null);
  const { data, isLoading } = useAllPromotions();

  const lng = useSelector(state => state.localeStore.lng);

  useEffect(() => {
    if (data) {
      setProData(data.data.at(0));
    }
  }, [data]);

  const { t } = useTranslation();
  return (
    <>
      {proData && (
        <section
          className={classes.main}
          style={{ backgroundImage: `url(${proData.image})` }}
        >
          <div className={classes.wrapper}>
            <div className={classes.content}>
              <span className={classes.shop_hero}>
                <p className={classes.title}>
                  {lng === 'fa' ? proData.title_fa : proData.title}
                </p>
                <p className={classes.caption}>
                  {lng === 'fa' ? proData.text_fa : proData.text}
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
      )}
    </>
  );
};

export default PromotionalShopCard;
