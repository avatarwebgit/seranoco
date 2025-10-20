import { IconButton, Skeleton } from "@mui/material";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";

import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import "swiper/css/scrollbar";
import { FreeMode, Navigation, Scrollbar, Thumbs } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

import BannerCarousel from "../components/BannerCarousel";
import Breadcrumbs from "../components/common/Breadcrumbs";
import Body from "../components/filters_page/Body";
import Card from "../components/filters_page/Card";
import Footer from "../layout/Footer";
import Header from "../layout/Header";

import { useSelector } from "react-redux";
import { getSinglePortfolio } from "../services/api";
import classes from "./SinglePortfolio.module.css";
import { KeyboardDoubleArrowDown } from "@mui/icons-material";

const SinglePortfolio = ({ windowSize }) => {
  const { t } = useTranslation();
  const { alias } = useParams();

  const lng = useSelector((state) => state.localeStore.lng);

  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [mainSwiper, setMainSwiper] = useState(null);
  const [portfolioItem, setPortfolioItem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [imagesLoaded, setImagesLoaded] = useState([]);
  const [slidesForLightbox, setslidesForLightbox] = useState([]);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const [isSwiperReady, setIsSwiperReady] = useState(false);

  const navigate = useNavigate();

  const thumbnailNextBtnRef = useRef(null);
  const thumbnailPrevBtnRef = useRef(null);
  const mainSwiperRef = useRef(null);
  const thumbSwiperRef = useRef(null);

  useEffect(() => {
    console.log(mainSwiperRef.current, thumbSwiperRef.current);
    if (mainSwiperRef.current && thumbSwiperRef.current) {
      setIsSwiperReady(true);
    }
  }, [lng]);

  useEffect(() => {
    const fetchData = async (slug) => {
      try {
        const { response, result } = await getSinglePortfolio(slug);
        if (response.ok) {
          setPortfolioItem(result);
          console.log(result.images);
        }
        if (response.status === 404) return navigate("/");
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    if (alias) {
      fetchData(alias);
    }
  }, [alias]);

  useEffect(() => {
    let intervalId;
    let firstTimeoutId;

    if (thumbsSwiper && !hasUserInteracted) {
      firstTimeoutId = setTimeout(() => {
        thumbsSwiper?.slideNext(900);

        setTimeout(() => {
          thumbsSwiper?.slidePrev(900);
        }, 1300);

        intervalId = setInterval(() => {
          thumbsSwiper?.slideNext(900);

          setTimeout(() => {
            thumbsSwiper?.slidePrev(900);
          }, 1300);
        }, 8000);
      }, 3000);
    }

    return () => {
      clearTimeout(firstTimeoutId);
      clearInterval(intervalId);
    };
  }, [thumbsSwiper, hasUserInteracted]);

  useEffect(() => {
    if (portfolioItem) {
      setImagesLoaded(new Array(portfolioItem.images.length).fill(false));
      setslidesForLightbox(portfolioItem.images.map((src) => ({ src })));
    } else {
      setImagesLoaded([]);
      setslidesForLightbox([]);
    }
  }, [portfolioItem]);

  const handleImageLoad = (index) => {
    setImagesLoaded((prev) => {
      const newLoaded = [...prev];
      if (index < newLoaded.length) {
        newLoaded[index] = true;
      }
      return newLoaded;
    });
  };

  const openLightbox = (index) => {
    setLightboxIndex(index);
    setIsLightboxOpen(true);
  };

  const memoizedImages = useMemo(
    () => portfolioItem?.images || [],
    [portfolioItem]
  );

  const handleUserInteraction = () => {
    if (!hasUserInteracted) {
      setHasUserInteracted(true);
    }
  };

  return (
    <section className={classes.main}>
      <BannerCarousel />
      <Header windowSize={windowSize} />
      <Body>
        <Card className={classes.break}>
          <Breadcrumbs
            linkDataProp={[
              { pathname: t("home"), url: "" },
              { pathname: t("portfolio"), url: "portfolio" },
              {
                pathname: isLoading ? (
                  <Skeleton width={200} />
                ) : (
                  portfolioItem?.title || "Not Found"
                ),
              },
            ]}
          />

          {isLoading ? (
            <div
              className={classes.pageContainer}
              dir={lng === "fa" ? "rtl" : "ltr"}
            >
              <div className={classes.titleSkeletonWrapper}>
                <Skeleton variant="text" width="60%" height={60} />
              </div>

              <div className={classes.gallerySection}>
                <div className={classes.thumbnailGallery}>
                  <div className={classes.thumbnailSkeletonContainer}>
                    <Skeleton
                      variant="rectangular"
                      className={classes.thumbnailSkeletonItem}
                    />
                    <Skeleton
                      variant="rectangular"
                      className={classes.thumbnailSkeletonItem}
                    />
                    <Skeleton
                      variant="rectangular"
                      className={classes.thumbnailSkeletonItem}
                    />
                  </div>
                </div>
                <div className={classes.mainImageContainer}>
                  <Skeleton variant="rectangular" width="100%" height="100%" />
                </div>
              </div>

              <div
                className={classes.contentSection}
                dir={lng === "fa" ? "rtl" : "ltr"}
              >
                <div className={classes.metaInfo}>
                  <Skeleton
                    variant="text"
                    width="80%"
                    height={40}
                    style={{ margin: "0 auto 1rem auto" }}
                  />
                  <p>
                    <Skeleton variant="text" />
                  </p>
                  <p>
                    <Skeleton variant="text" />
                  </p>
                  <p>
                    <Skeleton variant="text" />
                  </p>
                  <p>
                    <Skeleton variant="text" />
                  </p>
                  <p>
                    <Skeleton variant="text" />
                  </p>
                </div>
                <div className={classes.descriptionSkeleton}>
                  <Skeleton variant="text" />
                  <Skeleton variant="text" />
                  <Skeleton variant="text" />
                  <Skeleton variant="text" />
                  <Skeleton variant="text" width="80%" />
                </div>
              </div>
            </div>
          ) : (
            <div
              className={classes.pageContainer}
              dir={lng === "fa" ? "rtl" : "ltr"}
            >
              <h1 className={classes.title}>
                {lng === "fa" ? portfolioItem.title : portfolioItem.title_en}
              </h1>

              {/* --- GALLERY SECTION --- */}
              {
                <div className={classes.gallerySection}>
                  {/* Thumbnail Swiper */}
                  <div className={classes.thumbnailGallery}>
                    <Swiper
                      key={`${lng}`}
                      modules={[Navigation, Thumbs, Scrollbar]}
                      onSwiper={setThumbsSwiper}
                      spaceBetween={10}
                      slidesPerView={"auto"}
                      onTouchStart={handleUserInteraction}
                      onClick={handleUserInteraction}
                      watchSlidesProgress={true}
                      scrollbar={{
                        draggable: true,
                        dragSize: 50,
                      }}
                      className={classes.thumbsSwiper}
                      breakpoints={{
                        0: {
                          direction: "horizontal",
                          slidesPerView: 3,
                          scrollbar: {
                            dragSize: 50,
                          },
                        },
                        992: {
                          direction: "vertical",
                          spaceBetween: 15,
                          slidesPerView: 3,
                          scrollbar: {
                            dragSize: 24,
                          },
                        },
                      }}
                    >
                      {memoizedImages.map((image, index) => (
                        <SwiperSlide
                          key={index}
                          className={classes.thumbnailSlide}
                          style={{ position: "relative" }}
                        >
                          {!imagesLoaded[index] && (
                            <Skeleton
                              variant="rectangular"
                              animation="wave"
                              style={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                width: "100%",
                                height: "100%",
                                zIndex: 1,
                              }}
                            />
                          )}
                          <img
                            src={image}
                            alt={`${portfolioItem.title} thumbnail ${
                              index + 1
                            }`}
                            onLoad={() => handleImageLoad(index)}
                            style={{
                              display: "block",
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              opacity: imagesLoaded[index] ? 1 : 0,
                              transition: "opacity 0.3s ease",
                            }}
                          />
                        </SwiperSlide>
                      ))}
                    </Swiper>
                    <IconButton
                      ref={thumbnailPrevBtnRef}
                      sx={{
                        background: "#fff",
                      }}
                      style={{
                        left: lng === "fa" ? "5%" : "auto",
                        right: lng !== "fa" ? "5%" : "auto",
                      }}
                      className={classes.navigation_button_prev}
                      onTouchStart={() => {
                        handleUserInteraction();
                      }}
                      onClick={() => {
                        handleUserInteraction();
                        mainSwiper?.slidePrev();
                      }}
                    >
                      <KeyboardDoubleArrowDown
                        sx={{ transform: "rotate(180deg)", fill: "black" }}
                      />
                    </IconButton>
                    <IconButton
                      ref={thumbnailNextBtnRef}
                      sx={{
                        background: "#fff",
                      }}
                      style={{
                        left: lng === "fa" ? "5%" : "auto",
                        right: lng !== "fa" ? "5%" : "auto",
                      }}
                      className={classes.navigation_button_next}
                      onTouchStart={() => {
                        handleUserInteraction();
                      }}
                      onClick={() => {
                        handleUserInteraction();
                        mainSwiper?.slideNext();
                      }}
                    >
                      <KeyboardDoubleArrowDown sx={{ fill: "black" }} />
                    </IconButton>
                  </div>

                  {/* Main Image Swiper */}
                  <div className={classes.mainImageContainer}>
                    <Swiper
                      key={`${lng}`}
                      onSwiper={setMainSwiper}
                      spaceBetween={10}
                      onSlideChange={(swiper) => {
                        if (thumbsSwiper && !thumbsSwiper.destroyed) {
                          thumbsSwiper?.slideTo(swiper.activeIndex, 300);
                        }
                      }}
                      thumbs={{
                        swiper:
                          thumbsSwiper && !thumbsSwiper.destroyed
                            ? thumbsSwiper
                            : null,
                      }}
                      modules={[FreeMode, Thumbs]}
                      className={classes.mainSwiper}
                    >
                      {memoizedImages.map((image, index) => (
                        <SwiperSlide
                          key={index}
                          onClick={() => openLightbox(index)}
                        >
                          {!imagesLoaded[index] && (
                            <Skeleton
                              variant="rectangular"
                              animation="wave"
                              style={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                height: "500px",
                                width: "100%",
                                objectFit: "cover",
                              }}
                            />
                          )}
                          <center>
                            <img
                              src={image}
                              alt={`${portfolioItem.title} image ${index + 1}`}
                              onLoad={() => handleImageLoad(index)}
                              style={{
                                visibility: imagesLoaded[index]
                                  ? "visible"
                                  : "hidden",
                                height: "500px",
                                width: "100%",
                                objectFit: "cover",
                              }}
                            />
                          </center>
                        </SwiperSlide>
                      ))}
                    </Swiper>
                    <IconButton
                      ref={thumbnailPrevBtnRef}
                      className={classes.main_button_prev}
                      sx={{ background: "#fff" }}
                      onTouchStart={() => {
                        handleUserInteraction();
                      }}
                      onClick={() => {
                        handleUserInteraction();
                        mainSwiper?.slidePrev();
                      }}
                    >
                      <KeyboardDoubleArrowDown
                        sx={{ transform: "rotate(-90deg)", fill: "black" }}
                      />
                    </IconButton>
                    <IconButton
                      ref={thumbnailNextBtnRef}
                      className={classes.main_button_next}
                      sx={{ background: "#fff" }}
                      onTouchStart={() => {
                        handleUserInteraction();
                      }}
                      onClick={() => {
                        handleUserInteraction();
                        mainSwiper?.slideNext();
                      }}
                    >
                      <KeyboardDoubleArrowDown
                        sx={{ transform: "rotate(90deg)", fill: "black" }}
                      />
                    </IconButton>
                  </div>
                </div>
              }

              <div className={classes.contentSection}>
                <div className={classes.metaInfo}>
                  <center>
                    <strong>{t("information")}</strong>
                  </center>
                  <div
                    className={classes.short_description}
                    dangerouslySetInnerHTML={{
                      __html:
                        lng === "fa"
                          ? portfolioItem.shortDescription || ""
                          : portfolioItem.shortDescription_en || "",
                    }}
                  />
                </div>
                <p
                  className={classes.description}
                  dangerouslySetInnerHTML={{
                    __html:
                      lng === "fa"
                        ? portfolioItem.description || ""
                        : portfolioItem.description_en || "",
                  }}
                ></p>
              </div>
            </div>
          )}
        </Card>
      </Body>
      <Footer windowSize={windowSize} />

      {portfolioItem && (
        <Lightbox
          open={isLightboxOpen}
          close={() => setIsLightboxOpen(false)}
          slides={slidesForLightbox}
          index={lightboxIndex}
        />
      )}
    </section>
  );
};

export default SinglePortfolio;
