import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import Carousel from "../components/Carousel";
import FilterLinks from "../components/FilterLinks";
import Guid from "../components/Guid";
import PromotionalShopCard from "../components/PromotionalShopCard";
import Footer from "../layout/Footer";
import Header from "../layout/Header";

import BannerCarousel from "../components/BannerCarousel";
import SecondaryPromotionShopCart from "../components/SecondaryPromotionShopCart";
import { useUser } from "../services/api";
import { favoriteActions } from "../store/store";

import classes from "./Home.module.css";
const Home = ({ windowSize }) => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.userStore.token);
  const { data } = useUser(token);

  useEffect(() => {
    if (data) {
      dispatch(favoriteActions.setCount(data?.user?.FavoriteCount));
    }
  }, [data]);

  return (
    <section className={classes.home}>
      <BannerCarousel />
      <Header windowSize={windowSize} />
      <Carousel windowSize={windowSize} />
      <FilterLinks windowSize={windowSize} />
      <PromotionalShopCard />
      <SecondaryPromotionShopCart />
      <Guid windowSize={windowSize} showMore={true} isHomePage={true} />
      <Footer windowSize={windowSize} />
    </section>
  );
};

export default Home;
