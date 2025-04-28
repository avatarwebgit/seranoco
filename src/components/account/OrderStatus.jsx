import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
 Radio,
 RadioGroup,
 FormControl,
 FormControlLabel,
 FormLabel,
 CircularProgress,
} from '@mui/material';
import Wrapper from './Wrapper';
import OrderHistory from './orders/OrderHistory';
import Body from '../filters_page/Body';
import Card from '../filters_page/Card';
import {
 getOrderByStatus,
 getOrders,
 getOrdersStatus,
} from '../../services/api';
import classes from './OrderStatus.module.css';
import { useSelector } from 'react-redux';
import { Typography } from 'antd';

const OrderStatus = () => {
 const [orders, setOrders] = useState([]);
 const [orderStatus, setOrderStatus] = useState([]);
 const [selectedOption, setSelectedOption] = useState('');

 const { t } = useTranslation();

 const token = useSelector(state => state.userStore.token);
 const lng = useSelector(state => state.localeStore.lng);

 const handleFetchOrders = async () => {
  const serverRes = await getOrders(token);
     setOrders(serverRes.result.orders);
 };

 const handleFetchOrdersStatus = async () => {
  const serverRes = await getOrdersStatus(token);
  setOrderStatus(serverRes.result.status);
 };

 const handleFetchOrdersByStatus = async status => {
  const serverRes = await getOrderByStatus(token, status);
  setOrders(serverRes.result.orders);
 };

 useEffect(() => {
  handleFetchOrders();
  handleFetchOrdersStatus();
 }, []);

 const handleRadioChange = async e => {
  const selectedValue = e.target.value;
  setSelectedOption(selectedValue);
  handleFetchOrdersByStatus(selectedValue);
 };

 useEffect(() => {
  console.log(selectedOption);
 }, [selectedOption]);

 return (
  <section className={classes.main}>
   <Body>
    <Card>
     <Wrapper>
      <div className={classes.filters_wrapper}>
       <form>
        <FormControl
         component='fieldset'
         fullWidth
         className={classes.form_wrapper}>
         <FormLabel component='legend'>{t('select_a_filter')}</FormLabel>
         <RadioGroup
          aria-label='options'
          name='options'
          value={selectedOption}
          sx={{ display: 'flex', flexDirection: 'row', margin: '20px 0' }}
          onChange={handleRadioChange}>
          {orderStatus.map(status => {
           return (
            <FormControlLabel
             value={status.id}
             key={status.id}
             control={<Radio size='small' />}
             label={
              <Typography component='span' sx={{ fontSize: '0.8rem' }}>
               {lng === 'fa' ? status.title : status.title_en}
              </Typography>
             }
            />
           );
          })}
         </RadioGroup>
        </FormControl>
       </form>
      </div>

      <table className={classes.table}>
       <thead>
        <tr className={classes.tr}>
         <th className={classes.th}>{t('orders.no')}</th>
         <th className={classes.th}>{t('orders.orderno')}</th>
         <th className={classes.th}>{t('orders.status')}</th>
         <th className={classes.th}>{t('ticket.show')}</th>
         <th className={classes.th}>{t('orders.price')}</th>
         <th className={classes.th}>{t('orders.date')}</th>
        </tr>
       </thead>
       <tbody>
        {orders.map((order, i) => {
         return <OrderHistory dataProp={order} key={order.id} number={i} />;
        })}
       </tbody>
      </table>
     </Wrapper>
    </Card>
   </Body>
  </section>
 );
};

export default OrderStatus;
