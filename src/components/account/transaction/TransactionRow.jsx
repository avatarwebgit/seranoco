import React from 'react';

import classes from './TransactionRow.module.css';
const TransactionRow = ({ dataProp, number }) => {
 return (
  <tr>
   {dataProp && (
    <>
     <td className={classes.td}>{number}</td>
     <td className={classes.td}>{dataProp.changes}</td>
     <td className={classes.td}>{dataProp.balance}</td>
     <td className={classes.td}>{dataProp.date}</td>
    </>
   )}
  </tr>
 );
};

export default TransactionRow;
