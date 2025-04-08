import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import Wrapper from './Wrapper';
import TicketHistory from './ticket/TicketHistory';
import Body from '../filters_page/Body';
import Card from '../filters_page/Card';

import { getOrders, getOrdersStatus } from '../../services/api';

import classes from './OrderStatus.module.css';
import { useSelector } from 'react-redux';
const OrderStatus = () => {
 const { t } = useTranslation();

 const token = useSelector(state => state.userStore.token);

 const handleFetchOeders = async () => {
  const serverRes = await getOrders(token);
  console.log(serverRes);
 };

 const handleFetchOedersStatus = async () => {
  const serverRes = await getOrdersStatus(token);
  console.log(serverRes);
 };

 useEffect(() => {
  handleFetchOeders();
  handleFetchOedersStatus();
 }, []);
 return (
  <section className={classes.main}>
   <Body>
    <Card>
     <Wrapper>
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
        <TicketHistory />
       </tbody>
      </table>
     </Wrapper>
    </Card>
   </Body>
  </section>
 );
};

export default OrderStatus;
