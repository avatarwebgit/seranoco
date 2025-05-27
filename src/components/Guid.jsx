import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@mui/material';
import { KeyboardBackspace } from '@mui/icons-material';
import { useSelector } from 'react-redux';

import { getAllArticles } from '../services/api';
import CustomSection from '../layout/CustomSection';
import SingleBlog from '../components/SingleBlog';

import classes from './Guid.module.css';
const Guid = ({ showMore = true, isHomePage = false }) => {
 const [allArticlesData, setAllArticlesData] = useState([]);
 const { t } = useTranslation();
 const lng = useSelector(state => state.localeStore.lng);

 const getAll = async () => {
  const serverRes = await getAllArticles();
  setAllArticlesData(serverRes.result.data.articles.data);
 };

 useEffect(() => {
  getAll();
 }, []);

 return (
  <div>
   <CustomSection card={classes.card} className={classes.main}>
    {allArticlesData.map((el, i) => {
     if (isHomePage && i >= 3) return;
     return (
      <SingleBlog
       imgUrl={el.image}
       title={lng === 'fa' ? el.title : el.title_en}
       description={lng === 'fa' ? el.shortDescription : el.shortDescription_en}
       href={`/${lng}/blog/${el.alias}`}
       key={i}
      />
     );
    })}
   </CustomSection>
   <CustomSection>
    {isHomePage && (
     <Button
      className={classes.more_button}
      href={`/${lng}/blog`}
      endIcon={<KeyboardBackspace style={{ transform: 'rotate(180deg)' }} />}>
      {t('more')}
     </Button>
    )}
   </CustomSection>
  </div>
 );
};

export default Guid;
