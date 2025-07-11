import { useTranslation } from 'react-i18next';

import DropDown from '../common/DropDown';

import { useState } from 'react';
import classes from './DesktopFilters.module.css';
import { useSelector } from 'react-redux';

const items = {
 title: 'فیلتر',
 options: [
  { id: 1, name: 'لپتاپ' },
  { id: 2, name: 'تلفن همراه' },
  { id: 3, name: 'هدفون' },
  { id: 4, name: 'صفحه کلید' },
  { id: 5, name: 'ماوس' },
  { id: 6, name: 'مانیتور' },
  { id: 7, name: 'تبلت' },
  { id: 8, name: 'ساعت هوشمند' },
  { id: 9, name: 'دوربین' },
  { id: 10, name: 'بلندگو' },
 ],
};

const colorItems = {
 title: 'رنگ ها',
 options: [
  {
   id: 1,
   color: 'قرمز',
   hex: '#FF0000',
   image: 'https://picsum.photos/id/237/500/500',
  },
  { id: 2, color: 'آبی', hex: '#0000FF' },
  { id: 3, color: 'سبز', hex: '#00FF00' },
  { id: 4, color: 'زرد', hex: '#FFFF00' },
  { id: 5, color: 'بنفش', hex: '#800080' },
  { id: 6, color: 'نارنجی', hex: '#FFA500' },
  { id: 7, color: 'صورتی', hex: '#FFC0CB' },
  { id: 8, color: 'قهوه‌ای', hex: '#A52A2A' },
  { id: 9, color: 'سفید', hex: '#FFFFFF' },
  { id: 10, color: 'مشکی', hex: '#000000' },
 ],
};
const DesktopFilters = () => {
 const [removePointer, setRemovePointer] = useState(false);

 const { t } = useTranslation();
 const lng = useSelector(state => state.localeStore.lng);

 const handleRemoveFilters = () => {
  // remove filter logic
  setRemovePointer(!removePointer);
 };

 return (
  <div className={classes.filters} dir={lng === 'fa' ? 'rtl' : 'ltr'}>
   <div className={classes['filters-header']}>
    <h5>{t('filters')}</h5>
    <button onClick={handleRemoveFilters}>{t('remove filters')}</button>
   </div>
   <DropDown
    type={'checkbox'}
    checkBoxOptions={items.options}
    title={items.title}
    onChange={value => console.log(value)}
    removeFilters={removePointer}
   />
   <DropDown
    type={'color'}
    colorsOptions={colorItems.options}
    title={colorItems.title}
    onChange={value => console.log(value)}
    removeFilters={removePointer}
   />
   <DropDown
    type={'price'}
    title={'قیمت'}
    priceOptions={[40000000, 10000]}
    onChange={value => console.log(value)}
    removeFilters={removePointer}
   />

   <DropDown
    type={'switch'}
    title={'تحویل در محل'}
    onChange={value => console.log(value)}
    removeFilters={removePointer}
   />
   <DropDown
    type={'checkbox'}
    checkBoxOptions={items.options}
    title={items.title}
   />
   <DropDown
    type={'checkbox'}
    checkBoxOptions={items.options}
    title={items.title}
   />
   <DropDown
    type={'checkbox'}
    checkBoxOptions={items.options}
    title={items.title}
   />
   <DropDown
    type={'checkbox'}
    checkBoxOptions={items.options}
    title={items.title}
   />
  </div>
 );
};

export default DesktopFilters;
