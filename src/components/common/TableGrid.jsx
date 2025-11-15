import React, { useEffect, useState } from "react";
import { nanoid } from "@reduxjs/toolkit";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import LoadingSpinner from "./LoadingSpinner";

import { productDetailActions } from "../../store/store";

import classes from "./TableGrid.module.css";
const TableGrid = ({
  dataProp,
  sizeProp,
  selectedSizeProp,
  isLoadingData,
  isSmall,
}) => {
  const [data, setData] = useState(null);
  const [sizeData, setSizeData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [tableWidthPerItem, setTableWidthPerItem] = useState(10);

  const selectedItems = useSelector((state) => state.detailsStore.itemIds);
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const lng = useSelector((state) => state.localeStore.lng);

  console.log(selectedSizeProp, sizeData);


  useEffect(() => {
    setIsLoading(isLoadingData);
    if (dataProp) {
      setData(dataProp);
      if (selectedSizeProp.length > 0) {
        setSizeData(
          selectedSizeProp.sort((a, b) => {
            const sizeA = parseSizeDescription(a.description);
            const sizeB = parseSizeDescription(b.description);
            return compareSizeArrays(sizeA, sizeB);
          })
        );
      } else if (selectedSizeProp.length === 0 && sizeProp.length > 0) {
        setSizeData(
          sizeProp.sort((a, b) => {
            const sizeA = parseSizeDescription(a.description);
            const sizeB = parseSizeDescription(b.description);
            return compareSizeArrays(sizeA, sizeB);
          })
        );
      }
    }
  }, [dataProp, selectedSizeProp, sizeProp, isLoadingData]);

  // Function to parse the size description into an array of numbers for comparison
  const parseSizeDescription = (description) => {
    // Remove non-numeric characters (e.g., 'mm', 'x', etc.) and split by 'x' or space
    const numericValues = description
      .replace(/[^\d\.x]/g, "") // Remove non-numeric characters except for numbers and 'x'
      .split("x") // Split by 'x' if it's a multi-component size
      .map((value) => parseFloat(value.trim())) // Convert to float
      .filter((value) => !isNaN(value)); // Remove any NaN values

    return numericValues;
  };

  // Function to compare two size arrays numerically
  const compareSizeArrays = (sizeA, sizeB) => {
    const maxLength = Math.max(sizeA.length, sizeB.length);
    for (let i = 0; i < maxLength; i++) {
      const aVal = sizeA[i] || 0; // Default to 0 if the size array is shorter
      const bVal = sizeB[i] || 0;
      if (aVal !== bVal) {
        return aVal - bVal; // Sort in ascending order
      }
    }
    return 0; // If sizes are equal
  };


  useEffect(() => {
    if (isSmall) {
      setTableWidthPerItem(20);
    } else {
      setTableWidthPerItem(10);
    }
  }, [isSmall]);

  const handleCheckboxChange = (color, size, id, isChecked, item) => {
    setIsLoading(true);
    if (isChecked) {
      dispatch(productDetailActions.addItem(id));
    } else {
      dispatch(productDetailActions.removeItem(id));
    }
  };

  const getAvailabilityLabel = (isNotAvailable, quantity) => {
    if (isNotAvailable === 1) {
      return t("newpage.notav");
    } else if (quantity > 0) {
      return t("available");
    } else {
      return t("byorder");
    }
  };

  return (
    <div className={classes.main}>
      {data && data.length > 0 && (
        <table
          className={classes.table}
          style={{ width: `${Object.keys(data).length * tableWidthPerItem}%` }}
        >
          <thead>
            <tr className={classes.tr}>
              <th className={`${classes.th} ${classes.image_wrapper}`}>
                <img
                  className={classes.img}
                  src={""}
                  style={{ visibility: "hidden" }}
                />
                <p>{t("size")}</p>
              </th>
              {data.map((el) => {
                return (
                  <th
                    className={`${classes.th} ${classes.image_wrapper}`}
                    key={Object.values(el)[0][0].id}
                  >
                    <img
                      className={classes.img}
                      src={Object.values(el)[0][0].image}
                      loading="lazy"
                      alt=""
                    />
                    <p>
                      {lng === "en"
                        ? Object.values(el)[0][0].color
                        : Object.values(el)[0][0].color_fa}
                    </p>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className={classes.tbody}>
            {isLoading && (
              <tr className={classes.backdrop}>
                <LoadingSpinner size={"50px"} />
              </tr>
            )}
            {sizeData &&
              [...sizeData].map((size, index) => (
                <tr
                  className={classes.tr}
                  key={index}
                  style={{ opacity: isLoading ? 0.3 : 1 }}
                >
                  <td className={`${classes.td} ${classes.size_data}`}>
                    {size.description}
                  </td>
                  {data.map((el) => {
                    const color = Object.keys(el)[0];
                    const item = el[color]?.find(
                      (item) => item.size === size.description
                    );
                    const availabilityLabel = item
                      ? getAvailabilityLabel(
                          item.is_not_available,
                          item.quantity
                        )
                      : t("newpage.notav");
                    const id = `${color}-${size.description}-${
                      item?.alias || "unknown"
                    }`;

                    return (
                      <td key={id} className={classes.td}>
                        {(() => {
                          if (
                            availabilityLabel === t("available") ||
                            availabilityLabel === t("byorder")
                          ) {
                            return (
                              <span
                                style={{
                                  backgroundColor:
                                    availabilityLabel === t("available")
                                      ? "#4bd14b"
                                      : "#8181fc",
                                }}
                              >
                                <input
                                  type="checkbox"
                                  name={id}
                                  id={id}
                                  checked={selectedItems.includes(item?.id)}
                                  onChange={(e) =>
                                    handleCheckboxChange(
                                      color,
                                      size.description,
                                      item?.id || "",
                                      e.target.checked,
                                      item
                                    )
                                  }
                                />
                                <label
                                  htmlFor={id}
                                  className={`${classes.available} ${classes.label}`}
                                >
                                  {availabilityLabel}
                                </label>
                              </span>
                            );
                          } else {
                            return (
                              <button className={classes.outOfStock}>
                                {availabilityLabel}
                              </button>
                            );
                          }
                        })()}
                      </td>
                    );
                  })}
                </tr>
              ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TableGrid;
