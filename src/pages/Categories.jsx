import React from 'react';

import Header from '../layout/Header';
import Footer from '../layout/Footer';
import PromotionalShopCard from '../components/PromotionalShopCard'
import Guid from '../components/Guid'

import classes from './Categories.module.css';
import FilterLinks from '../components/FilterLinks';
const Categories = () => {
  return (
    <section className={classes.main}>
      <Header />
      <FilterLinks />
      <PromotionalShopCard />
      <Guid/>
      <Footer />
    </section>
  );
};

export default Categories;
