import React, { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Breadcrumbs, Typography, Link } from '@mui/material';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Skeleton } from '@mui/material';
import { SwiperSlide, Swiper } from 'swiper/react';

import BannerCarousel from '../components/BannerCarousel';
import Body from '../components/filters_page/Body';
import Header from '../layout/Header';
import Footer from '../layout/Footer';
import Divider from '../components/products/Divider';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Card from '../components/filters_page/Card';
import CustomeTab from '../components/common/CustomTab';

import { getProductDetails } from '../services/api';

import classes from './Products.module.css';
import { Navigation, Scrollbar, Thumbs } from 'swiper/modules';
import { nanoid } from '@reduxjs/toolkit';
const Products = () => {
  const [params, setParams] = useSearchParams();

  const [zoomStyles, setZoomStyles] = useState({});
  const [detailsData, setDetailsData] = useState(null);
  const [isInViewbox, setIsInViewbox] = useState(false);

  const imageRef = useRef();

  const { t } = useTranslation();
  const lng = useSelector(state => state.localeStore.lng);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleMouseMove = e => {
    if (!detailsData) return;
    setIsInViewbox(true);
    const { left, top, width, height } =
      imageRef.current.getBoundingClientRect();

    const mouseX = e.clientX - left;
    const mouseY = e.clientY - top;

    const zoomX = (mouseX / width) * 100;
    const zoomY = (mouseY / height) * 100;

    setZoomStyles({
      transform: `scale(2)`,
      transformOrigin: `${zoomX}% ${zoomY}%`,
      transition: 'transform 0.1s ease-out',
    });
  };

  const handleMouseLeave = () => {
    if (!detailsData) return;
    setIsInViewbox(false);
    setZoomStyles({
      transform: `scale(1)`,
      transformOrigin: `center center`,
      transition: 'transform 0.25s ease-out',
    });
  };

  useEffect(() => {
    const getDetails = async () => {
      const serverRes = await getProductDetails(params.get('id'));
      setDetailsData(serverRes.result);
      console.log(serverRes.result);
    };
    getDetails();
  }, [params]);

  return (
    <div className={classes.main}>
      <BannerCarousel />
      <Header />(
      <Body>
        <Card className={classes.main_card}>
          <Breadcrumbs aria-label='breadcrumb' separator='>'>
            <Link underline='hover' color='inherit' href='/'>
              {t('home')}
            </Link>
            <Link
              underline='hover'
              color='inherit'
              href={`/${lng}/shopbyshape`}
            >
              {t('shop_by_shape')}
            </Link>
            {detailsData ? (
              <Typography color='inherit' href={`/${lng}/shopbyshape`}>
                {detailsData && detailsData.product.name}
              </Typography>
            ) : (
              <Skeleton
                variant='text'
                sx={{ width: '10rem' }}
                animation='wave'
              />
            )}
          </Breadcrumbs>
          {detailsData ? (
            <Typography
              className={classes.product_title}
              color='inherit'
              href={`/${lng}/shopbyshape`}
              variant='h3'
            >
              {detailsData && detailsData.product.name}
            </Typography>
          ) : (
            <Skeleton
              variant='text'
              sx={{ width: '10rem' }}
              animation='wave'
              className={classes.product_title}
            />
          )}

          <div className={classes.content}>
            <div
              className={classes.image_container}
              // onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              <div className={classes.zoom_box} style={zoomStyles}>
                {detailsData ? (
                  <>
                    <img
                      ref={imageRef}
                      src={detailsData.product.primary_image}
                      alt='Zoomable'
                      className={`${classes.zoom_image} ${
                        isInViewbox ? '' : classes.dn
                      }`}
                    />
                    <img
                      className={`${classes.idle_image} ${
                        !isInViewbox ? '' : classes.dn
                      }`}
                      src={detailsData.product.primary_image}
                      alt=''
                    />
                  </>
                ) : (
                  <Skeleton
                    className={`${classes.idle_image}`}
                    variant='rectangular'
                    animation='wave'
                  />
                )}
              </div>
              <div className={classes.tip_wrapper}>
                <p className={classes.tip_text}>{t('zoom_tip')}</p>
              </div>
            </div>

  
          </div>

          {detailsData && <CustomeTab dataProp={detailsData} />}

          <Divider title={t('related')} />
          {/* {detailsData ? (
            <Swiper
              modules={[Navigation, Scrollbar, Thumbs]}
              spaceBetween={0}
              slidesPerView={5}
              navigation
              loop={true}
            >
              {detailsData.related_products.map((el, i) => (
                <SwiperSlide
                  key={i}
                  style={{ backgroundColor: 'red' }}
                  className={classes.swiper_slide}
                >
                  <div className={classes.related_slide_wrapper}>
                    <span className={classes.related_img_wrapper}>
                      <img
                        src={el.primary_image}
                        alt=''
                        className={classes.related_img}
                      />
                    </span>
                    <span>
                      <p>{el.name}</p>
                    </span>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <Skeleton />
          )} */}
          <Divider title={t('views')} />       
        </Card>
      </Body>
      )
      <Footer />
    </div>
  );
};

export default Products;
