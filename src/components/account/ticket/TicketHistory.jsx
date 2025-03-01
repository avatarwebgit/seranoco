import React, { useState } from 'react';
import { IconButton, Modal } from '@mui/material';

import show from '../../../assets/svg/show.svg';
import { ReactComponent as Close } from '../../../assets/svg/close.svg';

import classes from './TicketHistory.module.css';
const TicketHistory = () => {
 const [modalOpen, setModalOpen] = useState(false);

 const handleCloseModal = () => setModalOpen(false);
 return (
  <>
   <Modal open={modalOpen} onClose={handleCloseModal} className={classes.modal}>
    <div className={classes.modal_content}>
     sal;kfj;aslkdf
     <IconButton className={classes.close_button}>
      <Close width={'30px'} height={'30px'} />
     </IconButton>
    </div>
   </Modal>
   <tr className={classes.tr}>
    <td className={classes.td}>text</td>
    <td className={classes.td}>text</td>
    <td className={classes.td}>text</td>
    <td className={classes.td}>
     <img
      className={classes.img}
      src={show}
      alt=''
      onClick={() => setModalOpen(true)}
     />
    </td>
    <td className={classes.td}>text</td>
    <td className={classes.td}>text</td>
   </tr>
  </>
 );
};

export default TicketHistory;
