import React, { useEffect, useState } from 'react';
import { nanoid } from '@reduxjs/toolkit';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import { productDetailActions } from '../../store/store';

import classes from './TableGrid.module.css';
const TableGrid = ({ dataProp, sizeProp, selectedSizeProp }) => {
  const [data, setData] = useState(null);
  const [sizeData, setSizeData] = useState(null);

  const { t } = useTranslation();

  const dispatch = useDispatch();

  useEffect(() => {
    console.log(dataProp);
    console.log(sizeProp);
    if (dataProp) {
      setData(dataProp.reverse());
      if (selectedSizeProp.length > 0) {
        setSizeData(selectedSizeProp);
      } else if (selectedSizeProp.length === 0 && sizeProp.length > 0) {
        setSizeData(sizeProp);
      }
    }
  }, [dataProp, selectedSizeProp, sizeProp]);

  const isSizeAvailableForColor = (color, size) => {
    const colorGroup = data.find(group => group[color]);

    if (colorGroup) {
      const item = colorGroup[color].find(item => item.size === size);
      if (item) {
        return item.quantity > 0;
      }
    }
    return false;
  };

  const handleProductClick = (color, size, sizeId) => {
    const colorGroup = data.find(group => group[color]);
    if (colorGroup) {
      const item = colorGroup[color].find(item => item.size === size);
      if (item) {
        console.log(`Product:`, item);
        console.log(`Size ID: ${sizeId}`);
        dispatch(productDetailActions.addSizeIds([sizeId]));
      }
    }
  };

  return (
    <div>
      {data && sizeData && (
        <table className={classes.table}>
          <thead>
            <tr className={classes.tr}>
              <th className={classes.th}>{t('size')}</th>
              {data &&
                data.map(el => {
                  return (
                    <th
                      className={`${classes.th} ${classes.image_wrapper}`}
                      key={nanoid()}
                    >
                      <img
                        className={classes.img}
                        src={Object.values(el)[0][0].image}
                        loading='lazy'
                        alt=''
                      />
                    </th>
                  );
                })}
            </tr>
          </thead>
          <tbody className={classes.tbody}>
            {sizeData &&
              [...sizeData].map((size, index) => (
                <tr className={classes.tr} key={nanoid()}>
                  <td className={classes.td}>{size.description}</td>

                  {data &&
                    data.map(el => {
                      const id = nanoid();
                      const color = Object.keys(el)[0];
                      const isAvailable = isSizeAvailableForColor(
                        color,
                        size.description,
                      );
                      return (
                        <td key={nanoid()} className={classes.td}>
                          {isAvailable ? (
                            <span>
                              <input type='checkbox' name={id} id={id} />
                              <label
                                htmlFor={id}
                                className={`${classes.available} ${classes.label}`}
                                onClick={() =>
                                  handleProductClick(
                                    color,
                                    size.description,
                                    size.id,
                                  )
                                }
                              >
                                Available
                              </label>
                            </span>
                          ) : (
                            <button className={classes.outOfStock}>
                              Not Available
                            </button>
                          )}
                        </td>
                      );
                    })}
                </tr>
              ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TableGrid;
