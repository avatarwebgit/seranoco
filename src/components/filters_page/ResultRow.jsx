import React, { useEffect, useState } from 'react';
import { Skeleton } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import classes from './ResultRow.module.css';

const ResultRow = ({ dataProp }) => {
  const [data, setData] = useState(null);
  const [isLoadingImage, setIsLoadingImage] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [quantities, setQuantities] = useState({});

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

  const handleAddQuantity = el => {
    setQuantities(prevQuantities => {
      const newQuantity = prevQuantities[el.id] ? prevQuantities[el.id] + 1 : 1;
      // Ensure the quantity does not exceed the available quantity
      return newQuantity <= el.quantity
        ? { ...prevQuantities, [el.id]: newQuantity }
        : prevQuantities;
    });
  };

  const handleReduceQuantity = el => {
    setQuantities(prevQuantities => {
      const newQuantity = prevQuantities[el.id] ? prevQuantities[el.id] - 1 : 0;
      return newQuantity >= 0
        ? { ...prevQuantities, [el.id]: newQuantity }
        : prevQuantities;
    });
  };

  return (
    <>
      <table className={`${classes.main}`}>
        <thead>
          {data && data.length > 0 && (
            <tr>
              <th className={classes.title_text} style={{ opacity: 0 }}>
                {t('type')}
              </th>
              <th className={classes.title_text}>{t('type')}</th>
              <th className={classes.title_text}>{t('details')}</th>
              <th className={classes.title_text}>{t('color')}</th>
              <th className={classes.title_text}>{t('size')}</th>
              <th className={classes.title_text}>{t('weight')}</th>
              <th className={classes.title_text}>{t('quality')}</th>
              <th className={classes.title_text}>{t('cut')}</th>
              <th className={classes.title_text}>{t('report')}</th>
              <th className={classes.title_text}>{t('country')}</th>
              <th className={classes.title_text}>{t('agta')}</th>
              <th className={classes.title_text}>{t('price')}</th>
              <th className={classes.title_text}>{t('quantity')}</th>
              <th className={classes.title_text}>{t('total_price')}</th>
              <th className={classes.title_text}>{t('action')}</th>
              <th className={classes.title_text} style={{ opacity: 0 }}>
                {t('action')}
              </th>
            </tr>
          )}
        </thead>
        <tbody>
          {data &&
            data.map(el => (
              <tr className={classes.tr} key={el.id}>
                {/* Image Column */}
                <td className={classes.img_wrapper}>
                  <img
                    src={el.primary_image}
                    alt={el.details}
                    onLoad={() => setIsLoadingImage(false)}
                  />
                </td>
                <td />
                {/* Detail Column */}
                <td className={classes.detail_text}>
                  <Link
                    to={`/en/products/id=${el.alias}`}
                    target='_blank'
                    className={classes.link}
                  >
                    {el.details}
                  </Link>
                </td>
                {/* Color */}
                <td className={classes.detail_text}>{el.color}</td>
                {/* Size */}
                <td className={classes.detail_text}>{el.size}</td>
                {/* Weight */}
                <td className={classes.detail_text}>{el.weight}</td>
                {/* Quality */}
                <td className={classes.detail_text}>{el.quality}</td>
                {/* Cut */}
                <td className={classes.detail_text}>{el.cut}</td>
                {/* Report */}
                <td className={classes.detail_text}>{el.report}</td>
                {/* Country */}
                <td className={classes.detail_text}>{el.country}</td>
                {/* AGTA */}
                <td className={classes.detail_text}>{el.agta}</td>
                {/* Price */}
                <td className={classes.detail_text}>{el.price}</td>
                {/* Quantity Controls */}
                <td className={classes.detail_text}>
                  <div className={classes.quantity_controls}>
                    <p className={classes.totoal_quantity}>
                      {quantities[el.id] || 0}
                    </p>
                    <span className={classes.button_wrapper}>
                      <button
                        className={classes.action_btn}
                        onClick={() => handleAddQuantity(el)}
                        disabled={el.quantity === 0}
                      >
                        +
                      </button>
                      <button
                        className={classes.action_btn}
                        onClick={() => handleReduceQuantity(el)}
                        disabled={quantities[el.id] === 0}
                      >
                        -
                      </button>
                    </span>
                  </div>
                </td>
                {/* Total Price */}
                <td className={classes.detail_text}>
                  {quantities[el.id] * el.price || 0}
                </td>
                {/* Action Button */}
                <td>
                  <button className={classes.add_to_card}>
                    {t('add_to_card')}
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </>
  );
};

export default ResultRow;
