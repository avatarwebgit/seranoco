import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import classes from './ResultMobile.module.css';
const ResultMobile = ({ dataProps }) => {
  const [data, setData] = useState(null);

  const { t } = useTranslation();

  useEffect(() => {
    setData(dataProps);
  }, [dataProps]);

  return (
    <div className={classes.main}>
      {data &&
        data.map(el => {
          return (
            <Link key={el.id} to={`/en/products/id=${el.alias}`}>
              <div className={classes.wrapper}>
                <div className={classes.right_side}>
                  <img src={el.primary_image} alt='' />
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
                  <button className={classes.shop_btn}>
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
