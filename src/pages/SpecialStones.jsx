import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import { Pagination as PaginationComponent } from "@mui/material";
import { nanoid } from "@reduxjs/toolkit";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Navigation, Pagination, Thumbs } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import BannerCarousel from "../components/BannerCarousel";
import Breadcrumbs from "../components/common/Breadcrumbs";
import LoadingSpinner from "../components/common/LoadingSpinner";
import Body from "../components/filters_page/Body";
import Card from "../components/filters_page/Card";
import CustomSelect from "../components/filters_page/CustomSelect";
import Divider from "../components/filters_page/Divider";
import ResultMobile from "../components/filters_page/ResultMobile";
import ResultRow from "../components/filters_page/ResultRow";
import SizeBox from "../components/filters_page/SizeBox";
import Footer from "../layout/Footer";
import Header from "../layout/Header";
import {
  getAllInitialProductFromCategory,
  getAllProductFromCategory,
} from "../services/api";
import { productDetailActions } from "../store/store";
import { scrollToTarget } from "../utils/helperFunctions";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import "swiper/css/thumbs";
import "../styles/carousel.css";
import classes from "./SpecialStones.module.css";

const SpecialStones = ({ windowSize }) => {
  const { id: categoryId } = useParams();
  const [colorData, setColorData] = useState([]);
  const [sizeData, setSizeData] = useState([]);
  const [shapesData, setShapesData] = useState([]);
  const [groupColors, setGroupColors] = useState([]);

  const [shapeFormEntries, setShapeFormEntries] = useState(null);
  const [dimensionEntries, setDimensionEntries] = useState({});
  const [selectedIds, setSelectedIds] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isFilteredProductsLoading, setIsFilteredProductsLoading] =
    useState(false);
  const [error, setError] = useState(null);

  const [productDetails, setProductDetails] = useState([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(null);
  const [ItemsPerPage, setItemsPerPage] = useState(9);

  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [currentActiveGroupColor, setCurrentActiveGroupColor] = useState(null);
  const [sortedColors, setSortedColors] = useState([]);
  const [sortedGroupColors, setSortedGroupColors] = useState([]);
  const [isSmallPage, setIsSmallPage] = useState(false);
  const [slidesPerView, setSlidesPerView] = useState(5);

  const formRef = useRef();
  const sizeRef = useRef();
  const sliderRef = useRef();
  const productsWrapperRef = useRef();
  const abortControllerRef = useRef(new AbortController());
  const isInitialMount = useRef(true);

  const { t } = useTranslation();
  const dispatch = useDispatch();
  const lng = useSelector((state) => state.localeStore.lng);
  const itemIds = useSelector((state) => state.detailsStore.itemIds);

  const handlePrev = useCallback(
    () => sliderRef.current?.swiper.slidePrev(),
    []
  );
  const handleNext = useCallback(
    () => sliderRef.current?.swiper.slideNext(),
    []
  );

  const handleSendDimensionsStatus = (e, elem) => {
    const form = sizeRef.current;
    const formData = new FormData(form);
    const formEntries = Object.fromEntries(formData.entries());
    setDimensionEntries(formEntries);
  };

  const handleThumbClick = (groupId) => {
    setCurrentActiveGroupColor(groupId);
    const firstMatchingSlideIndex = sortedColors.findIndex(
      (slide) => slide.group_id === groupId
    );
    if (sliderRef.current && firstMatchingSlideIndex !== -1) {
      sliderRef.current.swiper.slideTo(firstMatchingSlideIndex);
    }
  };

  const handleResetSelections = () => {
    setShapeFormEntries(null);
    setDimensionEntries({});
    setSelectedIds([]);
    setProductDetails([]);
    dispatch(productDetailActions.reset());
    scrollToTarget(formRef, 1000);
  };

  const handleCheckboxChange = (e, slideId) => {
    setSelectedIds((prevIds) =>
      e.target.checked
        ? [...prevIds, slideId]
        : prevIds.filter((id) => id !== slideId)
    );
  };

  const handleShapeClick = (e, id) => {
    setShapeFormEntries(id);
  };

  // Initial data load
  useEffect(() => {
    document.title = t("special_stones");
    const controller = new AbortController();
    abortControllerRef.current = controller;

    const loadInitialData = async () => {
      if (!categoryId) {
        setError("Category ID is missing from URL.");
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      setError(null);
      try {
        const { result, response } = await getAllInitialProductFromCategory(
          categoryId,
          { signal: controller.signal }
        );
        if (response.ok && result.success) {
          setColorData(result.colors || []);
          setGroupColors(result.group_colors || []);
          setShapesData(result.shapes || []);
          setSizeData(result.sizes || []);
        } else {
          setError(result.message || "Failed to load category data.");
        }
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message || "An unexpected error occurred.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
    dispatch(productDetailActions.reset());

    return () => {
      controller.abort();
    };
  }, [categoryId, dispatch, t]);

  // Sort colors and groups whenever they are updated
  useEffect(() => {
    if (colorData && groupColors) {
      const sortedGroupColorsP = groupColors.sort(
        (a, b) => a.priority - b.priority
      );
      setSortedGroupColors(sortedGroupColorsP);
      setSortedColors(
        colorData.sort((a, b) => {
          const groupA = sortedGroupColorsP.find(
            (group) => group.id === a.group_id
          );
          const groupB = sortedGroupColorsP.find(
            (group) => group.id === b.group_id
          );

          if (groupA.priority === groupB.priority) {
            return a.priority - b.priority;
          }

          return groupA.priority - groupB.priority;
        })
      );
    }
  }, [groupColors, colorData]);

  // Set initial active color group
  useEffect(() => {
    if (sortedGroupColors.length > 0 && currentActiveGroupColor === null) {
      handleThumbClick(sortedGroupColors[0].id);
    }
  }, [sortedGroupColors, currentActiveGroupColor]);

  // Central filtering logic
  const applyFilters = useCallback(
    async (currentPage = 1) => {
      abortControllerRef.current.abort();
      const controller = new AbortController();
      abortControllerRef.current = controller;

      const size_ids = Object.keys(dimensionEntries).map(Number);
      const hasFilters =
        shapeFormEntries || selectedIds.length > 0 || size_ids.length > 0;

      if (!hasFilters) {
        setProductDetails([]);
        setPage(1);
        setLastPage(null);
        return;
      }

      setIsFilteredProductsLoading(true);
      try {
        const { result, response } = await getAllProductFromCategory(
          categoryId,
          selectedIds,
          shapeFormEntries,
          size_ids,
          currentPage,
          ItemsPerPage
        );

        if (response.ok && result.success) {
          setProductDetails(result.data || []);
          setShapesData(result.shapes || []);
          setSizeData(result.sizes || []);
          setLastPage(result.pagination?.last_page || 1);
          setPage(result.pagination?.current_page || 1);
          setError(null);
        } else {
          setError(result.message || "Failed to filter products.");
          setProductDetails([]);
        }
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message || "An unexpected error occurred.");
        }
      } finally {
        setIsFilteredProductsLoading(false);
      }
    },
    [categoryId, selectedIds, shapeFormEntries, dimensionEntries, ItemsPerPage]
  );

  // Effect to trigger filtering when selections change
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    applyFilters(1);
  }, [shapeFormEntries, selectedIds, dimensionEntries, applyFilters]);

  // Pagination handler
  const handlePaginationChange = (e, value) => {
    applyFilters(value);
    scrollToTarget(productsWrapperRef);
  };

  useEffect(() => {
    const isSmall =
      windowSize === "xs" || windowSize === "s" || windowSize === "m";
    setIsSmallPage(isSmall);
    setSlidesPerView(isSmall ? 5 : 9);
  }, [windowSize]);

  const memoizedProducts = useMemo(() => productDetails, [productDetails]);

  if (isLoading) {
    return (
      <div className={classes.main}>
        <BannerCarousel />
        <Header windowSize={windowSize} />
        <Body>
          <LoadingSpinner />
        </Body>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className={classes.main}>
        <BannerCarousel />
        <Header windowSize={windowSize} />
        <Body>
          <p
            className={classes.alert}
            style={{
              fontSize: "1rem",
              margin: "2rem auto",
              width: "fit-content",
            }}
          >
            Error: {error}
          </p>
        </Body>
        <Footer />
      </div>
    );
  }

  return (
    <div className={classes.main}>
      <BannerCarousel />
      <Header windowSize={windowSize} />

      <Body>
        <Card className={`${classes.size_wrapper} ${classes.colors_wrapper}`}>
          <Breadcrumbs
            linkDataProp={[
              { pathname: t("home"), url: "/" },
              { pathname: t("special_stones") },
            ]}
          />
          {colorData.length > 0 && (
            <div
              className={classes.total_color}
              dir={lng === "fa" ? "rtl" : "ltr"}
            >
              {t("alvailable_colors", { count: colorData.length })}
            </div>
          )}
          <Divider className={classes.color_divider} text={t("colors")} />

          {sortedColors?.length > 0 && (
            <>
              <button
                className={classes.prev_btn}
                onClick={handlePrev}
                aria-label="Previous Color"
              >
                <ArrowBackIos />
              </button>
              <button
                className={classes.next_btn}
                onClick={handleNext}
                aria-label="Next Color"
              >
                <ArrowForwardIos />
              </button>
            </>
          )}
          <Swiper
            modules={[Navigation, Thumbs, Pagination]}
            className={classes.swiper}
            spaceBetween={isSmallPage ? 5 : 9}
            slidesPerView={slidesPerView}
            onSwiper={setThumbsSwiper}
            ref={sliderRef}
            pagination={{
              clickable: true,
              dynamicBullets: true,
              enabled: isSmallPage,
            }}
          >
            {sortedColors.map((slide) => (
              <SwiperSlide key={slide.id} className={classes.slide}>
                <div>
                  <label
                    htmlFor={slide.id}
                    className={classes.color_slider_label}
                  >
                    <div className={classes.slider_image_wrapper}>
                      <img
                        src={slide.image}
                        alt={slide.description}
                        className={classes.slider_img}
                        loading="lazy"
                      />
                    </div>
                  </label>
                  <input
                    type="checkbox"
                    name={slide.id.toString()}
                    id={slide.id}
                    className={classes.slider_input}
                    checked={selectedIds.includes(slide.id)}
                    onChange={(e) => handleCheckboxChange(e, slide.id)}
                  />
                  <p
                    className={classes.color_name}
                    style={{ textAlign: lng !== "en" ? "end" : "start" }}
                  >
                    {lng !== "fa" ? slide.description : slide.description_fa}
                  </p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className={classes.thumbnail_container}>
            {sortedGroupColors.map((slide) => (
              <div
                key={nanoid()}
                className={`${classes.thumbnail} ${
                  currentActiveGroupColor === slide.id &&
                  classes.thumbnail_active
                }`}
                role="button"
                tabIndex={0}
                onClick={() => handleThumbClick(slide.id)}
                onKeyDown={(e) =>
                  e.key === "Enter" && handleThumbClick(slide.id)
                }
              >
                <div className={classes.slider_thumb_wrapper}>
                  <img
                    src={slide.image}
                    className={classes.slider_thumb_img}
                    alt={`Color group ${slide.description}`}
                    loading="lazy"
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Divider text={t("shape")} />

        <Card className={classes.multi_select_wrapper}>
          <form ref={formRef} className={classes.grid_form}>
            {shapesData &&
              shapesData
                .sort((a, b) => a.priority - b.priority)
                .map((elem, i) => (
                  <div key={elem.id}>
                    {elem.image && (
                      <CustomSelect
                        title={`${i}`}
                        src={elem.image}
                        id={elem.id}
                        description={elem.description}
                        onClick={(e) => handleShapeClick(e, elem.id)}
                        isSelected={shapeFormEntries}
                      />
                    )}
                  </div>
                ))}
          </form>
        </Card>

        <Divider text={"Size mm"} />

        <Card className={classes.size_wrapper}>
          <form ref={sizeRef} className={classes.grid_form}>
            {sizeData?.length > 0 &&
              sizeData.map((elem) => (
                <SizeBox
                  value={`${elem.description}`}
                  key={elem.id}
                  id={elem.id}
                  onClick={(e) => handleSendDimensionsStatus(e, elem)}
                  isChecked={Object.keys(dimensionEntries).includes(
                    elem.id.toString()
                  )}
                />
              ))}
          </form>
          <button className={classes.reset_btn} onClick={handleResetSelections}>
            {t("reset_selections")}
          </button>
        </Card>

        <Card
          className={classes.products_result_wrapper}
          ref={productsWrapperRef}
        >
          {isFilteredProductsLoading ? (
            <LoadingSpinner />
          ) : (
            <>
              {memoizedProducts.length > 0 &&
                (windowSize === "m" ||
                windowSize === "l" ||
                windowSize === "xl" ? (
                  <ResultRow dataProp={memoizedProducts} />
                ) : (
                  <ResultMobile dataProps={memoizedProducts} />
                ))}
            </>
          )}
          {lastPage > 1 &&
            memoizedProducts.length > 0 &&
            itemIds.length === 0 && (
              <div
                className={classes.pagination_wrapper}
                style={{
                  alignSelf: lng === "fa" ? "flex-start" : "flex-end",
                  direction: lng === "fa" ? "rtl" : "ltr",
                }}
              >
                <p className={classes.pagination_text}>{t("page")} :</p>
                <PaginationComponent
                  count={lastPage}
                  page={page}
                  onChange={handlePaginationChange}
                  hideNextButton
                  hidePrevButton
                  variant="text"
                  className={classes.pagination_component}
                  size="small"
                  sx={{
                    "& .MuiPaginationItem-root": {
                      fontSize: "0.7rem",
                    },
                  }}
                />
              </div>
            )}
        </Card>
      </Body>
      <Footer />
    </div>
  );
};

export default SpecialStones;
