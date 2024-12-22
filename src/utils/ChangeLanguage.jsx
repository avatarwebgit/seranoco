import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { localeActions } from '../store/store';
import { IconButton } from '@mui/material';

import { ReactComponent as Earth } from '../assets/svg/earth_white.svg';
import { ReactComponent as EarthBlack } from '../assets/svg/earth.svg';

const ChangeLanguage = props => {
  const lng = useSelector(state => state.localeStore.lng);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const location = useLocation();

  const handleChangeLanguage = d => {
    const newLang = lng === 'fa' ? 'en' : 'fa';
    dispatch(localeActions[newLang]());
    toggle(newLang);
  };

  const toggle = newLang => {
    i18n.changeLanguage(newLang);
    const currentPath = location.pathname.split('/').slice(2).join('/');
    if (currentPath === ``) {
      return navigate(`/${newLang}`);
    } else {
      navigate(`/${newLang}/${currentPath}`);
    }
  };

  return (
    <IconButton onClick={handleChangeLanguage}>
      {!props.isHomePage ? (
        <Earth color='action' className={`${props.className}`} {...props} />
      ) : (
        <EarthBlack
          color='action'
          className={`${props.className}`}
          {...props}
        />
      )}
    </IconButton>
  );
};

export default ChangeLanguage;
