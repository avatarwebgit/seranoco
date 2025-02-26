import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import BannerCarousel from '../components/BannerCarousel';
import Header from '../layout/Header';
import Footer from '../layout/Footer';
import Body from '../components/filters_page/Body';
import Card from '../components/filters_page/Card';

import classes from './Ticket.module.css';
const Ticket = ({ windowSize }) => {
 const { t } = useTranslation();
 const lng = useSelector(state => state.localeStore.lng);

 useEffect(() => {
  if (lng === 'fa') {
   document.title = 'پشتیبانی';
  } else {
   document.title = 'Support';
  }
 }, [lng]);
 return (
  <div>
   <BannerCarousel />
   <Header windowSize={windowSize} />
   <Body>
    <Card></Card>
   </Body>
   <Footer />
  </div>
 );
};

export default Ticket;
