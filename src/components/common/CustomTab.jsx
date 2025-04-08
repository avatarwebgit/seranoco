import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';

import { nanoid } from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';

import classes from './CustomTab.module.css';
import { useTranslation } from 'react-i18next';
function CustomTabPanel(props) {
 const { children, value, index, ...other } = props;

 return (
  <div
   role='tabpanel'
   hidden={value !== index}
   id={`product-tabpanel-${index}`}
   aria-labelledby={`simple-tab-${index}`}
   {...other}>
   {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
  </div>
 );
}

function a11yProps(index) {
 return {
  id: `products-tab-${index}`,
  'aria-controls': `product-tabpanel-${index}`,
 };
}

export default function BasicTabs({ dataProp }) {
 const [value, setValue] = React.useState(0);
 const [data, setData] = React.useState(null);

 const { t } = useTranslation();

 const lng = useSelector(state => state.localeStore.lng);

 React.useEffect(() => {
  if (dataProp) {
   setData(dataProp);
  }
 }, [dataProp]);

 const handleChange = (event, newValue) => {
  setValue(newValue);
 };

 return (
  <Box sx={{ width: '100%', padding: 0, mt: '2rem' }}>
   <Box sx={{ borderBottom: 1, borderColor: 'divider', padding: 0 }}>
    <Tabs value={value} onChange={handleChange} aria-label='basic tabs example'>
     <Tab label={t('more_info')} {...a11yProps(0)} />
     <Tab label={t('description')} {...a11yProps(1)} />
    </Tabs>
   </Box>
   <CustomTabPanel value={value} index={0}>
    <div
     className={classes.detail_container}
     style={{
      direction: lng === 'fa' ? 'rtl' : 'ltr',
      width: '40vw',
      minWidth: '300px',
     }}>
     {data && (
      <>
       {data.product.attribute.map(el => {
        return (
         <span key={nanoid()}>
          <p
           style={{
            textAlign: lng === 'fa' ? 'left' : 'right',
            width: '80%',
           }}>
           <strong style={{ fontSize: '.5rem' }}>
            {lng === 'fa' ? el.attribute.name_fa : el.attribute.name}&nbsp;:
           </strong>
          </p>

          <p
           style={{
            textAlign: lng === 'fa' ? 'right' : 'left',
            margin: '0 20px',
           }}>
           {lng === 'fa' ? el.value.name_fa : el.value.name}
          </p>
         </span>
        );
       })}
      </>
     )}
    </div>
   </CustomTabPanel>
   <CustomTabPanel value={value} index={1}>
    <div
     className={classes.detail_container}
     style={{
      direction: lng === 'fa' ? 'rtl' : 'ltr',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
     }}>
     {data &&
      (lng === 'fa' ? (
       <div
        dangerouslySetInnerHTML={{ __html: data.product.description_fa }}
        className={classes.text_html}
       />
      ) : (
       <div
        dangerouslySetInnerHTML={{ __html: data.product.description }}
        className={classes.text_html}
       />
      ))}
    </div>
   </CustomTabPanel>
  </Box>
 );
}
