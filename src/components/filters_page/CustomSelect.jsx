import React, { useEffect, useState } from 'react';
import { Tooltip } from '@mui/material';

import classes from './CustomSelect.module.css';
import { Skeleton } from '@mui/material';
const CustomSelect = ({
  id,
  src,
  alt,
  onClick,
  description,
  name,
  isSelected,
}) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className={classes.wrapper}>
      <Tooltip
        placement='top'
        title={description}
        onClick={onClick}
        className={`${classes.main}  ${isLoading ? classes.o0 : classes.o1}`}
        arrow
      >
        <input
          className={classes.input}
          type='radio'
          name={'shapeRadioSelect'}
          id={id}
          value={id}
        />
        <label
          htmlFor={id}
          className={`${classes.label}`}
          style={{ opacity: isSelected===id?'1': '0.5' }}
        >
          <div className={classes.img_wrapper}>
            <img
              className={`${classes.img}`}
              src={src}
              alt={alt}
              loading='lazy'
              onLoad={() => setIsLoading(false)}
            />
          </div>
        </label>
        <p className={classes.name}>{name}</p>
      </Tooltip>
      <Skeleton
        variant='rectangular'
        animation='wave'
        className={`${classes.skeleton} ${
          !isLoading ? classes.o0 : classes.o1
        } `}
      />
    </div>
  );
};

export default CustomSelect;
