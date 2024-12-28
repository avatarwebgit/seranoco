import React, { useCallback, useEffect, useRef, useState } from 'react';
import classes from './FilterByShape.module.css';
import BannerCarousel from '../components/BannerCarousel';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { SwiperSlide, Swiper } from 'swiper/react';
import { useTranslation } from 'react-i18next';
import { Pagination as PaginationComponent } from '@mui/material';
import { nanoid } from '@reduxjs/toolkit';
import { Navigation, Thumbs, Pagination } from 'swiper/modules';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';

import Header from '../layout/Header';
import Footer from '../layout/Footer';
import Body from '../components/filters_page/Body';
import CustomSelect from '../components/filters_page/CustomSelect';
import Card from '../components/filters_page/Card';
import LoadingSpinner from '../components/common/LoadingSpinner';
import SizeBox from '../components/filters_page/SizeBox';
import Divider from '../components/filters_page/Divider';

import { getAllAtrributes, getProduct, useShapes } from '../services/api';
import ResultRow from '../components/filters_page/ResultRow';
import ResultMobile from '../components/filters_page/ResultMobile';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/thumbs';
import 'swiper/css/scrollbar';
import '../styles/carousel.css';
import { scrollToTarget } from '../utils/helperFunctions';
const FilterByShape = ({ windowSize }) => {
  const { data: shapesData, isLoading: isLoadingShapes, isError } = useShapes();
  const [detailData, setDetailData] = useState([]);
  const [sizeData, setSizeData] = useState([]);
  const [colorData, setColorData] = useState([]);
  const [groupColors, setGroupColors] = useState([]);
  const [shapeFormEntries, setShapeFormEntries] = useState([]);
  const [dimensionEntries, setDimensionEntries] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [slidesPerView, setSlidesPerView] = useState(5);
  const [productDetails, setProductDetails] = useState([]);
  const [isSmallPage, setIsSmallPage] = useState(false);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(null);
  const [isFilteredProductsLoading, setIsFilteredProductsLoading] =
    useState(false);
  const [ItemsPerPage, setItemsPerPage] = useState(10);

  const formRef = useRef();
  const sizeRef = useRef();
  const sliderRef = useRef();
  const productsWrapperRef = useRef();

  const abortControllerRef = useRef(new AbortController());
  const { t } = useTranslation();

  const lng = useSelector(state => state.localeStore.lng);

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
    const firstMatchingSlideIndex = colorData.findIndex(
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

  useEffect(() => {
    return () => {
      abortControllerRef.current.abort();
    };
  }, []);

  //api call
  const handleShapeClick = async (e, id) => {
    e.preventDefault();
    abortControllerRef.current.abort();
    abortControllerRef.current = new AbortController();
    setColorData([]);
    setGroupColors([]);
    setSizeData([]);
    setProductDetails([]);
    setIsFilteredProductsLoading(true);
    setIsLoading(true);
    try {
      const serverRes = await getAllAtrributes(id, {
        signal: abortControllerRef.current.signal,
      });
      getProducts(id, [], [], 1, ItemsPerPage);
      if (serverRes.response.ok) {
        setDetailData(serverRes.result.data);
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Fetch error:', error);
      }
    } finally {
      setIsFilteredProductsLoading(false);
      setIsLoading(false);
    }
  };

  const handleGetFilterProducts = async (
    shape_id = shapeFormEntries,
    size_ids = dimensionEntries,
    color_ids = selectedIds,
    page = 1,
    per_page = ItemsPerPage,
  ) => {
    abortControllerRef.current.abort();
    abortControllerRef.current = new AbortController();
    setIsFilteredProductsLoading(true);
    try {
      const serverRes = await getProduct(
        shape_id,
        size_ids,
        color_ids,
        page,
        per_page,
        {
          signal: abortControllerRef.current.signal,
        },
      );
      if (serverRes.response.ok) {
        setLastPage(serverRes.result.data.last_page);
        setPage(serverRes.result.data.current_page);
        setProductDetails((prevData = []) => {
          const newItems = Array.isArray(serverRes.result.data.data)
            ? serverRes.result.data.data
            : [];
          const updatedData = prevData.filter(prevItem =>
            newItems.some(newItem => newItem.id === prevItem.id),
          );
          const filteredNewItems = newItems.filter(
            newItem => !prevData.some(prevItem => prevItem.id === newItem.id),
          );
          return [...updatedData, ...filteredNewItems];
        });
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Fetch error:', error);
      }
    } finally {
      setIsFilteredProductsLoading(false);
    }
  };

  const prevDimensionEntriesRef = useRef(dimensionEntries);
  const prevSelectedIdsRef = useRef(selectedIds);

  useEffect(() => {
    if (
      JSON.stringify(dimensionEntries) !==
        JSON.stringify(prevDimensionEntriesRef.current) ||
      JSON.stringify(selectedIds) !== JSON.stringify(prevSelectedIdsRef.current)
    ) {
      handleGetFilterProducts(
        shapeFormEntries,
        Object.keys(dimensionEntries),
        selectedIds,
      );
    }
    prevDimensionEntriesRef.current = dimensionEntries;
    prevSelectedIdsRef.current = selectedIds;
  }, [dimensionEntries, selectedIds, shapeFormEntries]);

  useEffect(() => {
    if (windowSize === 'xs' || windowSize === 's' || windowSize === 'm') {
      setIsSmallPage(true);
      setSlidesPerView(5);
    } else {
      setIsSmallPage(false);
      setSlidesPerView(10);
    }
  }, [windowSize]);

  useEffect(() => {
    if (detailData) {
      console.log(detailData.colors);
      setColorData(detailData.colors);
      setSizeData(detailData.sizes);
      setGroupColors(detailData.group_colors);
      console.log(detailData);
    }
  }, [detailData]);

  const getProducts = async (shapeId, sizeIds, colorIds, page, per_page) => {
    const productsRes = await getProduct(
      shapeId,
      sizeIds,
      colorIds,
      page,
      per_page,
    );
    if (productsRes.response.ok) {
      setProductDetails(productsRes.result.data.data);
      setLastPage(productsRes.result.data.last_page);
      setPage(productsRes.result.data.current_page);
    }
  };

  const handlePaginationChange = (e, value) => {
    handleGetFilterProducts(
      shapeFormEntries,
      Object.keys(dimensionEntries),
      selectedIds,
      value,
      ItemsPerPage,
    );
    scrollToTarget(productsWrapperRef);
  };

  const handleResetSelections = () => {
    setShapeFormEntries([]);
    setDimensionEntries([]);
    setSelectedIds([]);
    setSizeData([]);
    setColorData([]);
    setGroupColors([]);
    setProductDetails([]);
  };

  return (
    <div className={classes.main}>
      <BannerCarousel />
      <Header windowSize={windowSize} />
      {shapesData && (
        <Body>
          <Card className={classes.multi_select_wrapper}>
            {isLoadingShapes && <LoadingSpinner />}

            <form ref={formRef} className={classes.grid_form}>
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
                        isSelected={shapeFormEntries}
                      />
                    )}
                  </div>
                );
              })}
            </form>
          </Card>
          <Divider text={'Size mm'} />
          <Card className={classes.size_wrapper}>
            {isLoading && <LoadingSpinner />}
            <form ref={sizeRef} className={classes.grid_form}>
              {sizeData?.length > 0 &&
                sizeData.map((elem, i) => {
                  return (
                    <SizeBox
                      value={`${elem.description}`}
                      key={elem.id}
                      id={elem.id}
                      onClick={handleSendDimensionsStatus}
                    />
                  );
                })}
              {sizeData?.length === 0 && !isLoading && (
                <p className={classes.alert}>{t('noItem')}</p>
              )}
              {shapeFormEntries?.length === 0 && (
                <p className={classes.alert}>{t('select_shape')}</p>
              )}
            </form>
          </Card>
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
                  thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null,
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
                      <div>
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
                      </div>
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
                  .map((slide, index) => {
                    return (
                      <SwiperSlide key={index} className={classes.slide}>
                        <div className={classes.slider_thumb_wrapper}>
                          <img
                            src={slide.image}
                            className={classes.slider_thumb_img}
                            alt=''
                            onClick={() => handleThumbClick(slide.id)}
                          />
                        </div>
                      </SwiperSlide>
                    );
                  })}
            </Swiper>
            {(sizeData?.length > 0 || colorData?.length > 0) && (
              <button
                className={classes.reset_btn}
                onClick={handleResetSelections}
              >
                {t('reset_selections')}
              </button>
            )}
          </Card>
          <Card
            className={classes.products_result_wrapper}
            ref={productsWrapperRef}
          >
            {windowSize === 'm' || windowSize === 'l' || windowSize === 'xl' ? (
              <>
                <ResultRow dataProp={productDetails} />
              </>
            ) : (
              <>
                <ResultMobile
                  dataProps={productDetails}
                  // isLoading={true}
                />
              </>
            )}
            {isFilteredProductsLoading && <LoadingSpinner />}
            {lastPage > 1 && productDetails.length > 0 && (
              <div
                className={classes.pagination_wrapper}
                style={{
                  alignSelf: lng === 'fa' ? 'flex-start' : 'flex-end',
                  direction: lng === 'fa' ? 'rtl' : 'ltr',
                }}
              >
                <p className={classes.pagination_text}>{t('page')} :</p>
                <PaginationComponent
                  count={lastPage}
                  page={page}
                  onChange={handlePaginationChange}
                  hideNextButton
                  hidePrevButton
                  variant='text'
                  className={classes.pagination_component}
                  size='small'
                  sx={{
                    '& .MuiPaginationItem-root': {
                      fontSize: '0.7rem',
                    },
                  }}
                />
              </div>
            )}
          </Card>
        </Body>
      )}
      <Footer />
    </div>
  );
};

export default FilterByShape;
