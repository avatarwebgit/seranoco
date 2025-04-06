import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import BannerCarousel from '../components/BannerCarousel';
import Header from '../layout/Header';
import Footer from '../layout/Footer';
import Body from '../components/filters_page/Body';
import Card from '../components/filters_page/Card';

const NotFound = ({ windowSize }) => {
 const { t } = useTranslation();

 useEffect(() => {
  document.title = t('seranoco') + '/' + t('shop_by_color');
 }, []);

 return (
  <div>
   <BannerCarousel />
   <Header windowSize={windowSize} />
   <Body>
    <Card>Not Found</Card>
   </Body>
   <Footer />
  </div>
 );
};

export default NotFound;
