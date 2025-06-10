import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import Body from '../filters_page/Body';
import Card from '../filters_page/Card';
import Wrapper from './Wrapper';

import { useEffect, useState } from 'react';
import { transactions } from '../../services/api';
import TransactionRow from './transaction/TransactionRow';
import classes from './Transactions.module.css';
import { Payment } from '@mui/icons-material';
import { formatNumber } from '../../utils/helperFunctions';
const Transactions = () => {
 const { t } = useTranslation();
 const lng = useSelector(state => state.localeStore.lng);
 const token = useSelector(state => state.userStore.token);

 const [transactionsHistory, setTransactionsHistory] = useState([]);
 const [wallet, setWallet] = useState([]);

 const getTransaction = async () => {
  const serverRes = await transactions(token);
  console.log(serverRes);
  if (serverRes.response.ok) {
   setTransactionsHistory(serverRes.result.wallet_history.data);
   setWallet(serverRes.result.wallet);
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
     <span>
      {t('current_balance')} :{' '}
      {lng !== 'fa' ? wallet.amount.toFixed(2) : formatNumber(wallet.amount_fa)}{' '}
      {t('m_unit')}
     </span>
    </Wrapper>
    <h3
     className={classes.title}
     style={{ direction: lng === 'fa' ? 'rtl' : 'ltr' }}>
     {t('transaction')}
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
       </tbody>
      </table>
     </div>
    </Wrapper>
   </Card>
  </Body>
 );
};

export default Transactions;
