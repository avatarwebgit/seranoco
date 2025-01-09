import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { Typography, IconButton } from '@mui/material';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Skeleton } from '@mui/material';
import { SwiperSlide, Swiper } from 'swiper/react';
import { nanoid } from '@reduxjs/toolkit';
import { FavoriteBorder } from '@mui/icons-material';
import { Navigation, Scrollbar, Thumbs } from 'swiper/modules';

import BannerCarousel from '../components/BannerCarousel';
import Body from '../components/filters_page/Body';
import Header from '../layout/Header';
import Footer from '../layout/Footer';
import Divider from '../components/products/Divider';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Card from '../components/filters_page/Card';
import CustomeTab from '../components/common/CustomTab';
import Breadcrumbs from '../components/common/Breadcrumbs';

import { ReactComponent as Heart } from '../assets/svg/heart.svg';

import { getProductDetails } from '../services/api';

import classes from './Products.module.css';

const Products = ({ windowSize }) => {
  const [params, setParams] = useSearchParams();

  const [zoomStyles, setZoomStyles] = useState({});
  const [detailsData, setDetailsData] = useState(null);
  const [isInViewbox, setIsInViewbox] = useState(false);
  const [quantity, setQuantity] = useState(0);
  const [totalWeight, setTotalWeight] = useState(0);

  const imageRef = useRef();

  const { t } = useTranslation();
  const lng = useSelector(state => state.localeStore.lng);

  const location = useLocation();

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
      const id = location.pathname.split('=').at(1);
      const serverRes = await getProductDetails(id);
      setDetailsData(serverRes.result);
    };
    getDetails();
  }, [params]);

  const handleIncrement = () => {
    if (quantity < detailsData.product.quantity) setQuantity(quantity + 1);
  };

  const handleDecrement = () => {
    if (quantity === 0) return;
    setQuantity(quantity - 1);
  };

  return (
    <div className={classes.main}>
      <BannerCarousel />
      <Header windowSize={windowSize} />(
      <Body>
        <Card className={classes.main_card}>
          {detailsData && (
            <Breadcrumbs
              linkDataProp={[
                { pathname: t('home'), url: ' ' },
                { pathname: t('shop_by_shape'), url: 'shopbyshape' },
                { pathname: detailsData.product?.name, url: null },
              ]}
            />
          )}
          <div className={classes.content}>
            <div
              className={classes.image_container}
              // onMouseMove={handleMouseMove}
              // onMouseLeave={handleMouseLeave}
            >
              <div className={classes.zoom_box} style={zoomStyles}>
                {detailsData ? (
                  <>
                    <img
                      ref={imageRef}
                      src={detailsData.product?.primary_image}
                      alt='Zoomable'
                      className={`${classes.zoom_image} ${
                        isInViewbox ? '' : classes.dn
                      }`}
                    />
                    <img
                      className={`${classes.idle_image} ${
                        !isInViewbox ? '' : classes.dn
                      }`}
                      src={detailsData.product?.primary_image}
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
            <div
              className={classes.info}
              style={{ direction: lng === 'fa' ? 'rtl' : 'ltr' }}
            >
              {detailsData ? (
                <Typography
                  className={classes.product_title}
                  color='inherit'
                  href={`/${lng}/shopbyshape`}
                  variant='h3'
                >
                  {detailsData?.product?.name}
                </Typography>
              ) : (
                <Skeleton
                  variant='text'
                  sx={{ width: '10rem' }}
                  animation='wave'
                  className={classes.product_title}
                />
              )}
              {detailsData ? (
                <Typography
                  className={classes.product_serial}
                  color='inherit'
                  href={`/${lng}/shopbyshape`}
                  variant='h3'
                >
                  {t('serial_number')}&nbsp;:&nbsp;
                  {detailsData && detailsData.product.product_code}
                </Typography>
              ) : (
                <Skeleton
                  variant='text'
                  sx={{ width: '10rem' }}
                  animation='wave'
                  className={classes.product_serial}
                />
              )}
              <div className={classes.price_wrapper}>
                {detailsData ? (
                  <>
                    <Typography
                      className={classes.product_price}
                      color='inherit'
                      href={`/${lng}/shopbyshape`}
                      variant='h3'
                    >
                      {t('price')}&nbsp;:&nbsp;
                    </Typography>
                    {detailsData.product.sale_price !==
                      detailsData.product.price && (
                      <p
                        className={classes.prev_price}
                        style={{
                          textDecoration: 'line-through',
                        }}
                      >
                        <p className={classes.off_text}>
                          {detailsData.product.percent_sale_price}%
                        </p>
                        €&nbsp;{detailsData && detailsData.product.sale_price}
                      </p>
                    )}
                    &nbsp;&nbsp;
                    <p className={classes.current_price}>
                      €&nbsp;{detailsData && detailsData.product.price}
                    </p>
                  </>
                ) : (
                  <Skeleton
                    variant='text'
                    sx={{ width: '10rem' }}
                    animation='wave'
                    className={classes.product_price}
                  />
                )}
              </div>
              {detailsData && (
                <>
                  <div className={classes.quantity_wrapper}>
                    {detailsData ? (
                      <Typography
                        className={classes.product_serial}
                        color='inherit'
                        href={`/${lng}/shopbyshape`}
                        variant='h3'
                      >
                        {t('quantity')}&nbsp;:&nbsp;
                      </Typography>
                    ) : (
                      <Skeleton
                        variant='text'
                        sx={{ width: '10rem' }}
                        animation='wave'
                        className={classes.product_serial}
                      />
                    )}
                    <div className={classes.quantity_actions_wrapper}>
                      <p className={classes.quantity_text}>{quantity}</p>
                      <span className={classes.btn_wrapper}>
                        <button
                          className={classes.quantity_a_b}
                          onClick={handleIncrement}
                        >
                          +
                        </button>
                        <button
                          className={classes.quantity_a_b}
                          onClick={handleDecrement}
                        >
                          -
                        </button>
                      </span>
                      <span className={classes.weight_wrapper}>
                        <p>{t('total_weight')}</p>&nbsp;
                        <p style={{ color: '#000000' }}>
                          :&nbsp;{+detailsData.product.weight * quantity}
                          &nbsp;ct
                        </p>
                      </span>
                    </div>
                    <button></button>
                  </div>

                  <IconButton className={classes.wish_list}>
                    <Heart width={15} height={15} />
                    <p>{t('add_to_favorite')}</p>
                  </IconButton>
                </>
              )}
              <span className={classes.divider} />
              {detailsData && (
                <div
                  className={classes.payment_wrapper}
                  style={{
                    alignItems: lng === 'fa' ? 'flex-end' : 'flex-start',
                  }}
                >
                  {lng !== 'fa' ? (
                    <span className={classes.payment_ct}>
                      <p className={classes.payment_title}>{t('payment')}:</p>
                      &nbsp;&nbsp;
                      <p className={classes.payment_value}>
                        {+detailsData.product.price * quantity}
                      </p>
                    </span>
                  ) : (
                    <span
                      className={classes.payment_ct}
                      style={{ direction: 'rtl' }}
                    >
                      <p className={classes.payment_title}>{t('payment')}:</p>
                      &nbsp;&nbsp;
                      <p className={classes.payment_value}>
                        {+detailsData.product.price * quantity}
                      </p>
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          {detailsData && <CustomeTab dataProp={detailsData} />}

          {/* <Divider title={t('related')} /> */}
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
          {/* <Divider title={t('views')} />        */}
        </Card>
      </Body>
      )
      <Footer />
    </div>
  );
};

export default Products;
