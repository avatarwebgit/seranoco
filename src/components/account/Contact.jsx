import React from 'react';
import { useTranslation } from 'react-i18next';

import Wrapper from './Wrapper';
import Body from '../filters_page/Body';
import Card from '../filters_page/Card';

import instagram from '../../assets/svg/instagram.svg';
import whatsapp from '../../assets/svg/whatsapp.svg';
import telegram from '../../assets/svg/telegram.svg';
import email from '../../assets/svg/email.svg';
import address from '../../assets/svg/address.svg';

import classes from './Contact.module.css';
import { useSelector } from 'react-redux';
const Contact = () => {
 const { t } = useTranslation();
 const lng = useSelector(state => state.localeStore.lng);
 return (
  <Body parentClass={classes.body}>
   <Card className={classes.main}>
    <h3
     className={classes.title}
     style={{ direction: lng === 'fa' ? 'rtl' : 'ltr' }}>
     {t('profile.favorites')}
    </h3>
    <Wrapper>
     <div className={classes.content}>
      <img src={address} alt='' width={35}  style={{margin:'35px 10px'}}/>
      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Explicabo, error.
     </div>
     <div className={classes.content}>
      <img src={instagram} alt='' width={35} />
      +98 912 2099144
     </div>
     <div className={classes.content}>
      <img src={whatsapp} alt='' width={35} />
      +98 912 2099144
     </div>
     <div className={classes.content}>
      <img src={telegram} alt='' width={35} />
      +98 912 2099144
     </div>
     <div className={classes.content}>
      <img src={email} alt='' width={35} />
      +98 912 2099144
     </div>
    </Wrapper>
   </Card>
  </Body>
 );
};

export default Contact;
