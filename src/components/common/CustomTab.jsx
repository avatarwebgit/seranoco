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
   id={`simple-tabpanel-${index}`}
   aria-labelledby={`simple-tab-${index}`}
   {...other}>
   {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
  </div>
 );
}

function a11yProps(index) {
 return {
  id: `simple-tab-${index}`,
  'aria-controls': `simple-tabpanel-${index}`,
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
      width: '50vw',
      minWidth: '300px',
     }}>
     {data && (
      <>
       {data.product.attribute.map(el => {
        return (
         <span key={nanoid()}>
          <p style={{ textAlign: lng === 'fa' ? 'right' : 'left' }}>
           {lng === 'fa' ? el.attribute.name_fa : el.attribute.name}
          </p>
          <p style={{ textAlign: lng === 'fa' ? 'right' : 'left' }}>
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
     style={{ direction: lng === 'fa' ? 'rtl' : 'ltr' }}>
     {data &&
      (lng === 'fa' ? (
       <div dangerouslySetInnerHTML={{ __html: data.product.description_fa }} />
      ) : (
       <div dangerouslySetInnerHTML={{ __html: data.product.description }} />
      ))}
    </div>
   </CustomTabPanel>
  </Box>
 );
}
