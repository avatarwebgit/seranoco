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

import classes from './SubCategory.module.css';
import BannerCarousel from '../components/BannerCarousel';
import CategoryBox from '../components/sub-category/CategoryBox';

const SubCategory = () => {
 const { t } = useTranslation();
 useEffect(() => {
  document.title = t('categories');
 }, []);

 return (
  <section className={classes.main}>
   <BannerCarousel />
   <Header />
   <main>
    <Body className={classes.body} parentClass={classes.body}>
     <Card className={classes.card}>
      <Breadcrumbs
       linkDataProp={[
        { pathname: t('home'), url: ' ' },
        { pathname: t('categories'), url: 'categories' },
       ]}
      />
     </Card>
     <center>
      <h1>{t('shop_by_type')}</h1>
     </center>
     <Card className={classes.card}>
      <div className={classes.grid}>
       {Array.from({ length: 10 }, (_, i) => {
        return <CategoryBox isLoadingData={true} />;
       })}
      </div>
     </Card>
    </Body>
   </main>
   <PromotionalShopCard />
   <Guid />

   <Footer />
  </section>
 );
};

export default SubCategory;
