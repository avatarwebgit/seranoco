import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import Body from '../filters_page/Body';
import Card from '../filters_page/Card';
import Wrapper from './Wrapper';

import { useEffect, useState } from 'react';
import { transactions } from '../../services/api';
import TransactionRow from './transaction/TransactionRow';
import classes from './Transactions.module.css';
import { Payment, Widgets } from '@mui/icons-material';
import { formatNumber } from '../../utils/helperFunctions';
import { Skeleton } from '@mui/material';
const Transactions = () => {
 const { t } = useTranslation();
 const lng = useSelector(state => state.localeStore.lng);
 const token = useSelector(state => state.userStore.token);
 const [isLoading, setisLoading] = useState(true);

 const [transactionsHistory, setTransactionsHistory] = useState([]);
 const [wallet, setWallet] = useState([]);

 const getTransaction = async () => {
  try {
   setisLoading(true);
   const serverRes = await transactions(token);
   if (serverRes.response.ok) {
    setTransactionsHistory(serverRes.result.wallet_history.data);
    setWallet(serverRes.result.wallet);
   }
  } catch (error) {
  } finally {
   setisLoading(false);
  }
 };

 useEffect(() => {
  getTransaction();
 }, []);

 return (
  <Body className={classes.body}>
   <Card className={classes.main}>
    <h3
     className={classes.title}
     style={{ direction: lng === 'fa' ? 'rtl' : 'ltr' }}>
     {t('wallet')}
    </h3>
    <Wrapper className={classes.wrapper}>
     <Payment fontSize='large' />
     <>
      {isLoading ? (
       <Skeleton
        variant='text'
        sx={{ width: '30%', margin: '0 10px' }}
        animation='wave'
       />
      ) : (
       <>
        <span>
         {t('current_balance')} :{' '}
         {lng !== 'fa' ? wallet.amount : wallet.amount_fa}
         {t('m_unit')}
        </span>
       </>
      )}
     </>{' '}
    </Wrapper>
    <h3
     className={classes.title}
     style={{ direction: lng === 'fa' ? 'rtl' : 'ltr' }}>
     {t('transaction')}
    </h3>
    <Wrapper>
     <div
      className={classes.table_wrapper}
      style={{
       overflowX: transactionsHistory.length > 0 ? 'scroll' : 'hidden',
      }}>
      {transactionsHistory.length > 0 ? (
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
         <>
          {transactionsHistory
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
         </>
        </tbody>
       </table>
      ) : (
       <p className={classes.info}>{t('no_transations')}</p>
      )}
     </div>
    </Wrapper>
   </Card>
  </Body>
 );
};

export default Transactions;
