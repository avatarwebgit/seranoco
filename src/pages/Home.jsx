import React, { useEffect } from 'react';

import Carousel from '../components/Carousel';
import Header from '../layout/Header';
import FilterLinks from '../components/FilterLinks';
import Footer from '../layout/Footer';
import PromotionalShopCard from '../components/PromotionalShopCard';
import Guid from '../components/Guid';

import classes from './Home.module.css';
import BannerCarousel from '../components/BannerCarousel';
import SecondaryPromotionShopCart from '../components/SecondaryPromotionShopCart';
import { useDispatch, useSelector } from 'react-redux';
import { useUser } from '../services/api';
import { favoriteActions } from '../store/store';
const Home = ({ windowSize }) => {
 const dispatch = useDispatch();
 const token = useSelector(state => state.userStore.token);
 const { data, error, isLoading } = useUser(token);

 useEffect(() => {
  if (data) {
   dispatch(favoriteActions.setCount(data.user.FavoriteCount));
  }
 }, [data]);

 return (
  <section className={classes.home}>
   <BannerCarousel />
   <Header windowSize={windowSize} />
   <Carousel windowSize={windowSize} />
   <FilterLinks windowSize={windowSize} />
   <PromotionalShopCard windowSize={windowSize} />
   <SecondaryPromotionShopCart />
   <Guid windowSize={windowSize} showMore={true} isHomePage={true} />
   <Footer windowSize={windowSize} />
  </section>
 );
};

export default Home;
