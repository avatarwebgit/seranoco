import { useRef, useState } from 'react';
import 'swiper/css';
import { Autoplay, Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import Body from '../filters_page/Body';
import Card from '../filters_page/Card';

import classes from './Slider.module.css';

const Slider = ({
 title,
 items = [],
 slidesPerView,
 spaceBetween,
 sectionClassName = classes.section,
 contentClassName = classes.content,
 swiperClassName,
 navigation = true,
 centerSlides = false,
 autoplay = {
  delay: 5000,
  disableOnInteraction: false,
  reverseDirection: true,
 },
 loop = true,
 breakpoints = {
  320: {
   slidesPerView: 1,
   spaceBetween: 10,
  },
  640: {
   slidesPerView: 2,
   spaceBetween: 10,
  },
  768: {
   slidesPerView: slidesPerView,
   spaceBetween: 10,
  },
  1024: {
   slidesPerView: slidesPerView,
   spaceBetween: 10,
  },
 },
}) => {
 const swiperRef = useRef(null);
 const nextButtonRef = useRef(null);
 const prevButtonRef = useRef(null);

 const [activeIndex, setActiveIndex] = useState(0);

 const goNext = () => {
  if (swiperRef.current && swiperRef.current.swiper) {
   swiperRef.current.swiper.slideNext();
  }
 };

 const goPrev = () => {
  if (swiperRef.current && swiperRef.current.swiper) {
   swiperRef.current.swiper.slidePrev();
  }
 };

 return (
  <Body contentClassname={contentClassName} sectionClassname={sectionClassName}>
   <Card>
    <div className={classes['swiper-wrapper']}>
     <h2>{title}</h2>
     <Swiper
      spaceBetween={spaceBetween}
      slidesPerView={slidesPerView}
      modules={[Navigation, Autoplay]}
      className={swiperClassName}
      ref={swiperRef}
      centeredSlides={centerSlides}
      navigation={{
       nextEl: nextButtonRef.current,
       prevEl: prevButtonRef.current,
      }}
      onSlideChange={swiper => {
       setActiveIndex(swiper.realIndex);
      }}
      onSwiper={swiper => {
       setActiveIndex(swiper.realIndex);
      }}
      autoplay={autoplay}
      loop={loop}
      breakpoints={breakpoints}>
      {items.map((ItemComponent, index) => (
       <SwiperSlide key={index}>
        <div className={classes['swiper-slide-wrapper']}>
         {typeof ItemComponent === 'function' ? (
          <ItemComponent />
         ) : (
          ItemComponent
         )}
        </div>
       </SwiperSlide>
      ))}
     </Swiper>
    </div>
   </Card>
  </Body>
 );
};

export default Slider;
