import Slider from '../../components/common/Slider';
import MobileDropDown from '../common/MobileDropDown';
import classes from './MobileFilters.module.css';

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

const dropdownComponents = [
 <MobileDropDown
  key='filter1'
  type={'checkbox'}
  checkBoxOptions={items.options}
  title={items.title}
  isStickyContent={true}
 />,
 <MobileDropDown
  key='price1'
  type={'price'}
  priceOptions={[60000000, 10000]}
  title={'قیمت'}
  isStickyContent={true}
 />,
 <MobileDropDown
  key='color1'
  type={'color'}
  colorsOptions={colorItems.options}
  title={colorItems.title}
  isStickyContent={true}
 />,
 <MobileDropDown
  key='filter2'
  type={'switch'}
  title={'تحویل فوری'}
  isStickyContent={true}
 />,
 <MobileDropDown
  key='filter3'
  type={'checkbox'}
  checkBoxOptions={items.options}
  title={items.title}
  isStickyContent={true}
 />,
 <MobileDropDown
  key='filter4'
  type={'checkbox'}
  checkBoxOptions={items.options}
  title={items.title}
  isStickyContent={true}
 />,
 <MobileDropDown
  key='filter5'
  type={'checkbox'}
  checkBoxOptions={items.options}
  title={items.title}
  isStickyContent={true}
 />,
 <MobileDropDown
  key='filter6'
  type={'checkbox'}
  checkBoxOptions={items.options}
  title={items.title}
  isStickyContent={true}
 />,
 <MobileDropDown
  key='filter7'
  type={'checkbox'}
  checkBoxOptions={items.options}
  title={items.title}
  isStickyContent={true}
 />,
];

const MobileFilters = () => {
 return (
  <div className={classes['slider-main']}>
   <div className={classes['slider-wrapper']}>
    <div className={classes['slider-sheet']}>
     <MobileDropDown
      key='filter1'
      type={'checkbox'}
      checkBoxOptions={items.options}
      title={items.title}
      isStickyContent={true}
     />

     <MobileDropDown
      key='price1'
      type={'price'}
      priceOptions={[60000000, 10000]}
      title={'قیمت'}
      isStickyContent={true}
     />

     <MobileDropDown
      key='color1'
      type={'color'}
      colorsOptions={colorItems.options}
      title={colorItems.title}
      isStickyContent={true}
     />

     <MobileDropDown
      key='filter2'
      type={'checkbox'}
      checkBoxOptions={items.options}
      title={items.title}
      isStickyContent={true}
     />

     <MobileDropDown
      key='filter3'
      type={'checkbox'}
      checkBoxOptions={items.options}
      title={items.title}
      isStickyContent={true}
     />

     <MobileDropDown
      key='filter4'
      type={'checkbox'}
      checkBoxOptions={items.options}
      title={items.title}
      isStickyContent={true}
     />

     <MobileDropDown
      key='filter5'
      type={'checkbox'}
      checkBoxOptions={items.options}
      title={items.title}
      isStickyContent={true}
     />

     <MobileDropDown
      key='filter6'
      type={'checkbox'}
      checkBoxOptions={items.options}
      title={items.title}
      isStickyContent={true}
     />

     <MobileDropDown
      key='filter7'
      type={'checkbox'}
      checkBoxOptions={items.options}
      title={items.title}
      isStickyContent={true}
     />
    </div>
   </div>
  </div>
 );
};

export default MobileFilters;
