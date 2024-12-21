import React, { useEffect, useState } from 'react';

import classes from './ResultRow.module.css';
import { useTranslation } from 'react-i18next';
const ResultRow = ({ dataProp }) => {
  const [data, setData] = useState(null);

  const { t } = useTranslation();

  useEffect(() => {
    if (dataProp) {
      setData(dataProp);
    }
  }, [dataProp]);

  return (
    <section className={classes.main}>
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
        data.length > 0 &&
        data.map(el => {
          return (
            <div className={classes.detail_row} key={el.id}>
              <div className={classes.img_wrapper}>
                <img src={el.primary_image} alt='' />
              </div>
              <p className={classes.detail_text}>{el.name}</p>
              <p className={classes.detail_text}></p>
              <p className={classes.detail_text}></p>
              <p className={classes.detail_text}></p>
              <p className={classes.detail_text}>{el.weight}</p>
              <p className={classes.detail_text}></p>
              <p className={classes.detail_text}></p>
              <p className={classes.detail_text}></p>
              <p className={classes.detail_text}></p>
              <p className={classes.detail_text}></p>
              <p className={classes.detail_text}></p>
              <p className={classes.detail_text}></p>
              <p className={classes.detail_text}></p>
              <button className={classes.add_to_card}>
                {t('add_to_card')}
              </button>
            </div>
          );
        })}
    </section>
  );
};

export default ResultRow;
