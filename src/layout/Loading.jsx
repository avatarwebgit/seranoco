import React from 'react';

import gem from '../assets/svg/Gem.svg';

import classes from './Loading.module.css';
const Loading = () => {
  return (
    <div className={classes.main}>
      <span className={classes.svg_wrapper}>
        <img className={classes.svg} src={gem} alt='Loading...' />
      </span>
          <span className={classes.text_wrapper }>
        <p className={classes.text}>Loading</p>
        <div className={classes.loader}></div>
      </span>
    </div>
  );
};

export default Loading;
