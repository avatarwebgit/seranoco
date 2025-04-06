import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import Header from '../layout/Header';
import Footer from '../layout/Footer';
import PromotionalShopCard from '../components/PromotionalShopCard';
import Guid from '../components/Guid';
import Breadcrumbs from '../components/common/Breadcrumbs';
import Body from '../components/filters_page/Body';
import Card from '../components/filters_page/Card';
import FilterLinks from '../components/FilterLinks';

import classes from './Categories.module.css';
import BannerCarousel from '../components/BannerCarousel';

const Categories = () => {
 const { t } = useTranslation();
 useEffect(() => {
  document.title = t('seranoco') + '/' + t('categories');
 }, []);

 return (
  <section className={classes.main}>
   <BannerCarousel />
   <Header />
   <Body className={classes.body} parentClass={classes.body}>
    <Card>
     <Breadcrumbs
      linkDataProp={[
       { pathname: t('home'), url: ' ' },
       { pathname: t('categories'), url: 'categories' },
      ]}
     />
    </Card>
   </Body>
   <FilterLinks />
   <PromotionalShopCard />
   <Guid />

   <Footer />
  </section>
 );
};

export default Categories;
