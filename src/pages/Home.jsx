import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

import Carousel from '../components/Carousel';
import Header from '../layout/Header';
import FilterLinks from '../components/FilterLinks';
import Footer from '../layout/Footer';
import PromotionalShopCard from '../components/PromotionalShopCard';
import Guid from '../components/Guid';

import classes from './Home.module.css';
import BannerCarousel from '../components/BannerCarousel';
import SecondaryPromotionShopCart from '../components/SecondaryPromotionShopCart';
import { useSelector } from 'react-redux';
import { useUser } from '../services/api';
const Home = ({ windowSize }) => {
  const token = useSelector(state => state.userStore.token);
  const { data, error, isLoading } = useUser(token);
  
  return (
    <section className={classes.home}>
      <BannerCarousel />
      <Header windowSize={windowSize} />
      <Carousel windowSize={windowSize} />
      <FilterLinks windowSize={windowSize} />
      <PromotionalShopCard windowSize={windowSize} />
      <SecondaryPromotionShopCart />
      <Guid windowSize={windowSize} />
      <Footer windowSize={windowSize} />
    </section>
  );
};

export default Home;
