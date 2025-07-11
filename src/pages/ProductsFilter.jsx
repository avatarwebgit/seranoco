import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { Sort } from '@mui/icons-material';

import CategoryProductBox from '../components/category/CategoryProductBox';
import DesktopFilters from '../components/category/DesktopFilters';
import MobileFilters from '../components/category/MobileFilters';
import Breadcrumbs from '../components/common/Breadcrumbs';
import Body from '../components/filters_page/Body';
import Card from '../components/filters_page/Card';

import Footer from '../layout/Footer';
import Header from '../layout/Header';
import classes from './ProductsFilter.module.css';
const Category = ({ windowSize }) => {
 const { t } = useTranslation();
 console.log(classes);
 const lng = useSelector(state => state.localeStore.lng);
 return (
  <main className={`${classes.category} main`}>
   <Header windowSize={windowSize} />
   <Body>
    <Card className={classes.content} dir={lng === 'fa' ? 'rtl' : 'ltr'}>
     <Breadcrumbs
      linkDataProp={[
       { pathname: t('home'), url: ' ' },
       { pathname: t('categories'), url: 'category' },
      ]}
     />
     <div className={classes['wrapper']} dir={lng === 'fa' ? 'rtl' : 'ltr'}>
      <div className={classes['filter-list-wrapper']}>
       <DesktopFilters />
      </div>

      <div className={classes['list-wrapper']}>
       <div className={classes['sort-wrapper']}>
        <ul dir={lng === 'fa' ? 'rtl' : 'ltr'}>
         <li>
          <Sort fontSize='10' />
          <div>مرتب سازی:</div>
         </li>
         <li>
          <label>
           <input
            type='radio'
            name='sort-option'
            value='most-relevant'
            hidden
           />
           <div>مرتبط‌ترین</div>
          </label>
         </li>
         <li>
          <label>
           <input type='radio' name='sort-option' value='most-viewed' hidden />
           <div>پربازدیدترین</div>
          </label>
         </li>
         <li>
          <label>
           <input type='radio' name='sort-option' value='newest' hidden />
           <div>جدیدترین</div>
          </label>
         </li>
         <li>
          <label>
           <input type='radio' name='sort-option' value='best-selling' hidden />
           <div>پرفروش‌ترین‌</div>
          </label>
         </li>
         <li>
          <label>
           <input type='radio' name='sort-option' value='cheapest' hidden />
           <div>ارزان‌ترین</div>
          </label>
         </li>
         <li>
          <label>
           <input
            type='radio'
            name='sort-option'
            value='most-expensive'
            hidden
           />
           <div>گران‌ترین</div>
          </label>
         </li>
         <li>
          <label>
           <input
            type='radio'
            name='sort-option'
            value='fastest-delivery'
            hidden
           />
           <div>سریع‌ترین ارسال</div>
          </label>
         </li>
         <li>
          <label>
           <input
            type='radio'
            name='sort-option'
            value='buyers-choice'
            hidden
           />
           <div>پیشنهاد خریداران</div>
          </label>
         </li>
         <li>
          <label>
           <input type='radio' name='sort-option' value='featured' hidden />
           <div>منتخب</div>
          </label>
         </li>
        </ul>
       </div>
       <div className={classes['mobile-filter-wrapper']}>
        <MobileFilters />
       </div>
       <div className={classes['product-list-wrapper']}>
        {Array.from({ length: 10 }, (_, i) => {
         return (
          <CategoryProductBox src={'https://picsum.photos/id/237/500/500'} />
         );
        })}
       </div>
      </div>
     </div>
    </Card>
   </Body>
   <Footer />
  </main>
 );
};

export default Category;
