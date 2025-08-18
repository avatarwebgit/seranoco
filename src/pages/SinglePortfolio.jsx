import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Skeleton } from "@mui/material";

// Swiper imports
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";

// Lightbox imports
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

import Header from "../layout/Header";
import Footer from "../layout/Footer";
import Body from "../components/filters_page/Body";
import Card from "../components/filters_page/Card";
import BannerCarousel from "../components/BannerCarousel";
import Breadcrumbs from "../components/common/Breadcrumbs";
import NotFound from "./NotFound";

import classes from "./SinglePortfolio.module.css";

const portfolioItems = [
  {
    id: 1,
    slug: "project-alpha",
    title: "Modern Kitchen Design",
    images: [
      "https://picsum.photos/seed/p1/1200/800",
      "https://picsum.photos/seed/p1-alt1/1200/800",
      "https://picsum.photos/seed/p1-alt2/1200/800",
      "https://picsum.photos/seed/p1-alt3/1200/800",
      "https://picsum.photos/seed/p1-alt4/1200/800",
      "https://picsum.photos/seed/p1-alt5/1200/800",
    ],
    description:
      "A complete overhaul of a residential kitchen, focusing on a minimalist aesthetic with high-functionality. We used state-of-the-art appliances and custom cabinetry to create a clean, inviting space for cooking and socializing. The color palette is neutral with pops of natural wood tones to add warmth.A complete overhaul of a residential kitchen, focusing on a minimalist aesthetic with high-functionality. We used state-of-the-art appliances and custom cabinetry to create a clean, inviting space for cooking and socializing. The color palette is neutral with pops of natural wood tones to add warmth.A complete overhaul of a residential kitchen, focusing on a minimalist aesthetic with high-functionality. We used state-of-the-art appliances and custom cabinetry to create a clean, inviting space for cooking and socializing. The color palette is neutral with pops of natural wood tones to add warmth.A complete overhaul of a residential kitchen, focusing on a minimalist aesthetic with high-functionality. We used state-of-the-art appliances and custom cabinetry to create a clean, inviting space for cooking and socializing. The color palette is neutral with pops of natural wood tones to add warmth.A complete overhaul of a residential kitchen, focusing on a minimalist aesthetic with high-functionality. We used state-of-the-art appliances and custom cabinetry to create a clean, inviting space for cooking and socializing. The color palette is neutral with pops of natural wood tones to add warmth.A complete overhaul of a residential kitchen, focusing on a minimalist aesthetic with high-functionality. We used state-of-the-art appliances and custom cabinetry to create a clean, inviting space for cooking and socializing. The color palette is neutral with pops of natural wood tones to add warmth.A complete overhaul of a residential kitchen, focusing on a minimalist aesthetic with high-functionality. We used state-of-the-art appliances and custom cabinetry to create a clean, inviting space for cooking and socializing. The color palette is neutral with pops of natural wood tones to add warmth.A complete overhaul of a residential kitchen, focusing on a minimalist aesthetic with high-functionality. We used state-of-the-art appliances and custom cabinetry to create a clean, inviting space for cooking and socializing. The color palette is neutral with pops of natural wood tones to add warmth.",
    category: "Interior Design",
    client: "The Johnson Family",
    date: "2023-01-15",
  },
  {
    id: 2,
    slug: "project-beta",
    title: "Corporate Branding",
    images: [
      "https://picsum.photos/seed/p2/1200/800",
      "https://picsum.photos/seed/p2-alt1/1200/800",
      "https://picsum.photos/seed/p2-alt2/1200/800",
      "https://picsum.photos/seed/p2/800/800",
      "https://picsum.photos/seed/p2-alt1/800/800",
      "https://picsum.photos/seed/p2-alt2/800/800",
    ],
    description:
      "Developed a new brand identity for a tech startup, including logo design, color theory, typography, and a comprehensive brand style guide. The goal was to create a modern, trustworthy, and scalable brand that reflects the company's innovative spirit.",
    category: "Branding",
    client: "TechInnovate Inc.",
    date: "2023-03-20",
  },
  {
    id: 3,
    slug: "project-gamma",
    title: "E-commerce Platform",
    images: [
      "https://picsum.photos/seed/p3/1200/800",
      "https://picsum.photos/seed/p3-alt1/1200/800",
      "https://picsum.photos/seed/p3-alt2/1200/800",
      "https://picsum.photos/seed/p3-alt3/1200/800",
    ],
    description:
      "Built a custom e-commerce solution from the ground up for a fashion retailer. The platform features a responsive design, secure payment gateway integration, and an intuitive admin panel for product management. The user experience was optimized for conversions and customer retention.",
    category: "Web Development",
    client: "Chic Boutique",
    date: "2023-05-10",
  },
  {
    id: 4,
    slug: "project-delta",
    title: "Mobile Banking App",
    images: [
      "https://picsum.photos/seed/p4/1200/800",
      "https://picsum.photos/seed/p4-alt1/1200/800",
    ],
    description:
      "Designed the user interface and user experience for a next-generation mobile banking application. We focused on security, ease of use, and a clean visual design to help users manage their finances effortlessly. Features include biometric login, P2P transfers, and financial goal tracking.",
    category: "UI/UX Design",
    client: "SecureBank",
    date: "2023-07-22",
  },
  {
    id: 5,
    slug: "project-epsilon",
    title: "Architectural Visualization",
    images: [
      "https://picsum.photos/seed/p5/1200/800",
      "https://picsum.photos/seed/p5-alt1/1200/800",
      "https://picsum.photos/seed/p5-alt2/1200/800",
    ],
    description:
      "Created photorealistic 3D renderings and a virtual walkthrough for a new commercial real estate development. Our visualizations helped the client secure investors and pre-lease units by providing a vivid and accurate depiction of the final project.",
    category: "3D Modeling",
    client: "Metropolis Developments",
    date: "2023-09-05",
  },
  {
    id: 6,
    slug: "project-zeta",
    title: "Luxury Villa Exterior",
    images: [
      "https://picsum.photos/seed/p6/1200/800",
      "https://picsum.photos/seed/p6-alt1/1200/800",
      "https://picsum.photos/seed/p6-alt2/1200/800",
      "https://picsum.photos/seed/p6-alt3/1200/800",
    ],
    description:
      "Designed the exterior and landscaping for a luxury villa, blending modern architecture with natural elements. The project included an infinity pool, outdoor living spaces, and sustainable design choices to minimize environmental impact while maximizing aesthetic appeal.",
    category: "Architecture",
    client: "Private Residence",
    date: "2023-11-18",
  },
];

const SinglePortfolio = ({ windowSize }) => {
  const { t } = useTranslation();
  const { id } = useParams();

  const portfolioItem = portfolioItems.find(
    (item) => String(item.id) === id || item.slug === id
  );

  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [imagesLoaded, setImagesLoaded] = useState(() =>
    new Array(portfolioItem?.images?.length || 0).fill(false)
  );
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

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

  if (!portfolioItem) {
    return <NotFound />;
  }

  const slidesForLightbox = portfolioItem.images.map((src) => ({ src }));

  return (
    <section className={classes.main}>
      <BannerCarousel />
      <Header windowSize={windowSize} />
      <Body>
        <Card className={classes.break}>
          <Breadcrumbs
            linkDataProp={[
              { pathname: t("home"), url: "/" },
              { pathname: t("portfolio"), url: "/portfolio" },
              { pathname: portfolioItem?.title },
            ]}
          />

          <div className={classes.pageContainer}>
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
                    <SwiperSlide key={index} className={classes.thumbnailSlide}>
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
                          objectFit: "cover",
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
                            width: "100%",
                            height: "100%",
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
                            width: "100%",
                            height: "100%",
                            objectFit: "contain",
                          }}
                        />
                      </center>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </div>

            {/* --- CONTENT SECTION --- */}
            <div className={classes.contentSection}>
              <div className={classes.metaInfo}>
                <center>
                  <strong>{t("information")}</strong>
                </center>
                <p>
                  <strong>{t("artist") + "/" + t("brand")}:</strong>
                  {portfolioItem.client}
                </p>
                <p>
                  <strong>{t("category")}:</strong> {portfolioItem.category}
                </p>
                <p>
                  <strong>{t("date")}:</strong> {portfolioItem.date}
                </p>
                <p>
                  <strong>{t("idea")}:</strong> {portfolioItem.client}
                </p>
                <p>
                  <strong>{t("nickname")}:</strong> {portfolioItem.category}
                </p>
              </div>

              <p className={classes.description}>{portfolioItem.description}</p>
            </div>
          </div>
        </Card>
      </Body>
      <Footer windowSize={windowSize} />

      <Lightbox
        open={isLightboxOpen}
        close={() => setIsLightboxOpen(false)}
        slides={slidesForLightbox}
        index={lightboxIndex}
      />
    </section>
  );
};

export default SinglePortfolio;
