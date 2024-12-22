import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { SwiperSlide, Swiper } from 'swiper/react';
import { useSSR, useTranslation } from 'react-i18next';
import { Pagination as PaginationComponent } from '@mui/material';

import Header from '../layout/Header';
import Footer from '../layout/Footer';
import Body from '../components/filters_page/Body';
import CustomSelect from '../components/filters_page/CustomSelect';
import Card from '../components/filters_page/Card';
import LoadingSpinner from '../components/common/LoadingSpinner';
import SizeBox from '../components/filters_page/SizeBox';
import Divider from '../components/filters_page/Divider';

import {
  getShapes,
  getSizes,
  getColors,
  getProduct,
  useShapes,
  getPaginatedProductsByShape,
} from '../services/api';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/thumbs';
import 'swiper/css/scrollbar';
import '../styles/carousel.css';

import classes from './FilterByShape.module.css';
import { Navigation, Thumbs, Pagination } from 'swiper/modules';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import ResultRow from '../components/filters_page/ResultRow';
import ResultMobile from '../components/filters_page/ResultMobile';
import BannerCarousel from '../components/BannerCarousel';
import { nanoid } from '@reduxjs/toolkit';
const FilterByShape = ({ windowSize }) => {
  const { data: shapesData, loading, isError } = useShapes();
  const [detailData, setDetailData] = useState([]);
  const [sizeData, setSizeData] = useState([]);
  const [colorData, setColorData] = useState([]);
  const [groupColors, setGroupColors] = useState([]);
  const [shapeFormEntries, setShapeFormEntries] = useState([]);
  const [dimensionEntries, setDimensionEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [slidesPerView, setSlidesPerView] = useState(5);
  const [selectedIds, setSelectedIds] = useState([]);
  const [productDetails, setProductDetails] = useState([]);
  const [isSmallPage, setIsSmallPage] = useState(false);
  const [page, setPage] = useState(1);

  const formRef = useRef();
  const sizeRef = useRef();
  const sliderRef = useRef();

  const abortControllerRef = useRef(new AbortController());
  const { t } = useTranslation();

  const handlePrev = useCallback(() => {
    if (!sliderRef.current) return;
    sliderRef.current.swiper.slidePrev();
  }, []);

  const handleNext = useCallback(() => {
    if (!sliderRef.current) return;
    sliderRef.current.swiper.slideNext();
  }, []);

  const handleSendDimensionsStatus = e => {
    const form = sizeRef.current;
    const formData = new FormData(form);
    const formEntries = Object.fromEntries(formData.entries());
    setDimensionEntries(formEntries);
  };

  const handleThumbClick = groupId => {
    const firstMatchingSlideIndex = colorData.colors.findIndex(
      slide => slide.group_id === groupId,
    );

    if (sliderRef.current && firstMatchingSlideIndex !== -1) {
      sliderRef.current.swiper.slideTo(firstMatchingSlideIndex);
    }
  };
  const handleCheckboxChange = (e, slideId) => {
    if (e.target.checked) {
      setSelectedIds(prevIds => [...prevIds, slideId]);
    } else {
      setSelectedIds(prevIds => prevIds.filter(id => id !== slideId));
    }
  };

  //api call
  const handleShapeClick = async (e, id) => {
    e.preventDefault();
    abortControllerRef.current.abort();
    abortControllerRef.current = new AbortController();
    setColorData([]);
    setGroupColors([]);
    setSizeData([]);
    setIsLoading(true);
    try {
      const serverRes = await getSizes(id, {
        signal: abortControllerRef.current.signal,
      });
      getProducts(id, page, 10);

      if (serverRes.response.ok) {
        setDetailData(serverRes.result.data);
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Fetch error:', error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSizeClick = async (shape_id, size_ids) => {
    // abortControllerRef.current.abort();
    // abortControllerRef.current = new AbortController();
    // console.log(shape_id, size_ids);
    // setIsLoading(true);
    // try {
    //   const serverRes = await getColors(shape_id, size_ids, {
    //     signal: abortControllerRef.current.signal,
    //   });
    //   if (serverRes.response.ok) {
    //     setColorData(preData => serverRes.result.data);
    //   }
    // } catch (error) {
    //   if (error.name !== 'AbortError') {
    //     console.error('Fetch error:', error);
    //   }
    // } finally {
    //   setIsLoading(false);
    // }
  };

  const handleColorClick = async (shape_id, size_ids, color_ids) => {
    // abortControllerRef.current.abort();
    // abortControllerRef.current = new AbortController();
    // setIsLoading(true);
    // try {
    //   const serverRes = await getProduct(shape_id, size_ids, color_ids, {
    //     signal: abortControllerRef.current.signal,
    //   });
    //   if (serverRes.response.ok) {
    //     setProductDetails((prevData = []) => {
    //       const newItems = Array.isArray(serverRes.result.data)
    //         ? serverRes.result.data
    //         : [];
    //       const updatedData = prevData.filter(prevItem =>
    //         newItems.some(newItem => newItem.id === prevItem.id),
    //       );
    //       const filteredNewItems = newItems.filter(
    //         newItem => !prevData.some(prevItem => prevItem.id === newItem.id),
    //       );
    //       return [...updatedData, ...filteredNewItems];
    //     });
    //   }
    // } catch (error) {
    //   if (error.name !== 'AbortError') {
    //     console.error('Fetch error:', error);
    //   }
    // } finally {
    //   setIsLoading(false);
    // }
  };

  // useEffect(() => {
  //   if (Object.values(dimensionEntries).length > 0) {
  //     handleSizeClick(shapeFormEntries, Object.keys(dimensionEntries));
  //   }
  // }, [dimensionEntries]);

  // useEffect(() => {
  //   if (shapeFormEntries.length > 0) {
  //     handleColorClick(
  //       shapeFormEntries,
  //       Object.keys(dimensionEntries),
  //       selectedIds,
  //     );
  //   }
  // }, [selectedIds]);

  useEffect(() => {
    if (windowSize === 'xs' || windowSize === 's' || windowSize === 'm') {
      setIsSmallPage(true);
      setSlidesPerView(5);
    } else {
      setIsSmallPage(false);
      setSlidesPerView(13);
    }
  }, [windowSize]);

  useEffect(() => {
    if (detailData) {
      setColorData(detailData.colors);
      setSizeData(detailData.sizes);
      setGroupColors(detailData.group_colors);
    }
  }, [detailData]);

  const getProducts = async (id, page, per_page) => {
    const productsRes = await getPaginatedProductsByShape(id, page, per_page);
    if (productsRes.response.ok) {
      setProductDetails(productsRes.result.data.products.data);
    }
  };

  useEffect(() => {
    getProducts(shapeFormEntries, page, 10);
  }, [page]);

  const handlePaginationChange = (e, value) => {
    setPage(value);
    console.log(e, value);
  };

  return (
    <div className={classes.main}>
      <BannerCarousel />
      <Header windowSize={windowSize} />

      {shapesData && (
        <Body>
          {!isSmallPage && (
            <Divider text={'Shapes'} className={classes.divider_start} />
          )}
          <Card className={classes.multi_select_wrapper}>
            <form
              ref={formRef}
              // onClick={handleSendFormStatus}
              className={classes.grid_form}
            >
              {shapesData.map((elem, i) => {
                return (
                  <div key={nanoid()}>
                    {elem.image && (
                      <CustomSelect
                        title={`${i}`}
                        src={elem.image}
                        key={elem.id}
                        id={elem.id}
                        description={elem.description}
                        onClick={e => {
                          handleShapeClick(e, elem.id);
                          setShapeFormEntries(elem.id);
                        }}
                      />
                    )}
                  </div>
                );
              })}
            </form>
          </Card>

          {/* {Object.values(shapeFormEntries).at(0) && ( */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{
              opacity: shapeFormEntries ? 1 : 0,
              y: shapeFormEntries ? 0 : 10,
            }}
          >
            <Divider text={'Size mm'} />
            <Card className={classes.size_wrapper}>
              <form
                ref={sizeRef}
                onClick={handleSendDimensionsStatus}
                className={classes.grid_form}
              >
                {sizeData?.length > 0
                  ? sizeData.map((elem, i) => {
                      return (
                        <SizeBox
                          value={`${elem.description}`}
                          key={elem.id}
                          id={elem.id}
                        />
                      );
                    })
                  : !isLoading && (
                      <p className={classes.alert}>{t('noItem')}</p>
                    )}
              </form>
            </Card>
            {isLoading && <LoadingSpinner />}
          </motion.div>
          {/* )} */}

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{
              opacity: dimensionEntries ? 1 : 0,
              y: dimensionEntries ? 0 : 10,
            }}
          >
            <Divider text={'Colors'} />
            <Card className={classes.size_wrapper}>
              {isLoading && <LoadingSpinner />}
              {colorData?.length > 0 && (
                <>
                  <button className={classes.prev_btn} onClick={handlePrev}>
                    <ArrowBackIos />
                  </button>
                  <button className={classes.next_btn} onClick={handleNext}>
                    <ArrowForwardIos />
                  </button>
                </>
              )}

              <Swiper
                modules={[Navigation, Thumbs, Pagination]}
                className={classes.swiper}
                spaceBetween={isSmallPage ? 5 : 10}
                slidesPerView={slidesPerView}
                onSlideChange={swiper => {
                  setActiveIndex(swiper.activeIndex);
                }}
                onSwiper={swiper => {
                  setActiveIndex(swiper.activeIndex);
                }}
                thumbs={{
                  swiper:
                    thumbsSwiper && !thumbsSwiper.destroyed
                      ? thumbsSwiper
                      : null,
                }}
                ref={sliderRef}
                pagination={{
                  clickable: true,
                  dynamicBullets: true,
                  enabled: isSmallPage,
                }}
              >
                {colorData?.length > 0 &&
                  colorData
                    ?.sort((a, b) => a.group_id - b.group_id)
                    .map((slide, index) => (
                      <SwiperSlide key={index} className={classes.slide}>
                        <label
                          htmlFor={slide.id}
                          className={classes.color_slider_label}
                        >
                          <div className={classes.slider_image_wrapper}>
                            <img
                              src={slide.image}
                              alt=''
                              className={classes.slider_img}
                            />
                          </div>
                        </label>
                        <input
                          type='checkbox'
                          name={slide.id}
                          id={slide.id}
                          className={classes.slider_input}
                          onChange={e => handleCheckboxChange(e, slide.id)}
                        />
                        <p className={classes.color_name}>
                          {slide.description}
                        </p>
                      </SwiperSlide>
                    ))}
              </Swiper>

              <Swiper
                modules={[Navigation, Thumbs]}
                className={classes.swiper_thumb}
                spaceBetween={10}
                slidesPerView={slidesPerView}
                centerInsufficientSlides={true}
              >
                {groupColors?.length > 0 &&
                  groupColors
                    ?.sort((a, b) => a.id - b.id)
                    .map((slide, index) => (
                      <SwiperSlide key={index} className={classes.slide}>
                        <div className={classes.slider_thumb_wrapper}>
                          <img
                            src={slide.image}
                            alt=''
                            className={classes.slider_img}
                            onClick={() => handleThumbClick(slide.id)}
                          />
                        </div>
                      </SwiperSlide>
                    ))}
              </Swiper>
            </Card>
          </motion.div>
          <motion.div>
            <Card>
              {windowSize === 'm' ||
              windowSize === 'l' ||
              windowSize === 'xl' ? (
                <>
                  <ResultRow dataProp={productDetails} />
                </>
              ) : (
                <>
                  <ResultMobile dataProps={productDetails} />
                </>
              )}
            </Card>
            <PaginationComponent
              count={10}
              page={page}
              onChange={handlePaginationChange}
              
            />
          </motion.div>
        </Body>
      )}
      <Footer />
    </div>
  );
};

export default FilterByShape;
