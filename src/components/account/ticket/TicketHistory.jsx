import React, { useEffect, useRef, useState } from 'react';
import { IconButton, Input, InputAdornment, Modal } from '@mui/material';
import { Send } from '@mui/icons-material';

import show from '../../../assets/svg/show.svg';
import { ReactComponent as Close } from '../../../assets/svg/close.svg';

import MessageBox from './MessageBox';

import { ticketDetail, replyTicket } from '../../../services/api';

import classes from './TicketHistory.module.css';
import { useSelector } from 'react-redux';
import { notify } from '../../../utils/helperFunctions';
const TicketHistory = ({ dataProp }) => {
 const token = useSelector(state => state.userStore.token);

 const [data, setData] = useState(null);
 const [modalOpen, setModalOpen] = useState(false);
 const [message, setMessage] = useState('');
 const [allMessages, setAllMessages] = useState([]);

 const messagesRef = useRef(null);

 const handleSendTicket = async () => {
  if (message.trim().length > 0 && data.id) {
   const serverRes = await replyTicket(token, data.id, message);
   if (serverRes.response.ok) {
    setMessage('');
    setAllMessages(prev => [...prev, { message, time: new Date() }]);
   }
  }
 };

 const handleGetMessages = async () => {
  if (data) {
   const serverRes = await ticketDetail(token, data.id);
   setAllMessages(serverRes.result.replies);
  }
 };

 useEffect(() => {
  if (messagesRef.current) {
   messagesRef.current.scrollTo({
    top: messagesRef.current.scrollHeight,
    behavior: 'smooth',
   });
  }
 }, [allMessages]);

 useEffect(() => {
  if (modalOpen) {
   handleGetMessages();
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
       <div className={classes.messages_wrapper} ref={messagesRef}>
        {allMessages.map(el => {
         return (
          <MessageBox
           type={'rtl'}
           message={el.message}
           time={new Date(el.created_at).toLocaleDateString()}
          />
         );
        })}
       </div>

       <IconButton className={classes.close_button} onClick={handleCloseModal}>
        <Close width={'30px'} height={'30px'} />
       </IconButton>
       <Input
        className={classes.modal_input}
        onChange={e => setMessage(e.target.value)}
        value={message}
        endAdornment={
         <InputAdornment>
          <IconButton onClick={handleSendTicket}>
           <Send fontSize='15' />
          </IconButton>
         </InputAdornment>
        }
       />
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
