import React from 'react';
import { useTranslation } from 'react-i18next';

import Wrapper from './Wrapper';

import classes from './Favorites.module.css';
import Body from '../filters_page/Body';
import Card from '../filters_page/Card';
import { useSelector } from 'react-redux';
const Favorites = () => {
  const { t } = useTranslation();
  const lng = useSelector(state => state.localeStore.locale);
  return (
    <section>
      <Body>
        <Card className={classes.main}>
          <h3
            className={classes.title}
            style={{ direction: lng === 'fa' ? 'rtl' : 'ltr' }}
          >
            {t('profile.favorites')}
          </h3>
          <Wrapper></Wrapper>
        </Card>
      </Body>
    </section>
  );
};

export default Favorites;
