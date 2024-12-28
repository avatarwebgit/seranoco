import React, { useEffect, useState } from 'react';
import { Skeleton } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import classes from './ResultRow.module.css';
const ResultRow = ({ dataProp }) => {
  const [data, setData] = useState(null);
  const [isLoadingImage, setIsLoadingImage] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  const { t } = useTranslation();

  useEffect(() => {
    if (dataProp) {
      setData(dataProp);
    }
    if (isLoadingImage) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [dataProp, isLoadingImage]);

  // useEffect(() => {
  //   console.log(isLoading);
  // }, [isLoading]);

  return (
    <>
      <section className={`${classes.main}`}>
        {data && data.length > 0 && (
          <div className={classes.title_wrapper}>
            <p className={`${classes.o0} ${classes.title_text}`}>{t('type')}</p>
            <p className={classes.title_text}>{t('type')}</p>
            <p className={classes.title_text}>{t('details')}</p>
            <p className={classes.title_text}>{t('color')}</p>
            <p className={classes.title_text}>{t('size')}</p>
            <p className={classes.title_text}>{t('weight')}</p>
            <p className={classes.title_text}>{t('quality')}</p>
            <p className={classes.title_text}>{t('cut')}</p>
            <p className={classes.title_text}>{t('report')}</p>
            <p className={classes.title_text}>{t('country')}</p>
            <p className={classes.title_text}>{t('agta')}</p>
            <p className={classes.title_text}>{t('price')}</p>
            <p className={classes.title_text}>{t('quantity')}</p>
            <p className={classes.title_text}>{t('total_price')}</p>
            <p className={`${classes.o0} ${classes.title_text}`}>{t('type')}</p>
          </div>
        )}
        {data &&
          data.map(el => {
            return (
              <Link
                key={el.id}
                to={`/en/products/id=${el.alias}`}
                target='_blank'
              >
                <div
                  className={`${classes.detail_row}  ${
                    isLoading ? classes.dn : ''
                  }`}
                  key={el.id}
                >
                  <div className={classes.img_wrapper}>
                    <img
                      src={el.primary_image}
                      alt=''
                      onLoad={() => setIsLoadingImage(false)}
                    />
                  </div>
                  <p className={classes.detail_text}>{el.name}</p>
                  <p className={classes.detail_text}>{}</p>
                  <p className={classes.detail_text}>{}</p>
                  <p className={classes.detail_text}>{el.size}</p>
                  <p className={classes.detail_text}>{el.weight}</p>
                  <p className={classes.detail_text}>{}</p>
                  <p className={classes.detail_text}>{}</p>
                  <p className={classes.detail_text}>{}</p>
                  <p className={classes.detail_text}>{}</p>
                  <p className={classes.detail_text}>{}</p>
                  <p className={classes.detail_text}>{}</p>
                  <p className={classes.detail_text}>{}</p>
                  <p className={classes.detail_text}>{}</p>
                  <button className={classes.add_to_card}>
                    {t('add_to_card')}
                  </button>
                </div>
              </Link>
            );
          })}
        {/* {data?.length === 0 &&
          data?.map(el => {
            return (
              <Skeleton
                className={`${classes.skeleton} ${
                  !isLoading ? classes.dn : ''
                }`}
                variant='rectangular'
                animation='wave'
                key={el.id}
              />
            );
          })} */}
      </section>
    </>
  );
};

export default ResultRow;
