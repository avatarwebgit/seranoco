import React from 'react';

import classes from './MessageBox.module.css';
import { Avatar } from '@mui/material';
const MessageBox = ({ message, time, type }) => {
 return (
  <div className={classes.main} style={{ direction: type,alignSelf:type==='ltr'?'flex-start':'flex-end' }}>
   <Avatar >A</Avatar>
   <div className={classes.message_box}>
    <span className={classes.time}>{time}</span>
    <p className={classes.message}>{message}</p>
   </div>
  </div>
 );
};

export default MessageBox;
