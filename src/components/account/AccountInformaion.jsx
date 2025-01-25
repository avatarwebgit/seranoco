import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import Wrapper from './Wrapper';
import Body from '../filters_page/Body';
import Card from '../filters_page/Card';

import { ReactComponent as Edit } from '../../assets/svg/edit-black.svg';

import classes from './AccountInformation.module.css';
import { IconButton, Input } from '@mui/material';
const AccountInformaion = () => {
  const { t } = useTranslation();
  const userData = useSelector(state => state.userStore.user);
  const lng = useSelector(state => state.localeStore.lng);

  const [user, setuser] = useState(null);
  const [fields, setfields] = useState([
    { label: t('signup.fname'), value: null, updateAble: true },
    { label: t('signup.lname'), value: null, updateAble: true },
    { label: t('signup.email'), value: null, updateAble: true },
    { label: t('signup.pnumber'), value: null, updateAble: false },
    { label: t('signup.country'), value: null, updateAble: false },
    { label: t('signup.city'), value: null, updateAble: false },
  ]);

  useEffect(() => {
    if (userData) {
      setuser(userData);
      setfields([
        {
          label: t('signup.fname'),
          value: userData.first_name,
          updateAble: true,
        },
        {
          label: t('signup.lname'),
          value: userData.last_name,
          updateAble: true,
        },
        { label: t('signup.email'), value: userData.email, updateAble: true },
        { label: t('signup.pnumber'), value: userData.cellphone },
        { label: t('signup.country'), value: null },
        { label: t('signup.city'), value: null },
      ]);
    }
  }, [userData]);

  const handleSubmit = () => {};

  return (
    <section>
      {user && (
        <>
          <Body>
            <Card className={classes.main}>
              <h3
                className={classes.title}
                style={{ direction: lng === 'fa' ? 'rtl' : 'ltr' }}
              >
                {t('wellcome')} {lng === 'en' && t('back')} {user.first_name}{' '}
                {user.last_name}
              </h3>
              <Wrapper>
                <form onSubmit={handleSubmit}>
                  <div
                    className={classes.wrapper}
                    style={{ direction: lng === 'fa' ? 'rtl' : 'ltr' }}
                  >
                    {fields.map(el => {
                      return (
                        <div className={classes.content}>
                          <div className={classes.values}>
                            <span className={classes.label}>{el.label}</span>
                            <Input className={classes.value} value={el.value} />
                          </div>
                          {el.updateAble && (
                            <IconButton>
                              <Edit width={17} height={17} />
                            </IconButton>
                          )}
                        </div>
                      );
                    })}
                    <div className={classes.adress}>
                      <div className={classes.values}>
                        <span className={classes.title}>
                          {t('profile.addresses')}
                        </span>
                        <span className={classes.value}></span>
                      </div>
                      <IconButton sx={{ justifySelf: 'flex-start' }}>
                        <Edit width={20} height={20} />
                      </IconButton>
                    </div>
                  </div>
                </form>
              </Wrapper>
            </Card>
          </Body>
        </>
      )}
    </section>
  );
};

export default AccountInformaion;
