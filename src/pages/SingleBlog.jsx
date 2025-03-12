import React from 'react';
import { useSelector } from 'react-redux';
import { useUser } from '../services/api';

import Header from '../layout/Header';
import Footer from '../layout/Footer';
import PromotionalShopCard from '../components/PromotionalShopCard';
import Body from '../components/filters_page/Body';
import Card from '../components/filters_page/Card';
import BannerCarousel from '../components/BannerCarousel';
import SecondaryPromotionShopCart from '../components/SecondaryPromotionShopCart';

import classes from './SingleBlog.module.css';

const SingleBlog = ({ windowSize }) => {
 const lng = useSelector(state => state.localeStore.lng);

 return (
  <section className={classes.home}>
   <BannerCarousel />
   <Header windowSize={windowSize} />
   <div dir={`${lng === 'fa' ? 'rtl' : 'ltr'}`}>
    <Body>
     <Card className={classes.card}>
      <div className={classes.top_wrapper}>
       <div className={classes.img_wrapper}>
        <img
         src='https://images.pexels.com/photos/6757423/pexels-photo-6757423.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
         alt=''
        />
       </div>
       <div className={classes.close_caption}>
        <h2>text</h2>
        <p>
         Lorem ipsum dolor sit amet consectetur adipisicing elit. Quam, autem.
        </p>
       </div>
      </div>

      <p
       className={classes.text}
       style={{ textAlign: lng === 'fa' ? 'right' : 'left' }}>
       Lorem ipsum dolor sit amet consectetur adipisicing elit. Soluta, exercitationem! Omnis veniam eligendi sed similique a, molestiae quidem saepe magnam praesentium optio distinctio commodi tenetur in aperiam beatae assumenda ex?Lorem ipsum dolor sit amet consectetur adipisicing elit. Pariatur, laborum qui nostrum eos commodi illo quas fugit accusantium rem dignissimos!
      </p>
     </Card>
    </Body>
   </div>
   <Footer windowSize={windowSize} />
  </section>
 );
};

export default SingleBlog;
