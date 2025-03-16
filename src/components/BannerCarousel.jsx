import React, { useEffect, useState } from 'react';
import { Autoplay } from 'swiper/modules';
import { SwiperSlide, Swiper } from 'swiper/react';
import { getNarrowBanners } from '../services/api';

import classes from './BannerCarousel.module.css';
import { Skeleton } from '@mui/material';
const BannerCarousel = () => {
 const [swiperData, setSwiperData] = useState(null);

 useEffect(() => {
  getBanners();
 }, []);

 const getBanners = async () => {
  const serverRes = await getNarrowBanners();
  if (serverRes.response.ok) {
   setSwiperData(serverRes.result.data);
  }
 };

 return (
  <>
   {swiperData ? (
    <Swiper
     modules={[Autoplay]}
     className={classes.main}
     spaceBetween={0}
     slidesPerView={1}
     autoplay={{
      delay: 11000,
      disableOnInteraction: false,
      reverseDirection: true,
     }}
     loop={true}>
     {swiperData.map((slide, index) => (
      <SwiperSlide key={index} className={classes.slide}>
       <div className={classes.slider_image_wrapper}>
        <span
         className={classes.product_img_wrapper}
         style={{
          width: '100vw',
          height: '25px',
         }}>
         <img
          src={slide.image}
          alt=''
          loading='lazy'
          style={{
           width: '100vw',
           height: '25px',
           objectFit: 'cover',
          }}
         />
        </span>
       </div>
      </SwiperSlide>
     ))}
    </Swiper>
   ) : (
    <Skeleton
     sx={{ width: '100vw', height: '25px' }}
     animation='wave'
     variant='rectangular'
    />
   )}
  </>
 );
};

export default BannerCarousel;
