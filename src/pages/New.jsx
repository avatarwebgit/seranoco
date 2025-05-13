import React, {
 useCallback,
 useEffect,
 useMemo,
 useRef,
 useState,
} from 'react';
import { SwiperSlide, Swiper } from 'swiper/react';
import { useTranslation } from 'react-i18next';

import { Navigation, Thumbs, Pagination } from 'swiper/modules';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';

import BannerCarousel from '../components/BannerCarousel';
import Header from '../layout/Header';
import Footer from '../layout/Footer';
import Body from '../components/filters_page/Body';
import CustomSelect from '../components/filters_page/CustomSelect';
import Card from '../components/filters_page/Card';
import LoadingSpinner from '../components/common/LoadingSpinner';
import SizeBox from '../components/filters_page/SizeBox';
import Divider from '../components/filters_page/Divider';

import { productDetailActions } from '../store/store';

import {
 getNewFilteredSizesByColor,
 getAllAtrributes,
 getAllNewProducts,
 basicInformation,
 useNewShapes,
 getNewColors,
} from '../services/api';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/thumbs';
import 'swiper/css/scrollbar';
import '../styles/carousel.css';

import classes from './New.module.css';
import Breadcrumbs from '../components/common/Breadcrumbs';
import Product from '../components/new/Product';
import { scrollToTarget } from '../utils/helperFunctions';
const New = ({ windowSize }) => {
 const {
  data: shapesData,
  isLoading: isLoadingShapes,
  isError,
 } = useNewShapes();
 const [colorData, setColorData] = useState([]);
 const [sizeData, setSizeData] = useState([]);
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
 const [page, setPage] = useState(3);
 const [isFilteredProductsLoading, setIsFilteredProductsLoading] =
  useState(false);
 const [ItemsPerPage, setItemsPerPage] = useState(24);
 const [currentActiveGroupColor, setCurrentActiveGroupColor] = useState(1);
 const [selectedSizesObject, setSelectedSizesObject] = useState([]);
 const [sortedColors, setSortedColors] = useState([]);
 const [sortedGroupColors, setSortedGroupColors] = useState([]);
 const [filteresProducts, setfilteresProducts] = useState(null);
 const [isIntersecting, setIsIntersecting] = useState(false);
 const [euro_price, setEuro_price] = useState(0);

 const formRef = useRef();
 const sizeRef = useRef();
 const sliderRef = useRef();
 const abortControllerRef = useRef(new AbortController());
 const dataAbortRef = useRef(new AbortController());
 const lineRef = useRef();

 const { t } = useTranslation();

 const dispatch = useDispatch();

 const lng = useSelector(state => state.localeStore.lng);

 const handlePrev = useCallback(() => {
  if (!sliderRef.current) return;
  sliderRef.current.swiper.slidePrev();
 }, []);

 const handleNext = useCallback(() => {
  if (!sliderRef.current) return;
  sliderRef.current.swiper.slideNext();
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
  const firstMatchingSlideIndex = colorData.findIndex(
   slide => slide.group_id === groupId,
  );

  if (sliderRef.current && firstMatchingSlideIndex !== -1) {
   sliderRef.current.swiper.slideTo(firstMatchingSlideIndex);
  }
 };

 const handleCheckboxChange = (e, slideId, slide) => {
  if (e.target.checked) {
   setSelectedIds(prevIds => [...prevIds, slideId]);
  } else {
   setSelectedIds(prevIds => prevIds.filter(id => id !== slideId));
  }
 };

 const handleResetSelections = () => {
  setShapeFormEntries([]);
  setDimensionEntries([]);
  setSelectedIds([]);
  dispatch(productDetailActions.reset());
  setProductDetails([]);
  setColorData([]);
  setGroupColors([]);
  setSizeData([]);
  scrollToTarget(formRef, 1000);
  setPage(1);
 };

 useEffect(() => {
  dispatch(productDetailActions.reset());
  handleShapeClick('', '');
  document.title = t('new');
  getInfo();
 }, []);

 //api call
 useEffect(() => {
  if (colorData && groupColors) {
   const sortedGroupColorsP = groupColors.sort(
    (a, b) => a.priority - b.priority,
   );
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

 const memoizedShapeData = useMemo(() => {
  return shapesData;
 }, [shapesData]);

 const handleShapeClick = async (e, id) => {
  handleResetSelections();

  try {
   const productColorRes = await getNewColors(id, []);
   const serverRes = await getAllAtrributes(id);

   if (serverRes.response.ok) {
    setColorData(productColorRes?.result.data.colors);
    setGroupColors(productColorRes?.result.data.group_colors);
    setSizeData(serverRes?.result.data.sizes);
   }
  } catch (error) {
   //
  } finally {
   setIsLoading(false);
  }
 };

 useEffect(() => {
  setProductDetails([]);
  handleGetNewProducts(shapeFormEntries, selectedIds, [], 1, ItemsPerPage);
  const getSizes = async () => {
   const serverRes = await getNewFilteredSizesByColor(selectedIds);
   if (serverRes.response.ok) {
    setSizeData(serverRes.result.data.sizes);
   }
  };
  if (selectedIds.length > 0) {
   getSizes();
  }
 }, [selectedIds]);

 const handleGetNewProducts = async (
  shape_id = shapeFormEntries,
  size_ids = dimensionEntries,
  color_ids = selectedIds,
  pagee = page,
  per_page = ItemsPerPage,
 ) => {
  setIsFilteredProductsLoading(true);

  if (abortControllerRef.current) {
   abortControllerRef.current.abort();
  }
  abortControllerRef.current = new AbortController();

  try {
   const serverRes = await getAllNewProducts(
    shape_id,
    size_ids,
    color_ids,
    pagee,
    per_page,
    abortControllerRef.current.signal,
   );

   if (serverRes.response.ok) {
    if (pagee === 1) {
     setProductDetails(serverRes.result.data);
    } else {
     setProductDetails(prev => [...prev, ...serverRes.result.data]);
    }
   }
  } catch (error) {
   if (error.name !== 'AbortError') {
    // ... (error handling)
   }
  } finally {
   setIsFilteredProductsLoading(false);
  }
 };
 useEffect(() => {}, [productDetails]);

 const prevDimensionEntriesRef = useRef(dimensionEntries);
 const prevSelectedIdsRef = useRef(selectedIds);

 // useEffect(() => {
 //   // abortControllerRef.current.abort();
 //   // abortControllerRef.current = new AbortController();

 //   if (itemIds.length === 0) {
 //     if (
 //       JSON.stringify(dimensionEntries) !==
 //         JSON.stringify(prevDimensionEntriesRef.current) ||
 //       JSON.stringify(selectedIds) !==
 //         JSON.stringify(prevSelectedIdsRef.current)
 //     ) {
 //       setProductDetails([]);
 //       handleGetNewProducts(
 //         shapeFormEntries,
 //         selectedIds,
 //         [],
 //         page,
 //         ItemsPerPage,
 //       );
 //       prevDimensionEntriesRef.current = dimensionEntries;
 //       prevSelectedIdsRef.current = selectedIds;
 //     }
 //   }
 //
 // }, [selectedIds, shapeFormEntries]);

 useEffect(() => {
  if (selectedSizesObject.length === 0) {
   return setfilteresProducts(null);
  }

  let sizes = [];
  selectedSizesObject.map(el => {
   sizes.push(el.description);
  });

  if (sizes.length > 0) {
   const filteredProducts = productDetails.filter(item =>
    sizes.includes(item.product.size),
   );
   setfilteresProducts(filteredProducts);
  }
 }, [selectedSizesObject]);

 useEffect(() => {
  if (windowSize === 'xs' || windowSize === 's' || windowSize === 'm') {
   setIsSmallPage(true);
   setSlidesPerView(5);
  } else {
   setIsSmallPage(false);
   setSlidesPerView(9);
  }
 }, [windowSize]);

 useEffect(() => {
  if (isFilteredProductsLoading) return;
  const observer = new IntersectionObserver(
   entries => {
    setIsIntersecting(entries[0].isIntersecting);
   },
   {
    threshold: 0,
    rootMargin: '0px',
   },
  );

  if (lineRef.current) {
   observer.observe(lineRef.current);
  }

  return () => {
   if (lineRef.current) {
    observer.unobserve(lineRef.current);
   }
  };
 }, [lineRef]);

 useEffect(() => {
  if (isIntersecting && !isFilteredProductsLoading) {
   handleGetNewProducts(shapeFormEntries, selectedIds, [], +page, ItemsPerPage);
   setPage(prev => prev + 1);
  }
 }, [isIntersecting]);

 const getInfo = async () => {
  const serverRes = await basicInformation(lng);
  if (serverRes.response.ok) {
   setEuro_price(serverRes?.result.data.at(0).price_euro);
  }
 };

 return (
  <div className={classes.main}>
   <BannerCarousel />
   <Header windowSize={windowSize} />

   {
    <Body>
     {
      <Card
       className={`${classes.multi_select_wrapper} ${classes.colors_wrapper}`}>
       <Breadcrumbs
        linkDataProp={[
         { pathname: t('home'), url: ' ' },
         { pathname: t('new'), url: 'shopbyshape' },
        ]}
       />
       {isLoadingShapes && <LoadingSpinner />}
       <form ref={formRef} className={classes.grid_form}>
        {memoizedShapeData &&
         memoizedShapeData.map((elem, i) => {
          return (
           <div key={elem.id}>
            {elem.image && (
             <CustomSelect
              title={`${i}`}
              src={elem.image}
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
     }
     {shapeFormEntries && <Divider text={'Colors'} />}
     {
      <Card className={`${classes.size_wrapper} ${classes.colors_wrapper}`}>
       {!shapeFormEntries && (
        <p className={classes.alert}>{t('select_shape')}</p>
       )}
       {isLoading && <LoadingSpinner />}
       {colorData?.length > 9 && shapeFormEntries && (
        <>
         <button className={classes.prev_btn} onClick={handlePrev}>
          <ArrowBackIos />
         </button>
         <button className={classes.next_btn} onClick={handleNext}>
          <ArrowForwardIos />
         </button>
        </>
       )}
       {colorData.length > 0 && (
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
          shapeFormEntries &&
          sortedColors.map((slide, index) => (
           <SwiperSlide key={index} className={classes.slide}>
            <div>
             <label
              htmlFor={slide.id}
              className={`${classes.color_slider_label} `}>
              <div className={classes.slider_image_wrapper}>
               <img
                src={slide.image}
                alt=''
                className={classes.slider_img}
                loading='lazy'
               />
              </div>
             </label>
             <input
              type='checkbox'
              name={slide.id}
              id={slide.id}
              className={classes.slider_input}
              checked={selectedIds.includes(slide.id)}
              onChange={e => handleCheckboxChange(e, slide.id, slide)}
             />
             <p className={classes.color_name}>{slide.description}</p>
            </div>
           </SwiperSlide>
          ))}
        </Swiper>
       )}
       <div className={classes.thumbnail_container}>
        {groupColors?.length > 0 &&
         shapeFormEntries &&
         sortedGroupColors.map((slide, index) => {
          return (
           <>
            <div
             key={index}
             className={`${classes.thumbnail} ${
              currentActiveGroupColor === slide.id && classes.thumbnail_active
             }`}>
             <div className={classes.slider_thumb_wrapper}>
              <img
               src={slide.image}
               className={classes.slider_thumb_img}
               alt=''
               onClick={() => handleThumbClick(slide.id)}
               loading='lazy'
              />
             </div>
            </div>
           </>
          );
         })}
       </div>
      </Card>
     }
     {shapeFormEntries !== '' && <Divider text={'Size mm'} />}
     {isLoading && <LoadingSpinner />}
     {shapeFormEntries && (
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
       {(shapeFormEntries.length > 0 ||
        colorData?.length > 0 ||
        productDetails.length > 0) && (
        <button className={classes.reset_btn} onClick={handleResetSelections}>
         {t('reset_selections')}
        </button>
       )}
      </Card>
     )}
     <>
      {selectedSizesObject.length === 0
       ? productDetails && (
          <Card className={classes.product_wrapper}>
           {productDetails.map(el => {
            return (
             <Product
              dataProps={el}
              key={el.variation_id}
              up={euro_price}
              newItem={true}
             />
            );
           })}
          </Card>
         )
       : filteresProducts && (
          <Card className={classes.product_wrapper}>
           {filteresProducts.map(el => {
            return (
             <Product dataProps={el} key={el.variation_id} up={euro_price} />
            );
           })}
          </Card>
         )}
     </>
    </Body>
   }
   {
    <div style={{ opacity: isFilteredProductsLoading ? 1 : 0 }}>
     <LoadingSpinner />
    </div>
   }
   <div ref={lineRef} className={classes.observer_watch}></div>
   <Footer />
  </div>
 );
};

export default New;
