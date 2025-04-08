import Card from '../components/filters_page/Card';
import Breadcrumbs from '../components/common/Breadcrumbs';
import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { useSelector } from 'react-redux';
import classes from './MobileProfile.module.css';
import { useTranslation } from 'react-i18next';
import Ticket from '../components/account/Ticket';
import AccountInformaion from '../components/account/AccountInformaion';
import Favorites from '../components/account/Favorites';
import OrderStatus from '../components/account/OrderStatus';

const CustomTabPanel = props => {
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
};

function a11yProps(index) {
 return {
  id: `simple-tab-${index}`,
  'aria-controls': `simple-tabpanel-${index}`,
 };
}

export default function BasicTabs() {
 const [value, setValue] = React.useState(0);
 const { t } = useTranslation();
 const lng = useSelector(state => state.localeStore.lng);

 const handleChange = (event, newValue) => {
  setValue(newValue);
 };

 return (
  <Card className={classes.main_card}>
   <section className={classes.container}>
    <Box sx={{ width: '100%', padding: 0, mt: '2rem' }}>
     <Box sx={{ borderBottom: 1, borderColor: 'divider', padding: 0 }}>
      <Tabs
       value={value}
       onChange={handleChange}
       aria-label='basic tabs example'>
       <Tab label={t('profile.acc_info')} {...a11yProps(0)} />
       <Tab label={t('profile.favorites')} {...a11yProps(1)} />
       <Tab label={t('profile.order_status')} {...a11yProps(2)} />
       <Tab label={t('profile.ticket')} {...a11yProps(3)} />
      </Tabs>
     </Box>
     <CustomTabPanel value={value} index={0}>
      <div
       className={classes.detail_container}
       style={{ direction: lng === 'fa' ? 'rtl' : 'ltr' }}>
       <AccountInformaion />
      </div>
     </CustomTabPanel>
     <CustomTabPanel value={value} index={1}>
      <div
       className={classes.detail_container}
       style={{ direction: lng === 'fa' ? 'rtl' : 'ltr' }}>
       <Favorites />
      </div>
     </CustomTabPanel>
     <CustomTabPanel value={value} index={2}>
      <div
       className={classes.detail_container}
       style={{ direction: lng === 'fa' ? 'rtl' : 'ltr' }}>
       <OrderStatus />
      </div>
     </CustomTabPanel>
     <CustomTabPanel value={value} index={3}>
      <div
       className={classes.detail_container}
       style={{ direction: lng === 'fa' ? 'rtl' : 'ltr' }}>
       <Ticket />
      </div>
     </CustomTabPanel>
    </Box>
   </section>
  </Card>
 );
}
