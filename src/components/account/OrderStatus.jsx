import React from 'react';

import Wrapper from './Wrapper';
import { useTranslation } from 'react-i18next';
import classes from './OrderStatus.module.css';
import TicketHistory from './ticket/TicketHistory';
import Body from '../filters_page/Body';
import Card from '../filters_page/Card';

const OrderStatus = () => {
 const { t } = useTranslation();
 return (
  <section className={classes.main}>
   <Body>
    <Card>
     <Wrapper>
      <table className={classes.table}>
       <thead>
        <tr className={classes.tr}>
         <th className={classes.th}>{t('ticket.no')}</th>
         <th className={classes.th}>{t('ticket.title')}</th>
         <th className={classes.th}>{t('ticket.status')}</th>
         <th className={classes.th}>{t('ticket.show')}</th>
         <th className={classes.th}>{t('ticket.ticket_no')}</th>
         <th className={classes.th}>{t('ticket.data')}</th>
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
