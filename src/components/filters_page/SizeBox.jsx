import React, { useState } from 'react';

import classes from './SizeBox.module.css';
const SizeBox = ({ value, onClick,id }) => {
  const [isChecked, setIsChecked] = useState(false);

  return (
    <div
      onClick={onClick}
      className={`${classes.main} ${isChecked ? classes.active : ''}`}
      style={{ opacity: isChecked ? 1 : 0.5 }}
    >
      <input
        className={classes.input}
        type='checkbox'
        name={id}
        id={value}
        onChange={e => setIsChecked(e.target.checked)}
      />
      <label htmlFor={value} className={classes.label}>
          {value}
      </label>
    </div>
  );
};

export default SizeBox;
