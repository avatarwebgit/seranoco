import { Add } from '@mui/icons-material';
import { Slider } from '@mui/joy';
import { IconButton, Tooltip } from '@mui/material';
import { Switch } from 'antd';
import { motion } from 'framer-motion';
import { useCallback, useEffect, useState } from 'react';
import classes from './DropDown.module.css';
import { useSelector } from 'react-redux';

const DropDown = ({
 title,
 type,
 checkBoxOptions,
 priceOptions,
 colorsOptions,
 onChange,
 removeFilters,
}) => {
 const [isExpaned, setIsExpaned] = useState(false);
 const [checkedItems, setCheckedItems] = useState([]);
 const [selectedColors, setSelectedColors] = useState([]);
 const [switchActive, setSwitchActive] = useState(false);
 const [sliderValue, setSliderValue] = useState([0, 0]);
 const [isFilterActive, setIsFilterActive] = useState(false);

 const lng = useSelector(state => state.localeStore.lng);

 const intialWrapper = {
  height: isExpaned ? 'auto' : 0,
  margin: isExpaned ? '10px 0' : 0,
 };

 const animateWrapper = {
  height: isExpaned ? 'auto' : 0,
  margin: isExpaned ? '10px 0' : 0,
 };

 const handleValueChange = useCallback(
  value => {
   if (onChange) {
    onChange(value);
   }
  },
  [type, onChange],
 );

 const handleCheckboxClick = useCallback(
  id => {
   setCheckedItems(prev => {
    const newItems = prev.includes(id)
     ? prev.filter(el => el !== id)
     : [...prev, id];
    handleValueChange(newItems);
    return newItems;
   });
  },
  [handleValueChange],
 );

 const handleColorClick = useCallback(
  id => {
   setSelectedColors(prev => {
    const newItems = prev.includes(id)
     ? prev.filter(el => el !== id)
     : [...prev, id];
    handleValueChange(newItems);
    return newItems;
   });
  },
  [handleValueChange],
 );

 const toggleSwitch = useCallback(() => {
  setSwitchActive(prev => {
   handleValueChange(!prev);
   return !prev;
  });
 }, [handleValueChange]);

 const persianToEnglish = persianNumber => {
  return persianNumber
   .toString()
   .replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d));
 };

 const formatDisplayValue = value => {
  if (lng === 'en') return value;
  return new Intl.NumberFormat('fa-IR').format(value);
 };

 const handleInputChange = useCallback(
  (index, value) => {
   const englishValue = persianToEnglish(value.replace(/[^۰-۹0-9]/g, ''));
   const numericValue = parseInt(englishValue) || 0;
   const clampedValue = Math.min(
    Math.max(numericValue, priceOptions[0]),
    priceOptions[1],
   );

   setSliderValue(prev => {
    const newSliderValue = [...prev];
    newSliderValue[index] = clampedValue;

    if (index === 0 && newSliderValue[0] > newSliderValue[1]) {
     newSliderValue[1] = newSliderValue[0];
    } else if (index === 1 && newSliderValue[1] < newSliderValue[0]) {
     newSliderValue[0] = newSliderValue[1];
    }

    handleValueChange(newSliderValue);
    return newSliderValue;
   });
  },
  [priceOptions, handleValueChange],
 );

 const handleSliderChange = useCallback(
  (event, newValue, activeThumb) => {
   if (!Array.isArray(newValue)) return;
   if (newValue[1] === newValue[0]) return;

   setSliderValue(prev => {
    let updatedValue;

    if (newValue[1] - newValue[0] < 0) {
     if (activeThumb === 0) {
      updatedValue = [Math.min(newValue[0], prev[1]), prev[1]];
     } else {
      updatedValue = [prev[0], Math.max(newValue[1], prev[0])];
     }
    } else {
     updatedValue = newValue;
    }

    handleValueChange(updatedValue);
    return updatedValue;
   });
  },
  [handleValueChange],
 );

 const renderCheckBoxOptions = useCallback(() => {
  if (type === 'checkbox') {
   return (
    <div className={classes['checkbox-wrapper']}>
     {checkBoxOptions.map(option => (
      <div
       key={option.id}
       className={`${classes['checkbox-input-wrapper']} ${classes.rtl}`}>
       <label htmlFor={`checkbox-${option.id}`}>{option.name}</label>
       <input
        type='checkbox'
        name={`checkbox-${option.id}`}
        id={`checkbox-${option.id}`}
        checked={checkedItems.includes(option.id)}
        onChange={() => handleCheckboxClick(option.id)}
        hidden
       />
       <div
        className={`${classes['custom-checkbox']} ${
         checkedItems.includes(option.id) ? classes.checked : ''
        }`}
        onClick={() => handleCheckboxClick(option.id)}
       />
      </div>
     ))}
    </div>
   );
  }
 }, [type, checkBoxOptions, checkedItems, handleCheckboxClick]);

 useEffect(() => {
  if (type === 'checkbox' && checkedItems.length > 0)
   return setIsFilterActive(true);
  if (type === 'color' && selectedColors.length > 0)
   return setIsFilterActive(true);
  if (
   type === 'price' &&
   JSON.stringify(priceOptions) !== JSON.stringify(sliderValue)
  )
   return setIsFilterActive(true);
  setIsFilterActive(false);
 }, [checkedItems, selectedColors, switchActive, sliderValue, priceOptions]);

 useEffect(() => {
  setCheckedItems([]);
  setSelectedColors([]);
  setSliderValue(priceOptions?.sort((a, b) => a - b));
  setSwitchActive(false);
 }, [removeFilters]);

 const renderPriceOptions = useCallback(() => {
  if (type === 'price') {
   return (
    <div className={classes['checkbox-price']}>
     <div className={classes['input-wrapper']}>
      <label htmlFor='price-from'>شروع قیمت</label>
      <span>
       <input
        type='text'
        id='price-from'
        name='price-from'
        value={formatDisplayValue(sliderValue[0])}
        onChange={e => handleInputChange(0, e.target.value)}
        dir='ltr'
       />
       تومان
      </span>
     </div>
     <div className={classes['input-wrapper']}>
      <label htmlFor='price-to'>تا</label>
      <span>
       <input
        type='text'
        id='price-to'
        name='price-to'
        value={formatDisplayValue(sliderValue[1])}
        onChange={e => handleInputChange(1, e.target.value)}
        dir='ltr'
       />
       تومان
      </span>
     </div>
     <Slider
      value={sliderValue}
      min={Math.min(priceOptions[0], priceOptions[1])}
      max={Math.max(priceOptions[0], priceOptions[1])}
      onChange={handleSliderChange}
      valueLabelDisplay='auto'
      valueLabelFormat={value => formatDisplayValue(value)}
      sx={{ width: '90%', margin: '20px auto 0 auto' }}
      disableSwap={true}
     />
    </div>
   );
  }
 }, [type, sliderValue, priceOptions, handleInputChange, handleSliderChange]);

 const renderColorOptions = useCallback(() => {
  if (type === 'color') {
   return (
    <div className={classes['checkbox-color']}>
     {colorsOptions.map(option => (
      <Tooltip
       key={option.id}
       title={option.color}
       arrow
       placement='top'
       slotProps={{
        tooltip: { sx: { fontSize: '10px' } },
        arrow: { sx: { fontSize: '10px' } },
       }}>
       <div
        className={`${classes['color-wrapper']} ${
         selectedColors.includes(option.id) ? classes['color-active'] : ''
        }`}>
        <div className={`${classes['color-input-wrapper']} ${classes.rtl}`}>
         <input
          type='color'
          name={`color-${option.id}`}
          id={`color-${option.id}`}
          checked={selectedColors.includes(option.id)}
          onChange={() => handleColorClick(option.id)}
          hidden
         />
         <div
          className={`${classes['custom-color']}`}
          style={{
           background: option.image ? `url(${option.image})` : option.hex,
           backgroundColor: option.hex,
          }}
          onClick={() => handleColorClick(option.id)}
         />
        </div>
       </div>
      </Tooltip>
     ))}
    </div>
   );
  }
 }, [type, colorsOptions, selectedColors, handleColorClick]);

 useEffect(() => {
  if (priceOptions) {
   setSliderValue(priceOptions);
   if (onChange) {
    onChange({
     type: 'price',
     value: priceOptions,
    });
   }
  }
 }, [priceOptions, onChange]);

 return (
  <div className={classes['drop-down-main']} dir={lng === 'fa' ? 'rtl' : 'ltr'}>
   <div className={`${classes['drop-down-header']}`}>
    <div className={`${isFilterActive ? classes['active-filter'] : null}`}>
     {title}
    </div>

    {type !== 'switch' ? (
     <IconButton
      onClick={() => setIsExpaned(!isExpaned)}
      size='small'
      disableRipple={true}>
      {<Add />}
     </IconButton>
    ) : (
     <Switch
      checked={switchActive}
      onClick={toggleSwitch}
      size='small'
      className={classes.switch}
     />
    )}
   </div>
   <motion.div
    className={`${classes['drop-down-options_wrapper']}`}
    initial={intialWrapper}
    animate={animateWrapper}>
    {checkBoxOptions && renderCheckBoxOptions()}
    {colorsOptions && renderColorOptions()}
    {priceOptions && renderPriceOptions()}
   </motion.div>
  </div>
 );
};

export default DropDown;
