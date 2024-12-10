import React from "react";

import Carousel from "../components/Carousel";
import Header from "../layout/Header";
import FilterLinks from "../components/FilterLinks";
import Footer from "../layout/Footer";
import PromotionalShopCard from "../components/PromotionalShopCard";
import Guid from "../components/Guid";

import classes from "./Home.module.css";
const Home = ({ windowSize }) => {
  console.log(windowSize);
  return (
    <section className={classes.home}>
      <Header windowSize={windowSize} />
      <Carousel windowSize={windowSize} />
      <FilterLinks windowSize={windowSize} />
      <PromotionalShopCard windowSize={windowSize} />
      <Guid windowSize={windowSize} />
      <Footer windowSize={windowSize} />
    </section>
  );
};

export default Home;
