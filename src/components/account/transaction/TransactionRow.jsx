import { Payment, TrendingDown, TrendingUp } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import classes from './TransactionRow.module.css';

const TransactionRow = ({ dataProp, number }) => {
 const [type, setType] = useState(0);
 const lng = useSelector(state => state.localeStore.lng);
 const createdAtDate = new Date(dataProp.created_at);

 const { t } = useTranslation();

 useEffect(() => {
  setType(dataProp.type);
 }, [dataProp]);

 if (isNaN(createdAtDate.getTime())) {
  console.error('Invalid date:', dataProp.created_at);
  return null;
 }

 const dateOptions = {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
 };

 const timeOptions = {
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
 };

 const englishDatePart = createdAtDate.toLocaleString('en-US', dateOptions);
 const englishTimePart = createdAtDate.toLocaleString('en-US', timeOptions);

 const farsiDatePart = createdAtDate.toLocaleString('fa-IR', {
  ...dateOptions,
  calendar: 'persian',
  numberingSystem: 'arab',
 });

 const farsiTimePart = createdAtDate.toLocaleString('fa-IR', {
  ...timeOptions,
  calendar: 'persian',
  numberingSystem: 'arab',
 });

 return (
  <tr>
   {dataProp && (
    <>
     <td className={classes.td}>{number}</td>
     <td className={`${classes.td} ${classes.change}`}>
      {type === 5 && (
       <TrendingUp fontSize='small' color='success' sx={{ fontSize: '17px' }} />
      )}
      {type === 4 && (
       <TrendingDown fontSize='small' color='error' sx={{ fontSize: '17px' }} />
      )}
      {type === 2 && (
       <Payment fontSize='small' color='primary' sx={{ fontSize: '17px' }} />
      )}
      <span>
       {lng !== 'fa' ? dataProp.amount : dataProp.amount_fa}&nbsp;{t('m_unit')}
      </span>
     </td>
     <td className={classes.td}>
      {`${lng !== 'fa' ? dataProp.balance : dataProp.balance_fa}`}
      &nbsp;{t('m_unit')}
     </td>
     <td className={classes.td}>
      <div className={classes.dateContainer}>
       {lng !== 'fa' ? (
        <>
         <span>{englishDatePart}</span>
         <br />
         <span>{englishTimePart}</span>
        </>
       ) : (
        <>
         <span>{farsiDatePart}</span>
         <br />
         <span>{farsiTimePart}</span>
        </>
       )}
      </div>
     </td>
    </>
   )}
  </tr>
 );
};

export default TransactionRow;
