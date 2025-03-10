import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

import Carousel from '../components/Carousel';
import Header from '../layout/Header';
import FilterLinks from '../components/FilterLinks';
import Footer from '../layout/Footer';
import PromotionalShopCard from '../components/PromotionalShopCard';
import Guid from '../components/Guid';

import BannerCarousel from '../components/BannerCarousel';
import SecondaryPromotionShopCart from '../components/SecondaryPromotionShopCart';

import classes from './Blog.module.css';
const Blog = ({ windowSize }) => {
  
  return (
    <section className={classes.home}>
      <BannerCarousel />
      <Header windowSize={windowSize} />
      <Guid></Guid>
      <Footer windowSize={windowSize} />
    </section>
  );
};

export default Blog;
