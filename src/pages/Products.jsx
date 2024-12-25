import React, { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Breadcrumbs, Typography, Link } from '@mui/material';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import BannerCarousel from '../components/BannerCarousel';
import Body from '../components/filters_page/Body';
import Header from '../layout/Header';
import Footer from '../layout/Footer';
import Divider from '../components/products/Divider';

import Card from '../components/filters_page/Card';

import classes from './Products.module.css';
import data from '../assets/data/test.json';
import { getProductDetails } from '../services/api';

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
    };
    getDetails();
  }, [params]);

  return (
    <div className={classes.main}>
      <BannerCarousel />
      <Header />
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
            <Typography sx={{ color: 'text.primary' }} variant='caption'>
              {detailsData && detailsData.result.product.name}
            </Typography>
          </Breadcrumbs>

          <div className={classes.content}>
            <div
              className={classes.image_container}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              <div className={classes.zoom_box} style={zoomStyles}>
                <img
                  ref={imageRef}
                  src={data.primary_image}
                  alt='Zoomable'
                  className={`${classes.zoom_image} ${
                    isInViewbox ? '' : classes.dn
                  }`}
                />
                <img
                  className={`${classes.idle_image} ${
                    !isInViewbox ? '' : classes.dn
                  }`}
                  src={data.primary_image}
                  alt=''
                />
              </div>
              <div className={classes.tip_wrapper}>
                <p className={classes.tip_text}>{t('zoom_tip')}</p>
              </div>
            </div>
            <div
              className={classes.detail_container}
              style={{ direction: lng === 'fa' ? 'rtl' : 'ltr' }}
            >
              <span>
                <p>{t('type')}</p>
                <p>test</p>
              </span>
              <span>
                <p>{t('shape')}</p>
                <p>test</p>
              </span>
              <span>
                <p>{t('size')}</p>
                <p>test</p>
              </span>
              <span>
                <p>{t('color')}</p>
                <p>test</p>
              </span>
              <span>
                <p>{t('quality')}</p>
                <p>test</p>
              </span>
              <span>
                <p>{t('cut')}</p>
                <p>test</p>
              </span>
              <span>
                <p>{t('sold_by')}</p>
                <p>test</p>
              </span>
            </div>
          </div>

          <Divider title={t('related')} />
          <Divider title={t('views')} />
          <Divider title={t('specifications')} />
        </Card>
      </Body>
      <Footer />
    </div>
  );
};

export default Products;
