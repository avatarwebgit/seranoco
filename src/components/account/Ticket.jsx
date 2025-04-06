import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Button, TextareaAutosize, TextField } from '@mui/material';

import Wrapper from './Wrapper';
import Body from '../filters_page/Body';
import Card from '../filters_page/Card';
import loadingSpinner from '../../components/common/LoadingSpinner';
import TicketHistory from './ticket/TicketHistory';

import LoadingSpinner from '../../components/common/LoadingSpinner';

import { ReactComponent as Upload } from '../../assets/svg/upload.svg';

import { getAllTickets, sendTicket } from '../../services/api';
import { notify } from '../../utils/helperFunctions';

import classes from './Ticket.module.css';
const Ticket = () => {
 const inputStyles = {
  width: '80%',
  mb: '0.5rem',
  '& .MuiInputBase-root': {
   '& fieldset': {
    borderColor: 'black',
   },
  },
  '& .MuiInputBase-input': {
   color: 'rgb(0, 0, 0)',
   fontSize: '16px',
  },
  '& .MuiInputLabel-root': {
   color: 'gray',
   fontSize: '14px',
  },
  '& .Mui-focused .MuiInputLabel-root': {
   color: 'black',
   transform: 'translate(0, -5px) scale(0.75)',
  },
  '& .Mui-focused .MuiInputBase-root': {
   '& fieldset': {
    borderColor: 'black',
   },
  },
 };

 const [subject, setSubject] = useState('');
 const [description, setDescription] = useState('');
 const [uploadFile, setUploadFile] = useState('');
 const [isError, setIsError] = useState(false);
 const [allTicketsData, setAllTicketsData] = useState([]);
 const [loadingAllTickets, setLoadingAllTickets] = useState(true);

 const { t } = useTranslation();
 const lng = useSelector(state => state.localeStore.lng);
 const token = useSelector(state => state.userStore.token);

 const formRef = useRef();

 const handleSendTicket = async (token, s, d, f) => {
  const serverRes = await sendTicket(token, s, d, f);
  if (serverRes.response.ok) {
   resetForm();
   handleGetAllTickets(token);
   notify(t('ticket.ok'));
  } else {
   notify(t('ticket.error'));
  }
 };

 const handleGetAllTickets = async t => {
  setLoadingAllTickets(true);
  try {
   const serverRes = await getAllTickets(t);
   if (serverRes.response.ok) {
    console.log(serverRes);
    setAllTicketsData(serverRes.result);
   }
  } catch (err) {
   setLoadingAllTickets(false);
  } finally {
   setLoadingAllTickets(false);
  }
 };

 useEffect(() => {
  if (token) {
   handleGetAllTickets(token);
  }
 }, []);

 const handleSubmit = async e => {
  e.preventDefault();

  const requiredFields = [subject?.trim(), description?.trim()];

  const isValid = requiredFields.every(field => field && field.length > 0);

  if (!isValid) {
   setIsError(true);
  } else {
   setIsError(false);
   try {
    handleSendTicket(token, subject, description, uploadFile);
   } catch (error) {}
  }
 };

 const resetForm = () => {
  formRef.current.reset();
  setSubject('');
  setDescription('');
  setUploadFile('');
 };

 return (
  <Body parentClass={classes.body}>
   <Card className={classes.main}>
    <h3
     className={classes.title}
     style={{ direction: lng === 'fa' ? 'rtl' : 'ltr' }}>
     {t('profile.favorites')}
    </h3>
    <form onSubmit={handleSubmit} ref={formRef} style={{ width: '100%' }}>
     <Wrapper className={classes.wrapper}>
      <label htmlFor='subject'>{t('subject')}</label>
      <TextField
       id='subject'
       name='subject'
       type='text'
       size='small'
       sx={inputStyles}
       onChange={e => {
        setSubject(e.target.value);
       }}
       onFocus={() => setIsError(false)}
       error={isError && !subject}
       value={subject}
       required
      />
      <label htmlFor='desc'>{t('caption')}</label>
      <textarea
       name='desc'
       id='desc'
       style={{ maxWidth: '500px' }}
       onChange={e => setDescription(e.target.value)}
       required
      />
      <label htmlFor='image' className={classes.upload_label}>
       {t('upload')}
       <span>
        <center>
         <Upload width={40} height={40} />
        </center>
       </span>
      </label>
      <TextField
       id='image'
       name='image'
       type='file'
       size='small'
       sx={{ ...inputStyles, display: 'none' }}
       onChange={e => {
        setUploadFile(e.target.files[0]);
       }}
       onFocus={() => setIsError(false)}
       error={isError && !description}
      />

      <Button
       variant='contained'
       size='large'
       className={classes.login_btn}
       type='submit'>
       {t('send')}
      </Button>
     </Wrapper>
    </form>
    <h3
     className={classes.title}
     style={{ direction: lng === 'fa' ? 'rtl' : 'ltr' }}>
     {t('profile.favorites')}
    </h3>
    <Wrapper>
     <table className={classes.table}>
      <thead>
       <tr className={classes.tr}>
        <th className={classes.th}>{t('ticket.no')}</th>
        <th className={classes.th}>{t('ticket.title')}</th>
        <th className={classes.th}>{t('ticket.status')}</th>
        <th className={classes.th}>{t('ticket.show')}</th>
        <th className={classes.th}>{t('ticket.ticket_no')}</th>
        <th className={classes.th}>{t('ticket.data')}</th>
       </tr>
      </thead>
      <tbody>
       {!loadingAllTickets ? (
        allTicketsData &&
        allTicketsData.map((el, i) => {
         return <TicketHistory dataProp={(i, el)} key={el.id} />;
        })
       ) : (
                 <div className={classes.loading_wrapper }>
         <LoadingSpinner size='20' />
        </div>
       )}
      </tbody>
     </table>
    </Wrapper>
   </Card>
  </Body>
 );
};

export default Ticket;
