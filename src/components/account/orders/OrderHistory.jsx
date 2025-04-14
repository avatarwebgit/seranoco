import React, { useEffect, useRef, useState } from 'react';
import { IconButton, Input, InputAdornment, Modal } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { Send } from '@mui/icons-material';

import show from '../../../assets/svg/show.svg';
import { ReactComponent as Close } from '../../../assets/svg/close.svg';

import { replyTicket, getOrderStatusDetail } from '../../../services/api';

import { formatNumber } from '../../../utils/helperFunctions';

import classes from './OrderHistory.module.css';
const OrderHistory = ({ dataProp, number }) => {
 const token = useSelector(state => state.userStore.token);
 const euro = useSelector(state => state.cartStore.euro);
 const lng = useSelector(state => state.localeStore.lng);

 const { t } = useTranslation();

 const [data, setData] = useState(null);
 const [modalOpen, setModalOpen] = useState(false);

 const messagesRef = useRef(null);

 const handleGetdetails = async () => {
  if (data) {
   const serverRes = await getOrderStatusDetail(token, data.id);
   console.log(serverRes);
  }
 };

 useEffect(() => {
  if (modalOpen) {
   handleGetdetails();
  }
 }, [modalOpen]);

 useEffect(() => {
  if (dataProp) {
   setData(dataProp);
  }
 }, [dataProp]);

 const handleCloseModal = () => setModalOpen(false);

 return (
  <>
   {data && (
    <>
     <Modal
      open={modalOpen}
      onClose={handleCloseModal}
      className={classes.modal}>
      <div className={classes.modal_content}>
       {/* <div className={classes.messages_wrapper} ref={messagesRef}>
        {allMessages.map(el => {
         return (
          <MessageBox
           type={el.type === 'user' ? 'ltr' : 'rtl'}
           message={el.message}
           time={new Date(el.created_at).toLocaleDateString()}
          />
         );
        })}
       </div> */}
      </div>
     </Modal>
     <tr className={classes.tr}>
      <td className={classes.td}>{number + 1}</td>
      <td className={classes.td}>{data.order_number}</td>
      <td className={classes.td}>{data.OrderStatus}</td>
      <td className={classes.td}>
       <img
        className={classes.img}
        src={show}
        alt=''
        onClick={() => setModalOpen(true)}
       />
      </td>
      <td className={classes.td}>
       {lng === 'fa'
        ? formatNumber(data.paying_amount)
        : (data.paying_amount / euro).toFixed(2)}
       &nbsp;{t('m_unit')}
      </td>
      <td className={classes.td}>
       {new Date(data.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        day: 'numeric',
        month: 'long',
       })}
      </td>
     </tr>
    </>
   )}
  </>
 );
};

export default OrderHistory;
