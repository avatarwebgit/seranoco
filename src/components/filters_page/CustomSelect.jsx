import React from 'react';
import { Tooltip } from '@mui/material';

import classes from './CustomSelect.module.css';
const CustomSelect = ({ title, src, alt, onClick, name }) => {
  return (
    <Tooltip
      placement='top'
      title={title}
      onClick={onClick}
      className={classes.main}
    >
      <input
        className={classes.input}
        type='checkbox'
        name={title}
        id={title}
      />
      <label htmlFor={title} className={classes.label}>
        <div className={classes.img_wrapper}>
          <img className={classes.img} src={src} alt={alt} />
        </div>
      </label>
      <p className={classes.name}>{name}</p>
    </Tooltip>
  );
};

export default CustomSelect;
