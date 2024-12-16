import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { localeActions } from '../store/store';
import { IconButton } from '@mui/material';
import { Language } from '@mui/icons-material';

import { ReactComponent as Earth } from '../assets/svg/earth.svg';

const ChangeLanguage = ({ className }) => {
  const lng = useSelector(state => state.localeStore.lng);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const location = useLocation();

  const handleChangeLanguage = () => {
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
      <Earth
        style={{ width: '25px', height: '25px' }}
        color='action'
        className={className}
      />
    </IconButton>
  );
};

export default ChangeLanguage;
