import React, { useEffect, useState } from 'react';
import { SwiperSlide, Swiper } from 'swiper/react';
import {
  Navigation,
  Pagination,
  Scrollbar,
  A11y,
  Thumbs,
  Autoplay,
} from 'swiper/modules';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Button } from '@mui/material';
import { Skeleton } from '@mui/material';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/thumbs';
import 'swiper/css/scrollbar';
import '../styles/carousel.css';
import { sliderContents } from '../services/api';

import shared from '../styles/shared.css';
import classes from './Caruosel.module.css';
const Carusel = ({ windowSize }) => {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isSmallSize, setIsSmallSize] = useState(false);
  const [swiperData, setSwiperData] = useState(null);

  const { t } = useTranslation();

  useEffect(() => {
    if (windowSize === 'xs' || windowSize === 's') {
      setIsSmallSize(true);
    } else {
      setIsSmallSize(false);
    }
  }, [windowSize]);

  const getImages = async () => {
    setSwiperData(null);
    const serverRes = await sliderContents();
    if (serverRes.response.ok) {
      setSwiperData(serverRes.result.data);
    }
  };

  useEffect(() => {
    getImages();
  }, []);

  return (
    <section>
      {swiperData ? (
        <div className={shared.content}>
          {/* ________________ BANNER SLIDER  ________________*/}
          <Swiper
            modules={[Autoplay]}
            className={classes.top_slider}
            spaceBetween={0}
            slidesPerView={1}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            loop={true}
          >
            {swiperData.map((slide, index) => (
              <SwiperSlide key={index} className={classes.slide}>
                <div className={classes.slider_image_wrapper}>
                  <span
                    className={classes.product_img_wrapper}
                    style={{
                      width: '100vw',
                      height: '100vh',
                    }}
                  >
                    <img
                      src={slide.image}
                      alt=''
                      style={{
                        width: '100vw',
                        height: '100vh',
                        objectFit: 'cover',
                      }}
                    />
                  </span>
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
            onSlideChange={swiper => {
              setActiveIndex(swiper.activeIndex);
            }}
            onSwiper={swiper => {
              setActiveIndex(swiper.activeIndex);
            }}
            thumbs={{
              swiper:
                thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null,
            }}
          >
            {swiperData.map((slide, index) => (
              <SwiperSlide key={index} className={classes.slide}>
                <div className={classes.slider_image_wrapper}>
                  <span className={classes.product_img_wrapper}>
                    <motion.img
                      className={classes.product_img}
                      src={slide.image_2}
                      alt=''
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{
                        scale: index === activeIndex ? 1 : 0,
                        opacity: index === activeIndex ? 1 : 0,
                      }}
                      transition={{ duration: 0.5, type: 'tween' }}
                    />
                  </span>
                  <img
                    src={slide.image}
                    alt={`Slide ${index + 1}`}
                    style={{ width: '100%', height: '100%' }}
                  />
                  {!isSmallSize && (
                    <span className={classes.about_product}>
                      <p className={classes.title}>{slide.title}</p>
                      <p className={classes.caption}>{slide.text}</p>
                      <Button className={classes.shop_btn} variant='outlined'>
                        {t('shop_now')}
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
              slidesPerView={swiperData.length < 5 ? swiperData.length : 5}
              onSwiper={setThumbsSwiper}
              watchSlidesProgress='true'
              modules={[Thumbs]}
              className={classes.thumbs_slider}
            >
              {swiperData.map((slide, index) => (
                <SwiperSlide key={index}>
                  {({ isActive }) => (
                    <motion.div
                      style={{
                        opacity: activeIndex === index ? 1 : 0.5,
                        transform:
                          activeIndex === index ? 'scale(1.2)' : 'scale(1)',
                        transition: 'transform 0.3s ease, opacity 0.3s ease',
                      }}
                      onClick={() => thumbsSwiper.slideTo(index)}
                      className={classes.thumb}
                      initial={{ scale: 0.9, y: 0 }}
                      animate={{
                        scale: index === activeIndex ? 1.15 : 0.9,
                      }}
                      transition={{ type: 'tween' }}
                    >
                      <motion.img
                        src={slide.thumbnail}
                        alt={`Thumbnail ${index + 1}`}
                        style={{ width: '100%', height: 'auto' }}
                        className={classes.thumb_img}
                      />
                    </motion.div>
                  )}
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      ) : (
        <Skeleton
          variant='rectangular'
          className={classes.skeleton_main}
          animation='wave'
        />
      )}
    </section>
  );
};

export default Carusel;
