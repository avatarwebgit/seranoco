import React, {
 useCallback,
 useEffect,
 useMemo,
 useRef,
 useState,
} from 'react';
import BannerCarousel from '../components/BannerCarousel';
import { SwiperSlide, Swiper } from 'swiper/react';
import { useTranslation } from 'react-i18next';
import {
 FormControl,
 InputLabel,
 MenuItem,
 Pagination as PaginationComponent,
 Select,
 Typography,
} from '@mui/material';
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

import {
 getFilteredSizes,
 getProduct,
 useShapes,
 useColors,
 getProductsByShape,
 getProductDetailsWithId,
 getAllAtrributes,
} from '../services/api';
import ResultRow from '../components/filters_page/ResultRow';
import ResultMobile from '../components/filters_page/ResultMobile';
import { scrollToTarget } from '../utils/helperFunctions';
import TableGrid from '../components/common/TableGrid';
import Breadcrumbs from '../components/common/Breadcrumbs';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/thumbs';
import 'swiper/css/scrollbar';
import '../styles/carousel.css';

import classes from './FilterByShape.module.css';
const FilterByShape = ({ windowSize }) => {
 const { data: shapesData, isLoading: isLoadingShapes, isError } = useShapes();
 const { data: fetchedColorData, isLoading: isLoadingColors } = useColors();
 const [colorData, setColorData] = useState(null);
 const [sizeData, setSizeData] = useState([]);
 const [groupColors, setGroupColors] = useState([]);
 const [shapeFormEntries, setShapeFormEntries] = useState(46);
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
 const [currentActiveGroupColor, setCurrentActiveGroupColor] = useState(1);
 const [tableData, setTableData] = useState([]);
 const [selectedSizesObject, setSelectedSizesObject] = useState([]);
 const [chunkedData, setChunkedData] = useState([]);
 const [isLoadingSelectedItem, setIsLoadingSelectedItem] = useState(false);
 const [sortedColors, setSortedColors] = useState([]);
 const [sortedGroupColors, setSortedGroupColors] = useState([]);
 const [isTableDataLoading, setIsTableDataLoading] = useState(false);
 const [chunkSize, setChunkSize] = useState(9);
 const [allSizesData, setAllSizesData] = useState([]);

 const formRef = useRef();
 const sizeRef = useRef();
 const sliderRef = useRef();
 const gridSliderRef = useRef();
 const productsWrapperRef = useRef();
 const abortControllerRef = useRef(new AbortController());
 const dataAbortRef = useRef(new AbortController());

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
  setShapeFormEntries('');
  setDimensionEntries([]);
  setSelectedIds([]);
  setTableData([]);
  setChunkedData([]);
  setSizeData([]);
  dispatch(productDetailActions.reset());
  scrollToTarget(formRef, 200);
 };

 useEffect(() => {
  document.title = t('seranoco') + '/' + t('shop_by_shape');
  dispatch(productDetailActions.reset());
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

 const memoizedItemIds = useMemo(() => {
  return itemIds;
 }, [itemIds]);

 const memoizedTableData = useMemo(() => {
  return tableData;
 }, [tableData]);

 const memoizedChunkedData = useMemo(() => {
  return chunkedData;
 }, [chunkedData]);

 const memoizedShapeData = useMemo(() => {
  return shapesData?.sort((a, b) => a.priority - b.priority);
 }, [shapesData]);

 const handleShapeClick = async (e, id) => {
  setProductDetails([]);
  setChunkedData([]);
  setTableData([]);
  setIsLoading(true);
  try {
   //   const allProductsRes = await getPaginatedProductsByShape(
   //     id,
   //     page,
   //     ItemsPerPage,
   //   );
   //   if (allProductsRes.response.ok) {
   //     console.log(allProductsRes.result);
   //     setProductDetails(allProductsRes.result.data.products.data);
   //     setLastPage(allProductsRes.result.data.products.last_page);
   //     setPage(allProductsRes.result.data.products.current_page);
   //     console.log(allProductsRes.result);
   //   }
  } catch (error) {
   if (error.name !== 'AbortError') {
    console.error('Fetch error:', error);
   }
  } finally {
   setIsLoading(false);
  }
 };

 useEffect(() => {
  if (selectedIds.length > 0) {
   setChunkedData([]);
   setTableData([]);
  }
 }, [selectedIds]);

 const handleGetFilterProducts = async (
  shape_id = shapeFormEntries,
  size_ids = dimensionEntries,
  color_ids = selectedIds,
  page = 1,
  per_page = ItemsPerPage,
 ) => {
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
    // console.error('Fetch error:', error);
   }
  } finally {
   setIsFilteredProductsLoading(false);
  }
 };

 const prevDimensionEntriesRef = useRef(dimensionEntries);
 const prevSelectedIdsRef = useRef(selectedIds);

 const getInitialSizes = async (id, options) => {
  const serverRes = await getAllAtrributes(id, options);
  if (serverRes.response.ok) {
   setColorData(serverRes?.result.data.colors);
   setGroupColors(serverRes?.result.data.group_colors);
   setSizeData(serverRes?.result.data.sizes);
  }
 };

 useEffect(() => {
  if (shapeFormEntries) {
   dataAbortRef.current.abort();
   dataAbortRef.current = new AbortController();
   getInitialSizes(shapeFormEntries, {
    signal: dataAbortRef.current.signal,
   });
  }
 }, [shapeFormEntries]);

 useEffect(() => {
  abortControllerRef.current.abort();
  abortControllerRef.current = new AbortController();
  handleFetchTableData(shapeFormEntries, selectedIds, 1, 1000, {
   signal: abortControllerRef.current.signal,
  });
  const getSizes = async () => {
   const serverRes = await getFilteredSizes(selectedIds, shapeFormEntries, {});
   if (serverRes.response.ok) {
    setSizeData(serverRes.result.data.sizes);
   }
  };
  if (selectedIds.length > 0) {
   getSizes();
  } else {
   getInitialSizes(shapeFormEntries, {
    signal: dataAbortRef.current.signal,
   });
  }

  if (itemIds.length === 0) {
   if (
    JSON.stringify(dimensionEntries) !==
     JSON.stringify(prevDimensionEntriesRef.current) ||
    JSON.stringify(selectedIds) !== JSON.stringify(prevSelectedIdsRef.current)
   ) {
    prevDimensionEntriesRef.current = dimensionEntries;
    prevSelectedIdsRef.current = selectedIds;
   }
  }
 }, [selectedIds, shapeFormEntries]);

 useEffect(() => {
  setProductDetails([]);

  const getProductByDetail = async id => {
   try {
    const serverRes = await getProductDetailsWithId(id);
    if (serverRes.response.ok) {
     setProductDetails(prev => [...prev, serverRes.result.product]);
    }
   } catch (error) {}
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
   setChunkSize(4);
   setSlidesPerView(5);
  } else {
   setIsSmallPage(false);
   setSlidesPerView(9);
   setChunkSize(9);
  }
 }, [windowSize]);

 const handlePaginationChange = (e, value, itemsPerPage) => {
  handleGetFilterProducts(
   shapeFormEntries,
   Object.keys(dimensionEntries),
   selectedIds,
   value,
   itemsPerPage,
  );
  scrollToTarget(productsWrapperRef);
 };

 const handleFetchTableData = async (
  shpaId,
  colorIds,
  page,
  per_page,
  signal,
 ) => {
  abortControllerRef.current.abort();
  abortControllerRef.current = new AbortController();
  setIsTableDataLoading(true);
  try {
   const serverRes = await getProductsByShape(
    shpaId,
    colorIds,
    page,
    per_page,
    { signal: abortControllerRef.current.signal },
   );

   if (serverRes.response.ok) {
    setTableData(serverRes.result.data);
   }
  } catch (error) {
   // console.error('Error fetching products: ', error);
  } finally {
   setIsTableDataLoading(false);
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
  if (memoizedTableData) {
   const chunks = chunkData(memoizedTableData, chunkSize);
   setChunkedData(chunks);
  }
 }, [memoizedTableData]);

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
         { pathname: t('shop_by_shape'), url: 'shopbyshape' },
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
       {!shapeFormEntries && shapesData?.length > 0 && (
        <p className={classes.alert}>{t('select_shape')}</p>
       )}
       {isLoadingColors && <LoadingSpinner />}
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
            <p
             className={classes.color_name}
             style={{ textAlign: lng === 'en' ? 'left' : 'right' }}>
             {lng === 'en' ? slide.description : slide.description_fa}
            </p>
           </div>
          </SwiperSlide>
         ))}
       </Swiper>
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
     {sizeData?.length > 0 && sizeData && <Divider text={'Size mm'} />}
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
       {shapeFormEntries !== '' && (
        <button className={classes.reset_btn} onClick={handleResetSelections}>
         {t('reset_selections')}
        </button>
       )}
      </Card>
     )}
     <Card className={`${classes.table_wrapper}`}>
      {isTableDataLoading && <LoadingSpinner />}
      {chunkedData?.length > 1 && (
       <>
        <button className={classes.prev_btn} onClick={handlePrevGridSlider}>
         <ArrowBackIos />
        </button>
        <button className={classes.next_btn} onClick={handleNextGridSlider}>
         <ArrowForwardIos />
        </button>
       </>
      )}
      {tableData.length > 0 && (
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
        style={{
         width: '100%',
         display: 'flex',
         alignItems: 'center',
         justifyContent: 'center',
        }}>
        {memoizedChunkedData.map((el, i) => {
         return (
          <SwiperSlide key={i}>
           <TableGrid
            dataProp={el}
            sizeProp={sizeData}
            selectedSizeProp={selectedSizesObject}
            isLoadingData={isLoadingSelectedItem}
            isSmall={isSmallPage}
           />
          </SwiperSlide>
         );
        })}
       </Swiper>
      )}
     </Card>
     {shapeFormEntries && productDetails && (
      <Card
       className={classes.products_result_wrapper}
       ref={productsWrapperRef}>
       {lastPage > 1 &&
        productDetails.length > 0 &&
        !memoizedItemIds.length > 0 && (
         <div
          className={classes.pagination_wrapper}
          style={{
           alignSelf: lng === 'fa' ? 'flex-start' : 'flex-end',
           direction: lng === 'fa' ? 'rtl' : 'ltr',
           marginBottom: '2rem',
          }}>
          <InputLabel sx={{ fontSize: '.8rem' }} id='demo-simple-select-label'>
           {t('items_per_page')}
          </InputLabel>
          <FormControl>
           <Select
            labelId='demo-simple-select-label'
            id='demo-simple-select'
            value={ItemsPerPage}
            label='Age'
            onChange={e => {
             setItemsPerPage(e.target.value);
             handlePaginationChange(e, page, +e.target.value);
            }}
            sx={{
             borderRadius: '5px',
             '.MuiOutlinedInput-notchedOutline': {
              border: 'none',
             },
             '&:focus': { outline: 'none', boxShadow: 'none' },
            }}>
            <MenuItem value={5}>
             <Typography sx={{ fontSize: '.8rem' }}>&nbsp;5&nbsp;</Typography>
            </MenuItem>
            <MenuItem value={10}>
             <Typography sx={{ fontSize: '.8rem' }}>&nbsp; 10&nbsp;</Typography>
            </MenuItem>
            <MenuItem value={15}>
             <Typography sx={{ fontSize: '.8rem' }}>&nbsp; 15&nbsp;</Typography>
            </MenuItem>
            <MenuItem value={20}>
             <Typography sx={{ fontSize: '.8rem' }}>&nbsp; 20&nbsp;</Typography>
            </MenuItem>
           </Select>
          </FormControl>
         </div>
        )}

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
       {lastPage > 1 &&
        productDetails.length > 0 &&
        !memoizedItemIds.length > 0 && (
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
           onChange={e =>
            handlePaginationChange(e, e.target.value, ItemsPerPage)
           }
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
   }
   <Footer />
  </div>
 );
};

export default FilterByShape;
