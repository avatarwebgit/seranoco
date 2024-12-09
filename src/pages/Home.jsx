import React from "react";

import Carousel from "../components/Carousel";
import Header from "../layout/Header";

import classes from "./Home.module.css";
import FilterLinks from "../components/FilterLinks";
import Footer from "../layout/Footer";
const Home = () => {
  return (
    <section className={classes.home}>
      <Header />
      <Carousel />
      <FilterLinks />
      <Footer/>
    </section>
  );
};

export default Home;
