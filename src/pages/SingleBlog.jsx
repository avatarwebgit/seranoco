import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getSingleArticles, useUser } from '../services/api';

import Header from '../layout/Header';
import Footer from '../layout/Footer';
import PromotionalShopCard from '../components/PromotionalShopCard';
import Body from '../components/filters_page/Body';
import Card from '../components/filters_page/Card';
import BannerCarousel from '../components/BannerCarousel';
import SecondaryPromotionShopCart from '../components/SecondaryPromotionShopCart';

import Breadcrumbs from '../components/common/Breadcrumbs';
import { useTranslation } from 'react-i18next';

import classes from './SingleBlog.module.css';
import { useParams } from 'react-router-dom';
const SingleBlog = ({ windowSize }) => {
 const [blogData, setblogData] = useState(null);
 const lng = useSelector(state => state.localeStore.lng);
 const { t } = useTranslation();
 const { alias } = useParams();

 const getArticle = async () => {
  const serverRes = await getSingleArticles(alias);
  setblogData(serverRes.result.data.article);
 };

 useEffect(() => {
  getArticle();
 }, [alias]);

 return (
  <section className={classes.home}>
   <BannerCarousel />
   <Header windowSize={windowSize} />
   {blogData && (
    <div dir={`${lng === 'fa' ? 'rtl' : 'ltr'}`}>
     <Body>
      <Card className={classes.card}>
       <Breadcrumbs
        linkDataProp={[
         { pathname: t('home'), url: ' ' },
         { pathname: t('blog'), url: 'blog' },
         { pathname: t('blog'), url: 'blog' },
        ]}
       />
       <div className={classes.top_wrapper}>
        <div className={classes.img_wrapper}>
         <img src={blogData.image} alt={blogData.alt} />
        </div>
        <div className={classes.close_caption}>
         <h2>{lng === 'fa' ? blogData.title : blogData.title_en}</h2>
         <p>
          {lng === 'fa'
           ? blogData.shortDescription
           : blogData.shortDescription_en}
         </p>
        </div>
       </div>

       <div
        className={classes.text}
        style={{ textAlign: lng === 'fa' ? 'right' : 'left' }}
        dangerouslySetInnerHTML={{
         __html: lng === 'fa' ? blogData.description : blogData.description_en,
        }}></div>
      </Card>
     </Body>
    </div>
   )}
   <Footer windowSize={windowSize} />
  </section>
 );
};

export default SingleBlog;
