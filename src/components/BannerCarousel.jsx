import React, { useEffect, useState } from 'react';
import { Autoplay } from 'swiper/modules';
import { SwiperSlide, Swiper } from 'swiper/react';
import { getNarrowBanners, sliderContents } from '../services/api';

import classes from './BannerCarousel.module.css';
const BannerCarousel = () => {
  const [swiperData, setSwiperData] = useState(null);
  const [scrollY, setScrollY] = useState(0);

  const getImages = async () => {
    setSwiperData(null);
    const serverRes = await sliderContents();
    if (serverRes.response.ok) {
      setSwiperData(serverRes.result.data);
    }
  };

  useEffect(() => {
    getImages();
    getBanners();
    window.addEventListener('load', () => setScrollY(window.scrollY));
    window.addEventListener('scroll', () => setScrollY(window.scrollY));

    return () => {
      window.removeEventListener('load', () => setScrollY(window.scrollY));
      window.removeEventListener('scroll', () => setScrollY(window.scrollY));
    };
  }, []);

  const getBanners = async () => {
    const serverRes = await getNarrowBanners();
    if (serverRes.response.ok) {
      setSwiperData(serverRes.result.data);
    }
  };

  return (
    <>
      {swiperData && (
        <Swiper
          modules={[Autoplay]}
          className={classes.main}
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
      )}
    </>
  );
};

export default BannerCarousel;
