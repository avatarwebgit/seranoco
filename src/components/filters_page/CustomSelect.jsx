import React from 'react';
import { Tooltip } from '@mui/material';

import classes from './CustomSelect.module.css';
const CustomSelect = ({ id, src, alt, onClick, description, name }) => {
  return (
    <Tooltip
      placement='top'
      title={description}
      onClick={onClick}
      className={classes.main}
    >
      <input
        className={classes.input}
        type='radio'
        name={'shapeRadioSelect'}
        id={id}
        value={id}
      />
      <label htmlFor={id} className={classes.label}>
        <div className={classes.img_wrapper}>
          <img className={classes.img} src={src} alt={alt} />
        </div>
      </label>
      <p className={classes.name}>{name}</p>
    </Tooltip>
  );
};

export default CustomSelect;
