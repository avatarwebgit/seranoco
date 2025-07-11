import { ExpandLess, ExpandMore } from '@mui/icons-material';
import {
 Box,
 IconButton,
 Menu,
 MenuItem,
 Slider,
 TextField,
 Tooltip,
 Typography,
} from '@mui/material';
import { Switch } from 'antd';
import { useCallback, useEffect, useState } from 'react';

import classes from './MobileDropDown.module.css';
const MobileDropDown = ({
 title,
 type,
 checkBoxOptions,
 priceOptions,
 colorsOptions,
 onChange,
 removeFilters,
}) => {
 const [anchorEl, setAnchorEl] = useState(null);
 const [checkedItems, setCheckedItems] = useState([]);
 const [selectedColors, setSelectedColors] = useState([]);
 const [switchActive, setSwitchActive] = useState(false);
 const [sliderValue, setSliderValue] = useState([0, 0]);
 const [isFilterActive, setIsFilterActive] = useState(false);

 const open = Boolean(anchorEl);
 const lng = 'fa';

 const handleClick = event => {
  setAnchorEl(event.currentTarget);
 };

 const handleClose = () => {
  setAnchorEl(null);
 };

 const handleValueChange = useCallback(
  value => {
   if (onChange) {
    onChange(value);
   }
  },
  [onChange],
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
 }, [checkedItems, selectedColors, sliderValue, priceOptions, type]);

 useEffect(() => {
  setCheckedItems([]);
  setSelectedColors([]);
  setSliderValue(priceOptions);
  setSwitchActive(false);
 }, [removeFilters, priceOptions]);

 const renderMenuContent = () => {
  switch (type) {
   case 'checkbox':
    return (
     <Box sx={{ p: 2 }}>
      {checkBoxOptions.map(option => (
       <MenuItem onClick={() => handleCheckboxClick(option.id)}>
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
       </MenuItem>
      ))}
     </Box>
    );
   case 'price':
    return (
     <Box sx={{ p: 2 }}>
      <TextField
       fullWidth
       label='شروع قیمت'
       value={formatDisplayValue(sliderValue[0])}
       onChange={e => handleInputChange(0, e.target.value)}
       margin='normal'
      />
      <TextField
       fullWidth
       label='تا'
       value={formatDisplayValue(sliderValue[1])}
       onChange={e => handleInputChange(1, e.target.value)}
       margin='normal'
      />
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
     </Box>
    );
   case 'color':
    return (
     <Box
      sx={{
       p: 2,
       display: 'grid',
       gridTemplateColumns: 'repeat(4, 1fr)',
       gap: 1,
      }}>
      {colorsOptions.map(option => (
       <Tooltip key={option.id} title={option.color}>
        <IconButton
         onClick={() => handleColorClick(option.id)}
         sx={{
          border: selectedColors.includes(option.id)
           ? '2px solid #000'
           : '1px solid #ddd',
          p: 0.5,
          borderRadius: 1,
         }}>
         <Box
          sx={{
           width: 30,
           height: 30,
           borderRadius: 1,
           background: option.hex,
           backgroundImage: option.image ? `url(${option.image})` : undefined,
           backgroundSize: 'cover',
          }}
         />
        </IconButton>
       </Tooltip>
      ))}
     </Box>
    );
   default:
    return null;
  }
 };

 return (
  <Box sx={{ display: 'inline-block', m: 1, width: '150px' }}>
   <Box
    sx={{
     display: 'flex',
     alignItems: 'center',
     border: '1px solid #ddd',
     borderRadius: '20px',
     p: 1,
     position: 'relative',
     bgcolor: isFilterActive ? 'rgba(25, 118, 210, 0.08)' : 'inherit',
    }}>
    <Typography variant='body1' sx={{ px: 1 }}>
     {title}
    </Typography>
    {type !== 'switch' ? (
     <IconButton onClick={handleClick} size='small' sx={{ ml: 'auto' }}>
      {open ? <ExpandLess /> : <ExpandMore />}
     </IconButton>
    ) : (
     <Switch
      checked={switchActive}
      onClick={toggleSwitch}
      size='small'
      className={classes.switch}
     />
    )}
   </Box>

   <Menu
    anchorEl={anchorEl}
    open={open}
    onClose={handleClose}
    anchorOrigin={{
     vertical: 'bottom',
     horizontal: 'left',
    }}
    transformOrigin={{
     vertical: 'top',
     horizontal: 'left',
    }}
    slotProps={{
     paper: {
      sx: {
       width: 300,
       height: 'fit-content',
       overflow: 'auto',
       mt: 1,
      },
     },
    }}
    disableScrollLock={true}>
    {renderMenuContent()}
   </Menu>
  </Box>
 );
};

export default MobileDropDown;
