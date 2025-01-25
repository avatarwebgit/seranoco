import React, { useEffect, useState } from 'react';
import { nanoid } from '@reduxjs/toolkit';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import LoadingSpinner from './LoadingSpinner';
import { productDetailActions } from '../../store/store';
import classes from './TableGrid.module.css';

const TableGrid = ({ dataProp, sizeProp, selectedSizeProp, isLoadingData }) => {
  const [data, setData] = useState(null);
  const [sizeData, setSizeData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const selectedItems = useSelector(state => state.detailsStore.itemIds);
  const dispatch = useDispatch();
  const { t } = useTranslation();

  useEffect(() => {
    setIsLoading(isLoadingData);
    if (dataProp) {
      setData(dataProp);
      if (selectedSizeProp.length > 0) {
        setSizeData(
          selectedSizeProp.sort(
            (a, b) =>
              +a.description.split(' ').at(0) - +b.description.split(' ').at(0),
          ),
        );
      } else if (selectedSizeProp.length === 0 && sizeProp.length > 0) {
        setSizeData(sizeProp);
      }
    }
  }, [dataProp, selectedSizeProp, sizeProp, isLoadingData]);

  const handleCheckboxChange = (color, size, id, isChecked, item) => {
    if (isChecked) {
      dispatch(productDetailActions.addItem(id));
    } else {
      dispatch(productDetailActions.removeItem(id));
    }
  };

  const getAvailabilityLabel = (isNotAvailable, quantity) => {
    if (isNotAvailable === 1) {
      return 'Not Available';
    } else if (quantity > 0) {
      return 'Available';
    } else {
      return 'By Order';
    }
  };

  return (
    <div className={classes.main}>
      {data && data.length > 0 && (
        <table
          className={classes.table}
          style={{ width: `${Object.keys(data).length * 10}%` }}
        >
          <thead>
            <tr className={classes.tr}>
              <th
                className={`${classes.th} ${classes.image_wrapper}`}
              >
                <img
                  className={classes.img}
                  src={''}
                  style={{visibility:'hidden'}}
                />
                <p>{t('size')}</p>
              </th>
              {data.map(el => {
                return (
                  <th
                    className={`${classes.th} ${classes.image_wrapper}`}
                    key={Object.values(el)[0][0].id}
                  >
                    <img
                      className={classes.img}
                      src={Object.values(el)[0][0].image}
                      loading='lazy'
                      alt=''
                    />
                    <p>{Object.values(el)[0][0].color}</p>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className={classes.tbody}>
            {isLoading && (
              <tr className={classes.backdrop}>
                <LoadingSpinner size={'50px'} />
              </tr>
            )}
            {sizeData &&
              [...sizeData].map((size, index) => (
                <tr
                  className={classes.tr}
                  key={index}
                  style={{ opacity: isLoading ? 0.3 : 1 }}
                >
                  <td className={`${classes.td} ${classes.size_data}`}>
                    {size.description}
                  </td>
                  {data.map(el => {
                    const color = Object.keys(el)[0];
                    const item = el[color]?.find(
                      item => item.size === size.description,
                    );
                    const availabilityLabel = item
                      ? getAvailabilityLabel(
                          item.is_not_available,
                          item.quantity,
                        )
                      : 'Not Available';
                    const id = `${color}-${size.description}-${
                      item?.alias || 'unknown'
                    }`;

                    return (
                      <td key={id} className={classes.td}>
                        {(() => {
                          if (
                            availabilityLabel === 'Available' ||
                            availabilityLabel === 'By Order'
                          ) {
                            return (
                              <span
                                style={{
                                  backgroundColor:
                                    availabilityLabel === 'Available'
                                      ? '#a9dfbf'
                                      : '#aed6f1',
                                }}
                              >
                                <input
                                  type='checkbox'
                                  name={id}
                                  id={id}
                                  checked={selectedItems.includes(item?.id)}
                                  onChange={e =>
                                    handleCheckboxChange(
                                      color,
                                      size.description,
                                      item?.id || '',
                                      e.target.checked,
                                      item,
                                    )
                                  }
                                />
                                <label
                                  htmlFor={id}
                                  className={`${classes.available} ${classes.label}`}
                                >
                                  {availabilityLabel}
                                </label>
                              </span>
                            );
                          } else {
                            return (
                              <button className={classes.outOfStock}>
                                {availabilityLabel}
                              </button>
                            );
                          }
                        })()}
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
