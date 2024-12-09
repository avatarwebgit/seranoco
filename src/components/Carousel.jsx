import React, { useState } from "react";
import { SwiperSlide, Swiper } from "swiper/react";
import {
  Navigation,
  Pagination,
  Scrollbar,
  A11y,
  Thumbs,
} from "swiper/modules";

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
const Carusel = () => {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const slides = [img, img, img, img];
  const thumbs = [shape1, shape2, shape3, shape4];
  const productImages = [gem, shape2, gem, shape4];

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
                  <img className={classes.product_img} src={productImages.at(index)} alt="" />
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
        {/* ________________ THUMB SLIDER  ________________*/}
        <div className={classes.thumbs_wrapper}>
          <Swiper
            spaceBetween={5}
            slidesPerView={5}
            onSwiper={setThumbsSwiper}
            watchSlidesProgress="true"
            modules={[Thumbs]}
            className={classes.thumbs_slider}
            centeredSlides={true}
          >
            {slides.map((slide, index) => (
              <SwiperSlide key={index}>
                {({ isActive }) => (
                  <div
                    style={{
                      opacity: activeIndex === index ? 1 : 0.5,
                      transform:
                        activeIndex === index ? "scale(1.2)" : "scale(1)",
                      transition: "transform 0.3s ease, opacity 0.3s ease",
                    }}
                    onClick={() => thumbsSwiper.slideTo(index)}
                    className={classes.thumb}
                  >
                    <img
                      src={thumbs[index]}
                      alt={`Thumbnail ${index + 1}`}
                      style={{ width: "100%", height: "auto" }}
                      className={classes.thumb_img}
                    />
                  </div>
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
