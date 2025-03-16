import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import BannerCarousel from '../components/BannerCarousel';
import { SwiperSlide, Swiper } from 'swiper/react';
import { useTranslation } from 'react-i18next';
import { Pagination as PaginationComponent } from '@mui/material';
import { nanoid } from '@reduxjs/toolkit';
import { Navigation, Thumbs, Pagination } from 'swiper/modules';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';

import Header from '../layout/Header';
import Footer from '../layout/Footer';
import Body from '../components/filters_page/Body';
import CustomSelect from '../components/filters_page/CustomSelect';
import Card from '../components/filters_page/Card';
import LoadingSpinner from '../components/common/LoadingSpinner';
import SizeBox from '../components/filters_page/SizeBox';
import Divider from '../components/filters_page/Divider';

import { productDetailActions } from '../store/store';

import { getAllAtrributes, getProduct, useColors, getProductsByColor, getProductDetailsWithId, useFilteredShapes, getProductsByShape, getFilteredSizes } from '../services/api';
import ResultRow from '../components/filters_page/ResultRow';
import ResultMobile from '../components/filters_page/ResultMobile';
import Breadcrumbs from '../components/common/Breadcrumbs';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/thumbs';
import 'swiper/css/scrollbar';
import '../styles/carousel.css';
import { scrollToTarget } from '../utils/helperFunctions';
import TableGrid from '../components/common/TableGrid';
import classes from './FilterByColor.module.css';
const FilterByShape = ({ windowSize }) => {
 const { data: fetchedColorData, isLoading: isLoadingColors } = useColors();
 const [colorData, setColorData] = useState(null);
 const [sizeData, setSizeData] = useState([]);
 const [groupColors, setGroupColors] = useState([]);
 const [shapeFormEntries, setShapeFormEntries] = useState(46);
 const [dimensionEntries, setDimensionEntries] = useState([]);
 const [selectedIds, setSelectedIds] = useState([]);
 const { data: shapesData, isLoading: isLoadingShapes, isError, refetch: refetchShapes } = useFilteredShapes(selectedIds);
 const [isLoading, setIsLoading] = useState(false);
 const [thumbsSwiper, setThumbsSwiper] = useState(null);
 const [activeIndex, setActiveIndex] = useState(0);
 const [slidesPerView, setSlidesPerView] = useState(5);
 const [productDetails, setProductDetails] = useState([]);
 const [isSmallPage, setIsSmallPage] = useState(false);
 const [page, setPage] = useState(1);
 const [lastPage, setLastPage] = useState(null);
 const [isFilteredProductsLoading, setIsFilteredProductsLoading] = useState(false);
 const [ItemsPerPage, setItemsPerPage] = useState(9);
 const [currentActiveGroupColor, setCurrentActiveGroupColor] = useState(0);
 const [tableData, setTableData] = useState([]);
 const [selectedSizesObject, setSelectedSizesObject] = useState([]);
 const [chunkedData, setChunkedData] = useState([]);
 const [isLoadingSelectedItem, setIsLoadingSelectedItem] = useState(false);
 const [sortedColors, setSortedColors] = useState([]);
 const [sortedGroupColors, setSortedGroupColors] = useState([]);

 const formRef = useRef();
 const sizeRef = useRef();
 const sliderRef = useRef();
 const gridSliderRef = useRef();
 const productsWrapperRef = useRef();
 const abortControllerRef = useRef(new AbortController());

 const { t } = useTranslation();

 const dispatch = useDispatch();

 const lng = useSelector(state => state.localeStore.lng);

 const itemIds = useSelector(state => state.detailsStore.itemIds);

 const handlePrev = useCallback(() => {
  if (!sliderRef.current) return;
  sliderRef.current.swiper.slidePrev();
 }, []);

 const handleNext = useCallback(() => {
  if (!sliderRef.current) return;
  sliderRef.current.swiper.slideNext();
 }, []);

 const handlePrevGridSlider = useCallback(() => {
  if (!gridSliderRef.current) return;
  gridSliderRef.current.swiper.slidePrev();
 }, []);

 const handleNextGridSlider = useCallback(() => {
  if (!gridSliderRef.current) return;
  gridSliderRef.current.swiper.slideNext();
 }, []);

 const handleSendDimensionsStatus = (e, elem) => {
  const form = sizeRef.current;
  const formData = new FormData(form);
  const formEntries = Object.fromEntries(formData.entries());
  setDimensionEntries(formEntries);
  if (e.target.checked) {
   setSelectedSizesObject(prev => [...prev, elem]);
  } else {
   setSelectedSizesObject(prev => prev.filter(item => item.id !== elem.id));
  }
 };

 const handleThumbClick = groupId => {
  setCurrentActiveGroupColor(groupId);
  const firstMatchingSlideIndex = colorData.findIndex(slide => slide.group_id === groupId);

  if (sliderRef.current && firstMatchingSlideIndex !== -1) {
   sliderRef.current.swiper.slideTo(firstMatchingSlideIndex);
  }
 };

 const handleResetSelections = () => {
  setShapeFormEntries([]);
  setDimensionEntries([]);
  setSelectedIds([]);
  setSizeData([]);
  dispatch(productDetailActions.reset());
  setTableData([]);
  setChunkedData([]);
  scrollToTarget(formRef, 1000);
 };

 const handleCheckboxChange = (e, slideId) => {
  if (e.target.checked) {
   setSelectedIds(prevIds => [...prevIds, slideId]);
  } else {
   setSelectedIds(prevIds => prevIds.filter(id => id !== slideId));
  }
 };

 useEffect(() => {
  document.title = 'Seranoco - Shop By Color';
  handleShapeClick('', 46);
  if (itemIds.length > 0) {
   dispatch(productDetailActions.reset());
  }
  return () => {
   abortControllerRef.current.abort();
  };
 }, []);

 //api call
 useEffect(() => {
  if (fetchedColorData) {
   setColorData(fetchedColorData?.data.colors);
   setGroupColors(fetchedColorData?.data.group_colors);
  }
 }, [fetchedColorData]);

 useEffect(() => {
  if (colorData && groupColors) {
   const sortedGroupColorsP = groupColors.sort((a, b) => a.priority - b.priority);
   setSortedGroupColors(sortedGroupColorsP);
   setSortedColors(
    colorData.sort((a, b) => {
     const groupA = sortedGroupColorsP.find(group => group.id === a.group_id);
     const groupB = sortedGroupColorsP.find(group => group.id === b.group_id);

     if (groupA.priority === groupB.priority) {
      return a.priority - b.priority;
     }

     return groupA.priority - groupB.priority;
    }),
   );
  }
 }, [groupColors, colorData]);

 const memoizedItemIds = useMemo(() => {
  return itemIds;
 }, [itemIds]);

 const memoizedTableData = useMemo(() => {
  return tableData;
 }, [tableData]);

 const memoizedChunkedData = useMemo(() => {
  return chunkedData;
 }, [chunkedData]);

 const handleShapeClick = async (e, id) => {
  abortControllerRef.current.abort();
  abortControllerRef.current = new AbortController();
  setProductDetails([]);
  setTableData([]);
  setSizeData([]);
  setIsFilteredProductsLoading(true);
  setIsLoading(true);
  
 };

 useEffect(() => {
  refetchShapes();
  const getSizes = async () => {
   try {
    const serverRes = await getFilteredSizes(selectedIds, shapeFormEntries||46, {});
    if (serverRes.response.ok) {
     setSizeData(serverRes.result.data.sizes);
    }
   } catch (error) {
    if (error.name !== 'AbortError') {
    }
   } finally {
    setIsFilteredProductsLoading(false);
    setIsLoading(false);
   }

  };
  if (selectedIds.length > 0) {
   setChunkedData([]);
   setTableData([]);
   getSizes();
  }
 }, [selectedIds, shapeFormEntries]);

 const handleGetFilterProducts = async (shape_id = shapeFormEntries, size_ids = dimensionEntries, color_ids = selectedIds, page = 1, per_page = ItemsPerPage) => {
  abortControllerRef.current.abort();
  abortControllerRef.current = new AbortController();
  setIsFilteredProductsLoading(true);
  try {
   const serverRes = await getProduct(shape_id, size_ids, color_ids, page, per_page, {
    signal: abortControllerRef.current.signal,
   });
   if (serverRes.response.ok) {
    setLastPage(serverRes.result.data.last_page);
    setPage(serverRes.result.data.current_page);
    setProductDetails((prevData = []) => {
     const newItems = Array.isArray(serverRes.result.data.data) ? serverRes.result.data.data : [];
     const updatedData = prevData.filter(prevItem => newItems.some(newItem => newItem.id === prevItem.id));
     const filteredNewItems = newItems.filter(newItem => !prevData.some(prevItem => prevItem.id === newItem.id));
     return [...updatedData, ...filteredNewItems];
    });
   }
  } catch (error) {
   if (error.name !== 'AbortError') {
   }
  } finally {
   setIsFilteredProductsLoading(false);
  }
 };

 const prevDimensionEntriesRef = useRef(dimensionEntries);
 const prevSelectedIdsRef = useRef(selectedIds);

 useEffect(() => {
  abortControllerRef.current.abort();
  abortControllerRef.current = new AbortController();
  handleFetchTableData(shapeFormEntries, selectedIds, 1, 1000, {
   signal: abortControllerRef.current.signal,
  });
  if (itemIds.length === 0) {
   if (JSON.stringify(dimensionEntries) !== JSON.stringify(prevDimensionEntriesRef.current) || JSON.stringify(selectedIds) !== JSON.stringify(prevSelectedIdsRef.current)) {
   
    prevDimensionEntriesRef.current = dimensionEntries;
    prevSelectedIdsRef.current = selectedIds;
   }
  }
 }, [dimensionEntries, selectedIds, shapeFormEntries]);

 useEffect(() => {
  setProductDetails([]);

  const getProductByDetail = async id => {
   try {
    const serverRes = await getProductDetailsWithId(id);
    if (serverRes.response.ok) {
     setProductDetails(prev => [...prev, serverRes.result.product]);
    }
   } catch (error) {
   }
  };

  if (memoizedItemIds && memoizedItemIds.length > 0) {
   setIsLoadingSelectedItem(true);
   const fetchProductDetails = async () => {
    try {
     await Promise.all(memoizedItemIds.map(id => getProductByDetail(id)));
    } catch (error) {
    } finally {
     setIsLoadingSelectedItem(false);
    }
   };

   fetchProductDetails();
  }
 }, [memoizedItemIds]);

 useEffect(() => {
  if (windowSize === 'xs' || windowSize === 's' || windowSize === 'm') {
   setIsSmallPage(true);
   setSlidesPerView(5);
  } else {
   setIsSmallPage(false);
   setSlidesPerView(9);
  }
 }, [windowSize]);

 const handlePaginationChange = (e, value) => {
  handleGetFilterProducts(shapeFormEntries, Object.keys(dimensionEntries), selectedIds, value, ItemsPerPage);
  scrollToTarget(productsWrapperRef);
 };

 const handleFetchTableData = async (shpaId, colorIds, page, per_page) => {
  abortControllerRef.current.abort();
  abortControllerRef.current = new AbortController();
  try {
   const serverRes = await getProductsByShape(shpaId, colorIds, page, per_page, { signal: abortControllerRef.current.signal });

   if (serverRes.response.ok) {
    setTableData(serverRes.result.data);
   }
  } catch (error) {
  }
 };

 const chunkData = (data, size) => {
  const result = [];
  for (let i = 0; i < data.length; i += size) {
   result.push(data.slice(i, i + size));
  }
  return result;
 };

 useEffect(() => {
  if (memoizedTableData.length > 0) {
   const chunks = chunkData(memoizedTableData, 9);
   setChunkedData(chunks);
  }
 }, [memoizedTableData]);

 return (
  <div className={classes.main}>
   <BannerCarousel />
   <Header windowSize={windowSize} />

   {colorData && (
    <Body>
     {
      <Card className={`${classes.size_wrapper} ${classes.colors_wrapper}`}>
       <Breadcrumbs
        linkDataProp={[
         { pathname: t('home'), url: ' ' },
         { pathname: t('shop_by_color'), url: 'shopbyshape' },
        ]}
       />
       {isLoadingColors && <LoadingSpinner />}
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
        spaceBetween={isSmallPage ? 5 : 9}
        slidesPerView={slidesPerView}
        onSlideChange={swiper => {
         setActiveIndex(swiper.activeIndex);
        }}
        onSwiper={swiper => {
         setActiveIndex(swiper.activeIndex);
        }}
        thumbs={{
         swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null,
        }}
        ref={sliderRef}
        pagination={{
         clickable: true,
         dynamicBullets: true,
         enabled: isSmallPage,
        }}>
        {colorData?.length > 0 &&
         sortedColors.map((slide, index) => (
          <SwiperSlide key={index} className={classes.slide}>
           <div>
            <label htmlFor={slide.id} className={`${classes.color_slider_label} `}>
             <div className={classes.slider_image_wrapper}>
              <img src={slide.image} alt='' className={classes.slider_img} loading='lazy' />
             </div>
            </label>
            <input type='checkbox' name={slide.id} id={slide.id} className={classes.slider_input} checked={selectedIds.includes(slide.id)} onChange={e => handleCheckboxChange(e, slide.id)} />
            <p className={classes.color_name}>{slide.description}</p>
           </div>
          </SwiperSlide>
         ))}
       </Swiper>
       <div className={classes.thumbnail_container}>
        {groupColors?.length > 0 &&
         sortedGroupColors.map((slide, index) => {
          return (
           <div key={nanoid()} className={`${classes.thumbnail} ${currentActiveGroupColor === slide.id && classes.thumbnail_active}`}>
            <div className={classes.slider_thumb_wrapper}>
             <img src={slide.image} className={classes.slider_thumb_img} alt='' onClick={() => handleThumbClick(slide.id)} loading='lazy' />
            </div>
           </div>
          );
         })}
       </div>
       {selectedIds?.length === 0 && <p className={classes.alert}>{t('select_color')}</p>}
      </Card>
     }
     {selectedIds?.length > 0 && <Divider text={t('shape')} />}

     {Object.values(selectedIds).length > 0 && (
      <Card className={classes.multi_select_wrapper}>
       {isLoadingShapes && <LoadingSpinner />}

       <form ref={formRef} className={classes.grid_form}>
        {shapesData &&
         shapesData
          .sort((a, b) => a.priority - b.priority)
          .map((elem, i) => {
           console.log(elem);
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
               isSelected={shapeFormEntries || 46}
              />
             )}
            </div>
           );
          })}
       </form>
      </Card>
     )}

     {selectedIds?.length > 0 && <Divider text={'Size mm'} />}

     {selectedIds.length > 0 && (
      <Card className={classes.size_wrapper}>
       <form ref={sizeRef} className={classes.grid_form}>
        {sizeData?.length > 0 &&
         sizeData.map((elem, i) => {
          return (
           <SizeBox
            value={`${elem.description}`}
            key={elem.id}
            id={elem.id}
            onClick={e => {
             handleSendDimensionsStatus(e, elem);
            }}
           />
          );
         })}
       </form>
       {(sizeData?.length > 0 || colorData?.length > 0) && (
        <button className={classes.reset_btn} onClick={handleResetSelections}>
         {t('reset_selections')}
        </button>
       )}
      </Card>
     )}
     <Card className={`${classes.size_wrapper}`}>
      {isLoadingColors && <LoadingSpinner />}
      {selectedIds.length > 0 && chunkedData?.length > 1 && (
       <>
        <button className={classes.prev_btn} onClick={handlePrevGridSlider}>
         <ArrowBackIos />
        </button>
        <button className={classes.next_btn} onClick={handleNextGridSlider}>
         <ArrowForwardIos />
        </button>
       </>
      )}
      {selectedIds.length > 0 && tableData.length > 0 && (
       <Swiper
        spaceBetween={isSmallPage ? 5 : 9}
        slidesPerView={1}
        modules={[Navigation, Thumbs, Pagination]}
        thumbs={{
         swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null,
        }}
        ref={gridSliderRef}
        pagination={{
         clickable: true,
         dynamicBullets: true,
         enabled: isSmallPage,
        }}
        style={{ width: '90%' }}>
        {memoizedChunkedData.map((el, i) => {
         return (
          <SwiperSlide>
           <TableGrid dataProp={el} sizeProp={sizeData} selectedSizeProp={selectedSizesObject} key={i} isLoadingData={isLoadingSelectedItem} />
          </SwiperSlide>
         );
        })}
       </Swiper>
      )}
     </Card>
     {selectedIds.length > 0 && (
      <Card className={classes.products_result_wrapper} ref={productsWrapperRef}>
       {windowSize === 'm' || windowSize === 'l' || windowSize === 'xl' ? (
        <>
         <ResultRow dataProp={productDetails} />
        </>
       ) : (
        <>
         <ResultMobile
          dataProps={productDetails}
         />
        </>
       )}
       {isFilteredProductsLoading && <LoadingSpinner />}
       {lastPage > 1 && productDetails.length > 0 && itemIds.length === 0 && (
        <div
         className={classes.pagination_wrapper}
         style={{
          alignSelf: lng === 'fa' ? 'flex-start' : 'flex-end',
          direction: lng === 'fa' ? 'rtl' : 'ltr',
         }}>
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
     )}
    </Body>
   )}
   <Footer />
  </div>
 );
};

export default FilterByShape;
