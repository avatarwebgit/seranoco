import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { IconButton } from '@mui/material';
import { useSelector } from 'react-redux';

import { ReactComponent as Plus } from '../../assets/svg/plus.svg';
import { ReactComponent as Minus } from '../../assets/svg/minus.svg';

import classes from './ResultRow.module.css';
const ResultRow = ({ dataProp }) => {
  const [data, setData] = useState(null);
  const [isLoadingImage, setIsLoadingImage] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [quantities, setQuantities] = useState({});

  const { t, i18n } = useTranslation();

  const lng = useSelector(state => state.localeStore.lng);

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
              </th>{' '}
              <th className={classes.title_text}>
                {t('brand')}&nbsp;/&nbsp;{t('mine')}
              </th>
              <th className={classes.title_text}>{t('size')}</th>
              <th className={classes.title_text}>{t('color')}</th>
              <th className={classes.title_text}>{t('country')}</th>
              <th className={classes.title_text}>{t('agta')}</th>
              <th className={classes.title_text}>{t('report')}</th>
              <th className={classes.title_text}>
                {t('price')}&nbsp;1{t('1_pcs')} / {t('m_unit')}
              </th>
              <th className={classes.title_text}>
                {t('quantity')} / {t('pcs')}
              </th>
              <th className={classes.title_text}>
                {t('total_price')} / {t('m_unit')}
              </th>
              <th className={classes.title_text} style={{ opacity: 0 }}>
                {t('action')}
              </th>
            </tr>
          )}
        </thead>
        <tbody>
          {data &&
            data.map(el => {
              return (
                <tr className={classes.tr} key={el.id}>
                  {/* Image Column */}
                  <td className={classes.img_wrapper}>
                    <img
                      src={el?.primary_image}
                      alt={el.details}
                      onLoad={() => setIsLoadingImage(false)}
                    />
                  </td>
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
                  {/* Size */}
                  <td className={classes.detail_text}>{el.size}</td>{' '}
                  {/* Color */}
                  <td className={classes.detail_text}>{el.color}</td>
                  {/* Quality */}
                  <td className={classes.detail_text}>{el.quality}</td>
                  {/* Report */}
                  <td className={classes.detail_text}>{el.report}</td>
                  {/* AGTA */}
                  <td className={classes.detail_text}>{el.agta}</td>
                  {/* Price */}
                  <td
                    className={classes.detail_text}
                    style={{
                      direction: lng === 'fa' ? 'rtl' : 'ltr',
                    }}
                  >
                    {el.price}
                    &nbsp;{t('m_unit')}
                  </td>
                  {/* Quantity Controls */}
                  <td className={classes.detail_text}>
                    <div className={classes.quantity_controls}>
                      <p className={classes.totoal_quantity}>
                        {quantities[el.id] || 0}
                      </p>
                      <span className={classes.button_wrapper}>
                        <IconButton
                          className={classes.action_btn}
                          onClick={() => handleAddQuantity(el)}
                          disabled={el.quantity === 0}
                        >
                          <Plus width={20} height={20} />
                        </IconButton>
                        <IconButton
                          className={classes.action_btn}
                          onClick={() => handleReduceQuantity(el)}
                          disabled={quantities[el.id] === 0}
                        >
                          <Minus width={20} height={20} />
                        </IconButton>
                      </span>
                    </div>
                  </td>
                  {/* Total Price */}
                  <td
                    className={classes.detail_text}
                    style={{
                      direction: lng === 'fa' ? 'rtl' : 'ltr',
                    }}
                  >
                    &nbsp;{quantities[el.id] * el.price || 0}&nbsp;
                    {t('m_unit')}
                  </td>
                  {/* Action Button */}
                  <td>
                    <center>
                      <button className={classes.add_to_card}>
                        {t('add_to_card')}
                      </button>
                    </center>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </>
  );
};

export default ResultRow;
