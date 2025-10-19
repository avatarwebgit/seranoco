import React from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import classes from "./DeliveryMethod.module.css";
import { formatNumber } from "../../utils/helperFunctions";

const DeliveryMethod = ({
  icon: Icon,
  name,
  time,
  cost,
  value,
  selectedValue,
  onChange,
}) => {
  const isSelected = selectedValue === value;
  const { t } = useTranslation();
  const lng = useSelector((state) => state.localeStore.lng);
  const euro = useSelector((state) => state.cartStore.euro);

  const handleSelect = () => {
    onChange(value, cost);
  };

  return (
    <div
      className={`${classes.methodCard} ${isSelected ? classes.selected : ""}`}
      onClick={handleSelect}
      role="radio"
      aria-checked={isSelected}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") handleSelect();
      }}
    >
      <div className={classes.iconWrapper}>
        <Icon />
      </div>
      <div className={classes.details}>
        <span className={classes.name}>{name}</span>
        <span className={classes.time}>{time}</span>
      </div>
      <div className={classes.cost}>
        {lng === "fa" ? formatNumber(cost * euro) : cost.toFixed(2)}{" "}
        {t("m_unit")}
      </div>
    </div>
  );
};

export default DeliveryMethod;
