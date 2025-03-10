import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@mui/material';
import { KeyboardBackspace } from '@mui/icons-material';
import { useSelector } from 'react-redux';

import CustomSection from '../layout/CustomSection';
import SingleBlog from '../components/SingleBlog';

import classes from './Guid.module.css';
const Guid = ({ showMore }) => {
 const { t } = useTranslation();
 const lng = useSelector(state => state.localeStore.lng);
 return (
  <div>
   <CustomSection card={classes.card} className={classes.main}>
    <SingleBlog
     imgUrl={
      'https://images.pexels.com/photos/6757423/pexels-photo-6757423.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
     }
     title={'some title'}
     description={
      'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Doloribus, tenetur?'
     }
     href={'public/assets/pdf/Document.pdf'}
    />
    <SingleBlog
     imgUrl={
      'https://images.pexels.com/photos/6757423/pexels-photo-6757423.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
     }
     title={'some title'}
     description={
      'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Doloribus, tenetur?Lorem ipsum dolor sit amet, consectetur adipisicing elit. Doloribus, tenetur?Lorem ipsum dolor sit amet, consectetur adipisicing elit. Doloribus, tenetur?'
     }
     href={'Document.pdf'}
    />
   </CustomSection>
   <CustomSection>
    {showMore && (
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
