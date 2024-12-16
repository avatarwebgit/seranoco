import React from 'react';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';

import classes from './Link.module.css';

const Link = ({
  title,
  href,
  imgUrl,
  alt,
  className,
  helper_className,
  hepler_text,
}) => {
  const lng = useSelector(state => state.localeStore.lng);
  return (
    <motion.a
      className={classes.main}
      initial={{ y: 0, boxShadow: '0px 10px 5px rgb(214, 214, 214)' }}
      whileHover={{
        boxShadow: [
          '0px 10px 5px rgb(214, 214, 214)',
          '0px 10px 8px rgb(96, 96, 96)',
          '0px 10px 6px rgb(191, 191, 191)',
        ],
      }}
      transition={{ type: 'tween', duration: 0.5 }}
      href={`/${lng}/${href}`}
    >
      <span className={classes.title}>
        <p>{title}</p>
      </span>
      <span className={`${classes.img_container} ${className}`}>
        {imgUrl && <img className={`${classes.img} `} src={imgUrl} alt={alt} />}
      </span>
      <p className={helper_className}>{hepler_text}</p>
    </motion.a>
  );
};

export default Link;
