import React, { useEffect, useState } from 'react';

import classes from './ResultMobile.module.css';
const ResultMobile = ({ dataProps }) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    setData(dataProps);
  }, [dataProps]);

  return (
    <div className={classes.main}>
      {data &&
        data.map(el => {
          return (
            <div className={classes.wrapper}>
              <div className={classes.right_side}>
                <img src={el.primary_image} alt='' />
              </div>
              <div className={classes.left_side}>d</div>
            </div>
          );
        })}
    </div>
  );
};

export default ResultMobile;
