import React, { useEffect, useState } from "react";
import { SwiperSlide, Swiper } from "swiper/react";
import {
  Navigation,
  Pagination,
  Scrollbar,
  A11y,
  Thumbs,
} from "swiper/modules";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

import img from "../assets/images/SlideBack.png";
import gem from "../assets/images/Gem.png";
import shape1 from "../assets/images/Shape1.png";
import shape2 from "../assets/images/Shape2.png";
import shape3 from "../assets/images/Shape3.png";
import shape4 from "../assets/images/Shape4.png";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/thumbs";
import "swiper/css/scrollbar";
import "../styles/carousel.css";

import shared from "../styles/shared.css";
import classes from "./Caruosel.module.css";
import { Button } from "@mui/material";
const Carusel = ({ windowSize }) => {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isSmallSize, setIsSmallSize] = useState(false);

  const { t } = useTranslation();

  useEffect(() => {
    if (windowSize === "xs" || windowSize === "s") {
      setIsSmallSize(true);
    } else {
      setIsSmallSize(false);
    }
  }, [windowSize]);

  const slides = [img, img, img, img, img];
  const thumbs = [shape1, shape2, shape3, shape4, shape2];
  const productImages = [gem, shape2, gem, shape4, gem];

  const returnThumbStyles = (index) => {
    if (index !== activeIndex) {
      const x = activeIndex - index;
      return { y: index - 2 === activeIndex ? -((x ) * 5) : 0 };
    }
    if (index === activeIndex) {
      return { y: index === activeIndex ? 0 : 0 };
    }
  };

  return (
    <section>
      <div className={shared.content}>
        {/* ________________ BANNER SLIDER  ________________*/}
        <Swiper className={classes.top_slider}>
          {slides.map((slide, index) => (
            <SwiperSlide key={index} className={classes.slide}>
              <div className={classes.slider_image_wrapper}>
                <span className={classes.product_img_wrapper}>
                  <img src={productImages.at(index)} alt="" />
                </span>
                <img
                  src={slide}
                  alt={`Slide ${index + 1}`}
                  style={{ width: "100%", height: "100%" }}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        {/* ________________ MAIN SLIDER  ________________*/}
        <Swiper
          modules={[Navigation, Pagination, Scrollbar, A11y, Thumbs]}
          spaceBetween={0}
          slidesPerView={1}
          navigation
          onSlideChange={(swiper) => {
            setActiveIndex(swiper.activeIndex);
          }}
          onSwiper={(swiper) => {
            setActiveIndex(swiper.activeIndex);
          }}
          thumbs={{
            swiper:
              thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null,
          }}
        >
          {slides.map((slide, index) => (
            <SwiperSlide key={index} className={classes.slide}>
              <div className={classes.slider_image_wrapper}>
                <span className={classes.product_img_wrapper}>
                  <motion.img
                    className={classes.product_img}
                    src={productImages.at(index)}
                    alt=""
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{
                      scale: index === activeIndex ? 1 : 0,
                      opacity: index === activeIndex ? 1 : 0,
                    }}
                    transition={{ duration: 0.5, type: "tween" }}
                  />
                </span>
                <img
                  src={slide}
                  alt={`Slide ${index + 1}`}
                  style={{ width: "100%", height: "100%" }}
                />
                {!isSmallSize && (
                  <span className={classes.about_product}>
                    <p className={classes.title}>{t("title")}</p>
                    <p className={classes.caption}>{t("caption")}</p>
                    <Button className={classes.shop_btn} variant="outlined">
                      {t("shop_now")}
                    </Button>
                  </span>
                )}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        {/* ________________ THUMB SLIDER  ________________*/}
        <div className={classes.thumbs_wrapper}>
          <Swiper
            spaceBetween={0}
            slidesPerView={5}
            onSwiper={setThumbsSwiper}
            watchSlidesProgress="true"
            modules={[Thumbs]}
            className={classes.thumbs_slider}
            // centeredSlides
          >
            {slides.map((slide, index) => (
              <SwiperSlide key={index}>
                {({ isActive }) => (
                  <motion.div
                    style={{
                      opacity: activeIndex === index ? 1 : 0.5,
                      transform:
                        activeIndex === index ? "scale(1.2)" : "scale(1)",
                      transition: "transform 0.3s ease, opacity 0.3s ease",
                    }}
                    onClick={() => thumbsSwiper.slideTo(index)}
                    className={classes.thumb}
                    animate={returnThumbStyles(index)}
                  >
                    <motion.img
                      src={thumbs[index]}
                      alt={`Thumbnail ${index + 1}`}
                      style={{ width: "100%", height: "auto" }}
                      className={classes.thumb_img}
                    />
                  </motion.div>
                )}
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default Carusel;
