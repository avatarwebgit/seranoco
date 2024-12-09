import React from "react";

import Carousel from "../components/Carousel";
import Header from "../layout/Header";

import classes from "./Home.module.css";
const Home = () => {
  return (
    <section className={classes.home}>
      <Header />
      <Carousel />
    </section>
  );
};

export default Home;
