import { Skeleton } from "@mui/material";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Navigate, useNavigate, useParams } from "react-router-dom";

import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";
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
import classes from "./SinglePortfolio.module.css";
import { getSinglePortfolio } from "../services/api";

const SinglePortfolio = ({ windowSize }) => {
  const { t } = useTranslation();
  const { alias } = useParams();

  const lng = useSelector((state) => state.localeStore.lng);

  const [portfolioItem, setPortfolioItem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [imagesLoaded, setImagesLoaded] = useState([]);
  const [slidesForLightbox, setslidesForLightbox] = useState([]);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const navigate = useNavigate();

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
    if (portfolioItem) {
      setImagesLoaded([...portfolioItem.images]);
      console.log([...portfolioItem.images]);
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
              <h1 className={classes.title}>{portfolioItem.title}</h1>

              {/* --- GALLERY SECTION --- */}
              <div className={classes.gallerySection}>
                {/* Thumbnail Swiper */}
                <div className={classes.thumbnailGallery}>
                  <Swiper
                    onSwiper={setThumbsSwiper}
                    spaceBetween={10}
                    slidesPerView={"auto"}
                    freeMode={true}
                    watchSlidesProgress={true}
                    modules={[FreeMode, Navigation, Thumbs]}
                    className={classes.thumbsSwiper}
                    breakpoints={{
                      992: {
                        direction: "vertical",
                        spaceBetween: 15,
                        slidesPerView: 3,
                      },
                    }}
                  >
                    {portfolioItem.images.map((image, index) => (
                      <SwiperSlide
                        key={index}
                        className={classes.thumbnailSlide}
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
                            }}
                          />
                        )}
                        <img
                          src={image}
                          alt={`${portfolioItem.title} thumbnail ${index + 1}`}
                          onLoad={() => handleImageLoad(index)}
                          style={{
                            visibility: imagesLoaded[index]
                              ? "visible"
                              : "hidden",
                            width: "100%",
                            height: "100%",
                            objectFit: "contain",
                          }}
                        />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>

                {/* Main Image Swiper */}
                <div className={classes.mainImageContainer}>
                  <Swiper
                    spaceBetween={10}
                    navigation={true}
                    thumbs={{
                      swiper:
                        thumbsSwiper && !thumbsSwiper.destroyed
                          ? thumbsSwiper
                          : null,
                    }}
                    modules={[FreeMode, Navigation, Thumbs]}
                    className={classes.mainSwiper}
                  >
                    {portfolioItem.images.map((image, index) => (
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
                </div>
              </div>

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
