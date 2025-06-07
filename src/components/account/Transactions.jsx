import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import Body from '../filters_page/Body';
import Card from '../filters_page/Card';
import Wrapper from './Wrapper';

import classes from './Transactions.module.css';
import { useState } from 'react';
import TransactionRow from './transaction/TransactionRow';
const Transactions = () => {
 const { t } = useTranslation();
 const lng = useSelector(state => state.localeStore.lng);
 const token = useSelector(state => state.userStore.token);

 const [a, setA] = useState([
  {
   balance: 150000,
   changes: 50000,
   type: 'Deposit',
   date: '2025-06-01',
  },
  {
   balance: 100000,
   changes: -50000,
   type: 'Withdrawal',
   date: '2025-06-02',
  },
  {
   balance: 200000,
   changes: 100000,
   type: 'Transfer In',
   date: '2025-06-03',
  },
  {
   balance: 180000,
   changes: -20000,
   type: 'Purchase',
   date: '2025-06-04',
  },
  {
   balance: 180000,
   changes: 0,
   type: 'Balance Check',
   date: '2025-06-05',
  },
 ]);

 return (
  <Body className={classes.body}>
   <Card className={classes.main}>
    <h3
     className={classes.title}
     style={{ direction: lng === 'fa' ? 'rtl' : 'ltr' }}>
     {t('wallet')}
    </h3>
    <Wrapper>wallet</Wrapper>
    <h3
     className={classes.title}
     style={{ direction: lng === 'fa' ? 'rtl' : 'ltr' }}>
     {t('transactions')}
    </h3>
    <Wrapper>
     <div className={classes.table_wrapper}>
      <table className={classes.table}>
       <thead>
        <tr className={classes.tr}>
         <th className={classes.th}>{t('orders.no')}</th>
         <th className={classes.th}>{t('changes')}</th>
         <th className={classes.th}>{t('balance')}</th>
         <th className={classes.th}>{t('date')}</th>
        </tr>
       </thead>
       <tbody>
        {a
         .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
         .map((transaction, i) => {
          return (
           <TransactionRow
            dataProp={transaction}
            key={transaction.id}
            number={i + 1}
           />
          );
         })}
       </tbody>
      </table>
     </div>
    </Wrapper>
   </Card>
  </Body>
 );
};

export default Transactions;
