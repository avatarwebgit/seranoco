import { Button, IconButton, Skeleton, Typography } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom';
import { Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import BannerCarousel from '../components/BannerCarousel';
import Breadcrumbs from '../components/common/Breadcrumbs';
import CustomeTab from '../components/common/CustomTab';
import Body from '../components/filters_page/Body';
import Card from '../components/filters_page/Card';
import Footer from '../layout/Footer';
import Header from '../layout/Header';
import {
 accesModalActions,
 cartActions,
 drawerActions,
 favoriteActions,
} from '../store/store';
import { formatNumber, notify } from '../utils/helperFunctions';

import { ReactComponent as Shop } from '../assets/svg/add_basket.svg';
import { ReactComponent as Heart } from '../assets/svg/heart.svg';
import { ReactComponent as HeartRed } from '../assets/svg/heart_red.svg';

import {
 addToFavorite,
 getProductDetails,
 getProductDetailsWithId,
 removeFromFavorite,
 sendShoppingCart,
} from '../services/api';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import 'swiper/css/thumbs';

import classes from './Products.module.css';
const Products = ({ windowSize }) => {
 const { id, variation } = useParams();

 const [zoomStyles, setZoomStyles] = useState({});
 const [detailsData, setDetailsData] = useState(null);
 const [isInViewbox, setIsInViewbox] = useState(false);
 const [quantity, setQuantity] = useState(1);
 const [isFavorite, setIsFavorite] = useState(false);
 const [shape, setShape] = useState('');
 const [cuttingStyle, setCuttingStyle] = useState('');
 const [brand, setBrand] = useState('');
 const [details, setDetails] = useState('');
 const [color, setColor] = useState('');
 const [size, setSize] = useState('');
 const [height, setHeight] = useState(0);
 const [isByOrder, setIsByOrder] = useState(false);
 const [variationDetail, setVariationDetail] = useState(null);
 const [productImages, setProductImages] = useState(null);
 const [productData, setProductData] = useState(null);
 const [allImages, setAllImages] = useState([]);
 const [mainImage, setMainImage] = useState('');
 const [isMoreThanQuantity, setIsMoreThanQuantity] = useState(false);

 const imageRef = useRef();
 const primaryImg = useRef();

 const { t } = useTranslation();
 const lng = useSelector(state => state.localeStore.lng);
 const token = useSelector(state => state.userStore.token);
 const favorites = useSelector(state => state.favoriteStore.products);
 const favoritesCount = useSelector(state => state.favoriteStore.count);
 const euro = useSelector(state => state.cartStore.euro);

 const location = useLocation();
 const dispatch = useDispatch();

 useEffect(() => {
  window.scrollTo(0, 0);
 }, []);

 const handleMouseMove = e => {
  if (!detailsData) return;
  setIsInViewbox(true);
  const { left, top, width, height } = imageRef.current.getBoundingClientRect();

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
   const serverRes = await getProductDetails(id, token);
   const variationRes = await getProductDetailsWithId(variation, token);
   if (variationRes.response.ok) {
    setVariationDetail(variationRes.result);
    if (variationRes.result.product.variation.quantity === 0) {
     setIsByOrder(true);
    }
    setHeight(variationRes.result.product.variation.height);
    setSize(variationRes?.result?.product?.size);
   }
   if (serverRes.response.ok) {
    setMainImage(serverRes.result.product.primary_image);
    setProductImages(serverRes.result.product.images);
    setDetailsData(serverRes.result);
    setProductData(serverRes);

    if (lng === 'fa') {
     setShape(
      serverRes.result.product_attributes.find(
       attr => attr.attribute.name === 'Shape',
      )?.value.name_fa,
     );
     setColor(
      serverRes.result.product_attributes.find(
       attr => attr.attribute.name === 'Color',
      )?.value.name_fa,
     );
     setBrand(
      serverRes.result.product_attributes.find(
       attr => attr.attribute.name === 'Brand/Mine',
      )?.value.name_fa,
     );
     setCuttingStyle(
      serverRes.result.product_attributes.find(
       attr => attr.attribute.name === 'Cutting Style',
      )?.value.name_fa,
     );

     setDetails(
      serverRes.result.product_attributes.find(
       attr => attr.attribute.name === 'Details',
      )?.value.name_fa,
     );
    } else {
     setShape(
      serverRes.result.product_attributes.find(
       attr => attr.attribute.name === 'Shape',
      )?.value.name,
     );
     setColor(
      serverRes.result.product_attributes.find(
       attr => attr.attribute.name === 'Color',
      )?.value.name,
     );
     setBrand(
      serverRes.result.product_attributes.find(
       attr => attr.attribute.name === 'Brand/Mine',
      )?.value.name,
     );
     setCuttingStyle(
      serverRes.result.product_attributes.find(
       attr => attr.attribute.name === 'Cutting Style',
      )?.value.name,
     );
     setDetails(
      serverRes.result.product_attributes.find(
       attr => attr.attribute.name === 'Details',
      )?.value.name,
     );
    }
   }
  };
  getDetails();
 }, [id, lng]);

 useEffect(() => {
  if (primaryImg && productImages) {
   setAllImages([mainImage, ...productImages]);
  }
 }, [mainImage, productImages]);

 const handleSlideClick = index => {
  if (primaryImg.current) {
   primaryImg.current.src = allImages[index];
  }
  if (imageRef.current) {
   imageRef.current.src = allImages[index];
  }
 };

 useEffect(() => {
  if (detailsData) {
   document.title = `Seranoco / ${detailsData.product.name}`;
   if (detailsData.product.is_wishlist) {
    setIsFavorite(true);
   } else {
    setIsFavorite(false);
   }
  }
 }, [detailsData]);

 //  const handleIncrement = () => {
 //   if (quantity < detailsData.product.quantity) setQuantity(quantity + 1);
 //  };

 //  const handleDecrement = () => {
 //   if (quantity === 0) return;
 //   setQuantity(quantity - 1);
 //  };

 const handleAddToFavorites = async () => {
  const serverRes = await addToFavorite(token, id, +variation);
  if (serverRes.response.ok) {
   notify(t('product.added'));
   dispatch(favoriteActions.setCount(favoritesCount + 1));
   setIsFavorite(true);
  } else {
   notify(t('product.err'));
  }
 };

 const handleRemoveToFavorites = async () => {
  const serverRes = await removeFromFavorite(token, +variation);
  if (serverRes.response.ok) {
   notify(t('product.removed'));
   dispatch(favoriteActions.setCount(favoritesCount - 1));
   setIsFavorite(false);
  } else {
   notify(t('product.err'));
  }
 };

 useEffect(() => {
  if (favorites) {
   setIsFavorite(favorites?.some(el => el.variation_id === +variation));
  }
 }, [favorites]);

 const handleSendShoppingCart = async el => {
  const serverRes = await sendShoppingCart(token, el.id, +variation, +quantity);
  try {
   notify(t('orders.ok'));
   if (serverRes.response.ok) {
    dispatch(
     cartActions.add({
      ...el,
      selected_quantity: quantity,
      euro_price: euro,
      variation_id: variation,
      variation: { quantity: el.quantity },
     }),
    );
   }
   dispatch(drawerActions.open());
  } catch (err) {
   //  console.log(err);
  }
 };

 const handleAddToTemporaryCard = el => {
  dispatch(
   cartActions.addToTemporaryCart({
    ...el,
    selected_quantity: quantity,
    euro_price: euro,
    variation_id: variation,
    variation: { quantity: el.quantity },
   }),
  );
  dispatch(drawerActions.open())
 };

 return (
  <div className={classes.main}>
   <BannerCarousel />
   <Header windowSize={windowSize} />
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
           className={`${classes.zoom_image} ${isInViewbox ? '' : classes.dn}`}
           loading='lazy'
          />
          <img
           ref={primaryImg}
           className={`${classes.idle_image} ${!isInViewbox ? '' : classes.dn}`}
           src={detailsData.product?.primary_image}
           alt=''
           loading='lazy'
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

       <div className={`${classes.gallery} ${classes.desktop}`}>
        {detailsData && (
         <Swiper
          modules={[Pagination]}
          slidesPerView={5}
          spaceBetween={0}
          breakpoints={{
           640: {
            slidesPerView: 3,
           },
           768: {
            slidesPerView: 4,
           },
           1024: {
            slidesPerView: 5,
           },
          }}
          style={{
           width: '100%',
           display: 'flex',
           alignItems: 'center',
           justifyContent: 'center',
          }}
          pagination={{
           clickable: true,
           dynamicBullets: true,
          }}
          onClick={(swiper, event) => {
           handleSlideClick(swiper.clickedIndex);
          }}>
          {allImages &&
           allImages.map(el => {
            return (
             <SwiperSlide className={classes.gallery_image_wrapper}>
              <img src={el} alt='' loading='lazy' />
             </SwiperSlide>
            );
           })}
         </Swiper>
        )}
       </div>
      </div>
      <div className={`${classes.gallery} ${classes.mobile}`}>
       {detailsData && (
        <Swiper
         modules={[Pagination]}
         slidesPerView={5}
         spaceBetween={0}
         breakpoints={{
          640: {
           slidesPerView: 3,
          },
          768: {
           slidesPerView: 4,
          },
          1024: {
           slidesPerView: 5,
          },
         }}
         style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
         }}
         pagination={{
          clickable: true,
          dynamicBullets: true,
         }}
         onClick={(swiper, event) => {
          handleSlideClick(swiper.clickedIndex);
         }}>
         {allImages &&
          allImages.map(el => {
           return (
            <SwiperSlide className={classes.gallery_image_wrapper}>
             <img src={el} alt='' loading='lazy' />
            </SwiperSlide>
           );
          })}
        </Swiper>
       )}
      </div>
      <div
       className={classes.info}
       style={{ direction: lng === 'fa' ? 'rtl' : 'ltr' }}>
       {detailsData ? (
        <div style={{ display: 'flex', width: '100%' }}>
         <Typography
          className={classes.product_title}
          color='inherit'
          variant='h3'>
          <div>
           <span>
            <strong style={{ fontSize: '20px' }}>{shape}</strong>
           </span>
           <span>{cuttingStyle} </span>
          </div>
          <div>
           <span>
            <strong style={{ fontSize: '20px' }}>{brand}</strong>
           </span>
           <span>{details}</span>
          </div>
          <div>
           <span>
            <strong style={{ fontSize: '20px' }}>{color}</strong>
           </span>
           <span>{size}</span>
          </div>
         </Typography>
        </div>
       ) : (
        <Skeleton
         variant='text'
         sx={{ width: '10rem' }}
         animation='wave'
         className={classes.product_title}
        />
       )}
       {isByOrder && (
        <strong>
         <Typography
          className={classes.product_order_notification}
          color='inherit'
          variant='p'>
          <p>{t('by_order_notice')}</p>
         </Typography>
        </strong>
       )}

       {detailsData ? (
        <Typography
         className={classes.product_serial}
         color='inherit'
         href={`/${lng}/shopbyshape`}
         variant='h3'>
         {t('product.total_height')}&nbsp;:&nbsp;
         {height}
        </Typography>
       ) : (
        <Skeleton
         variant='text'
         sx={{ width: '10rem' }}
         animation='wave'
         className={classes.product_serial}
        />
       )}
       {detailsData ? (
        <Typography
         className={classes.product_serial}
         color='inherit'
         href={`/${lng}/shopbyshape`}
         variant='h3'>
         {t('serial_number')}&nbsp;:&nbsp;
         {variationDetail.product.variation.code}
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
       {detailsData && (
        <div className={classes.price_wrapper}>
         {lng !== 'fa' ? (
          <>
           <Typography
            className={classes.product_price}
            color='inherit'
            href={`/${lng}/shopbyshape`}
            variant='h3'>
            {t('price')}/1&nbsp;{t('1_pcs')}&nbsp;:
           </Typography>
           {+detailsData.product.percent_sale_price !== 0 && (
            <span
             className={classes.prev_price}
             style={{
              textDecoration: 'line-through',
             }}>
             <p className={classes.off_text}>
              {detailsData.product.percent_sale_price}%
             </p>
             €&nbsp;{detailsData && variationDetail.product.price}
            </span>
           )}
           &nbsp;
           <p className={classes.current_price}>
            {detailsData && variationDetail.product.sale_price}&nbsp;€
           </p>
          </>
         ) : (
          <>
           <Typography
            className={classes.product_price}
            color='inherit'
            href={`/${lng}/shopbyshape`}
            variant='h3'>
            {t('price')}/1&nbsp;{t('1_pcs')}&nbsp;:
           </Typography>
           {+detailsData.product?.percent_sale_price !== 0 && (
            <span
             className={classes.prev_price}
             style={{
              textDecoration: 'line-through',
             }}>
             <p className={classes.off_text}>
              {detailsData.product.percent_sale_price}%
             </p>
             &nbsp;
             {detailsData && variationDetail.product?.price * euro}
             {t('m_unit')}
            </span>
           )}
           &nbsp;
           <p className={classes.current_price}>
            {detailsData &&
             formatNumber(variationDetail?.product.sale_price * euro)}
            تومان (&nbsp;€&nbsp;
            {detailsData && variationDetail.product.sale_price} )
           </p>
          </>
         )}
        </div>
       )}
       {detailsData && (
        <>
         <div className={classes.quantity_wrapper}>
          {detailsData ? (
           <div className={classes.flex}>
            <div className={classes.quantity_total_wrapper}>
             <Typography
              className={`${classes.product_serial} ${classes.border}`}
              color='inherit'
              href={`/${lng}/shopbyshape`}
              variant='h3'
              sx={{
               borderRight: '1px solid',
               display: 'flex',
               alignItems: 'center',
               justifyContent: 'center',
               height: '100%',
              }}>
              {t('quantity')}&nbsp;
             </Typography>
             <div className={classes.divider} />
             {variationDetail && (
              <div className={classes.input_wrapper}>
               <p
                style={{
                 textAlign: lng === 'fa' ? 'right' : 'left',
                }}>
                {t('quantity')}:
               </p>
               <input
                type='number'
                value={quantity}
                onChange={e => {
                 const inputValue = e.target.value.replace(/[^0-9]/g, '');
                 const availableQuantity =
                  +variationDetail?.product?.variation?.quantity;

                 if (
                  variationDetail?.product?.variation?.is_not_available === 0 &&
                  availableQuantity > 0
                 ) {
                  const newQuantity = +inputValue;
                  if (newQuantity > availableQuantity) {
                   setIsMoreThanQuantity(true);
                   setQuantity(availableQuantity);
                  } else {
                   setIsMoreThanQuantity(false);
                   setQuantity(newQuantity);
                  }
                 } else {
                  setIsMoreThanQuantity(false);
                  setQuantity(inputValue);
                 }
                }}
                className={classes.quantity_input}
               />
               {
                <p
                 style={{
                  opacity: `${isMoreThanQuantity ? 1 : 0}`,
                  color: 'red',
                  whiteSpace: 'nowrap',
                 }}>
                 {t('availableQuantity')}:
                 {+variationDetail.product.variation.quantity}
                </p>
               }
              </div>
             )}
            </div>
            {/* <span className={classes.btn_wrapper}>
             <button className={classes.quantity_a_b} onClick={handleIncrement}>
              +
             </button>
             <button className={classes.quantity_a_b} onClick={handleDecrement}>
              -
             </button>
            </span> */}
           </div>
          ) : (
           <Skeleton
            variant='text'
            sx={{ width: '10rem' }}
            animation='wave'
            className={classes.product_serial}
           />
          )}
          <div className={classes.quantity_actions_wrapper}>
           <span className={classes.weight_wrapper}>
            <p>{t('total_weight')}</p>&nbsp;
            <p style={{ color: '#000000' }}>
             :&nbsp;
             {(
              +variationDetail.product.variation.weight.split(' ').at(0) *
              quantity
             )?.toFixed(3)}
             &nbsp;Ct
            </p>
           </span>
          </div>
         </div>
         {
          <p
           style={{
            opacity: `${isMoreThanQuantity ? 1 : 0}`,
            color: 'red',
            whiteSpace: 'nowrap',
            fontSize: '12px',
           }}>
           {t('availableQuantity')}:
           {+variationDetail.product.variation.quantity}
          </p>
         }
         {!token && (
          <IconButton
           className={classes.wish_list}
           onClick={() => {
            dispatch(accesModalActions.login());
           }}>
           <Heart width={15} height={15} />
           <p>{t('add_to_favorite')}</p>
          </IconButton>
         )}

         {token && (
          <>
           {isFavorite ? (
            <>
             <IconButton
              className={classes.wish_list}
              onClick={handleRemoveToFavorites}>
              <HeartRed width={15} height={15} />
              <p>{t('product.remove')}</p>
             </IconButton>
            </>
           ) : (
            <IconButton
             className={classes.wish_list}
             onClick={handleAddToFavorites}>
             <Heart width={15} height={15} />
             <p>{t('add_to_favorite')}</p>
            </IconButton>
           )}
          </>
         )}
        </>
       )}

       {detailsData && (
        <>
         {token ? (
          <Button
           variant='contained'
           size='large'
           className={classes.addtocart}
           onClick={() => handleSendShoppingCart(detailsData.product)}>
           <Shop style={{ width: '25px', height: '25px', margin: '0 5px' }} />
           {isByOrder ? t('addtoorder') : t('addtocart')}
          </Button>
         ) : (
          <Button
           variant='contained'
           size='large'
           className={classes.addtocart}
           onClick={() => handleAddToTemporaryCard(detailsData.product)}>
           <Shop style={{ width: '25px', height: '25px', margin: '0 5px' }} />
           {isByOrder ? t('addtoorder') : t('addtocart')}
          </Button>
         )}
        </>
       )}

       <span className={classes.divider} />
       {detailsData && (
        <div
         className={classes.payment_wrapper}
         style={{
          alignItems: lng === 'fa' ? 'flex-end' : 'flex-start',
         }}>
         {lng !== 'fa' ? (
          <div className={classes.payment_ct}>
           <p className={classes.payment_title}>
            {t('shopping_cart.total')}&nbsp;
            {t('payment')}:
           </p>
           &nbsp;&nbsp;
           <p className={classes.payment_value}>
            {(+variationDetail.product.sale_price * quantity).toFixed(2)}
            {t('m_unit')}
           </p>
          </div>
         ) : (
          <div
           className={classes.payment_ct}
           style={{
            direction: 'rtl',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
           }}>
           <span className={classes.total_fee_wrapper}>
            <span>
             <p className={classes.payment_title}>{t('payment')}:</p>
             &nbsp;
             <p className={classes.payment_value}>
              {formatNumber(
               +variationDetail.product.sale_price * quantity * +euro,
              )}
              {t('m_unit')}
             </p>
            </span>
            <span>
             <p className={classes.payment_value}>
              {(+variationDetail.product.sale_price * quantity).toFixed(2)}€
             </p>
             &nbsp;
             <p className={classes.payment_title}>:Total</p>
            </span>
           </span>
           {/* <span style={{ display: 'flex' }}>
            <p className={classes.payment_value}>
             مبنا نرخ یورو محاسباتی : {euro}
             {t('m_unit')}
            </p>
           </span> */}
          </div>
         )}
        </div>
       )}
      </div>
     </div>
     <div className={classes.tip_wrapper}>
      <p className={classes.tip_text}>{t('zoom_tip')}</p>
     </div>
     <div className={classes.grid_wrapper}>
      {detailsData && <CustomeTab dataProp={detailsData} />}
     </div>

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
   <Footer />
  </div>
 );
};

export default Products;
