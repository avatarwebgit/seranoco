import React from "react";

import Carousel from "../components/Carousel";
import Header from "../layout/Header";
import FilterLinks from "../components/FilterLinks";
import Footer from "../layout/Footer";
import PromotionalShopCard from "../components/PromotionalShopCard";
import Guid from "../components/Guid";

import classes from "./Home.module.css";
const Home = () => {
  return (
    <section className={classes.home}>
      <Header />
      <Carousel />
      <FilterLinks />
      <PromotionalShopCard />
      <Guid/>
      <Footer />
    </section>
  );
};

export default Home;
