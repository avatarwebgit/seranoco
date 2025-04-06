import { useTranslation } from 'react-i18next';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

import Header from '../layout/Header';
import Footer from '../layout/Footer';
import Guid from '../components/Guid';
import Card from '../components/filters_page/Card';
import Body from '../components/filters_page/Body';
import Breadcrumbs from '../components/common/Breadcrumbs';
import BannerCarousel from '../components/BannerCarousel';

import classes from './Blog.module.css';

const Blog = ({ windowSize }) => {
 const { t } = useTranslation();

 useEffect(() => {
  document.title = t('seranoco') + '/' + t('blog');
 }, []);

 return (
  <section className={classes.home}>
   <BannerCarousel />
   <Header />
   <Body className={classes.body} parentClass={classes.body}>
    <Card>
     <Breadcrumbs
      linkDataProp={[
       { pathname: t('home'), url: ' ' },
       { pathname: t('blog'), url: 'blog' },
      ]}
     />
    </Card>
   </Body>
   <Guid />
   <Footer windowSize={windowSize} />
  </section>
 );
};

export default Blog;
