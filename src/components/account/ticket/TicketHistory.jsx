import React, { useEffect, useState } from 'react';
import { IconButton, Modal } from '@mui/material';

import show from '../../../assets/svg/show.svg';
import { ReactComponent as Close } from '../../../assets/svg/close.svg';

import classes from './TicketHistory.module.css';
import MessageBox from './MessageBox';
const TicketHistory = ({ dataProp }) => {
 const [data, setData] = useState(null);
 const [modalOpen, setModalOpen] = useState(false);

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
       <MessageBox
        type={'rtl'}
        message={'test message'}
        time={new Date().toLocaleDateString()}
       />
       <MessageBox
        type={'ltr'}
        message={'test message'}
        time={new Date().toLocaleDateString()}
       />
       <IconButton className={classes.close_button} onClick={handleCloseModal}>
        <Close width={'30px'} height={'30px'} />
       </IconButton>
      </div>
     </Modal>
     <tr className={classes.tr}>
      <td className={classes.td}>{data.id}</td>
      <td className={classes.td}>{data.subject}</td>
      <td className={classes.td}>text</td>
      <td className={classes.td}>
       <img
        className={classes.img}
        src={show}
        alt=''
        onClick={() => setModalOpen(true)}
       />
      </td>
      <td className={classes.td}>{data.id}</td>
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

export default TicketHistory;
