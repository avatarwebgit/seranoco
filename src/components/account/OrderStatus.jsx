import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
 Radio,
 RadioGroup,
 FormControl,
 FormControlLabel,
 FormLabel,
 CircularProgress,
 Typography,
 Modal,
 IconButton,
 Button,
} from '@mui/material';
import Wrapper from './Wrapper';
import OrderHistory from './orders/OrderHistory';
import Body from '../filters_page/Body';
import Card from '../filters_page/Card';
import {
 getOrderByStatus,
 getOrders,
 getOrdersStatus,
 removeOrder,
} from '../../services/api';
import classes from './OrderStatus.module.css';
import { useSelector } from 'react-redux';
import { ReactComponent as Close } from '../../assets/svg/close.svg';
import { notify } from '../../utils/helperFunctions';

const OrderStatus = () => {
 const [orders, setOrders] = useState([]);
 const [orderStatus, setOrderStatus] = useState([]);
 const [selectedOption, setSelectedOption] = useState('');
 const [deleteModalOpen, setDeleteModalOpen] = useState(false);
 const [deleteOrderId, setDeleteOrderId] = useState(0);

 const { t } = useTranslation();

 const token = useSelector(state => state.userStore.token);
 const lng = useSelector(state => state.localeStore.lng);

 const handleFetchOrders = async () => {
  const serverRes = await getOrders(token);
  setOrders(serverRes.result.orders);
 };

 const handleFetchOrdersStatus = async () => {
  const serverRes = await getOrdersStatus(token);
  setOrderStatus(serverRes.result.status);
 };

 const handleFetchOrdersByStatus = async status => {
  const serverRes = await getOrderByStatus(token, status);
  setOrders(serverRes.result.orders);
 };

 useEffect(() => {
  handleFetchOrders();
  handleFetchOrdersStatus();
 }, []);

 const handleRadioChange = async e => {
  const selectedValue = e.target.value;
  setSelectedOption(selectedValue);
  handleFetchOrdersByStatus(selectedValue);
 };

 const handleOpenDeleteOrderModal = orderId => {
  setDeleteModalOpen(true);
  setDeleteOrderId(orderId);
 };

 const handleCancelDelete = () => {
  handleColoseDeleteModal();
  setDeleteOrderId(0);
 };

 const handleDeleteOrder = async orderId => {
  const serverRes = await removeOrder(token, orderId);
  notify(t('orders.successfull'));
  // if (serverRes.response.ok) {
  //  notify(t('orders.successfull'));
  // } else {
  //  notify(t('orders.error'));
  // }
 };

 const handleColoseDeleteModal = () => setDeleteModalOpen(false);

 return (
  <section className={classes.main}>
   <Modal open={deleteModalOpen} onClose={handleColoseDeleteModal}>
    <div className={classes.modal_contianer}>
     <div className={classes.relative}>
      <IconButton
       className={classes.close_btn}
       disableRipple={true}
       onClick={handleColoseDeleteModal}>
       <Close width={30} height={30} />
      </IconButton>
      <Typography variant='h6'>{t('orders.delete_info')}</Typography>
      <div>
       <Button
        color='error'
        size='large'
        variant='contained'
        onClick={() => handleDeleteOrder(deleteOrderId)}>
        {t('orders.delete')}
       </Button>
       <Button
        color='primary'
        size='large'
        variant='contained'
        className={classes.button}
        onClick={handleCancelDelete}>
        {t('orders.cancel')}
       </Button>
      </div>
     </div>
    </div>
   </Modal>
   <Body>
    <Card>
     <Wrapper>
      <div className={classes.filters_wrapper}>
       <form>
        <FormControl
         component='fieldset'
         fullWidth
         className={classes.form_wrapper}>
         <FormLabel component='legend'>{t('select_a_filter')}</FormLabel>
         <RadioGroup
          aria-label='options'
          name='options'
          value={selectedOption}
          sx={{ display: 'flex', flexDirection: 'row', margin: '20px 0' }}
          onChange={handleRadioChange}>
          {orderStatus.map(status => {
           return (
            <FormControlLabel
             value={status.id}
             key={status.id}
             control={<Radio size='small' />}
             sx={{
              marginLeft: lng === 'en' && '15px',
              marginRight: lng === 'fa' && '15px',
             }}
             label={
              <Typography component='span' sx={{ fontSize: '0.8rem' }}>
               {lng === 'fa' ? status.title : status.title_en}
              </Typography>
             }
            />
           );
          })}
         </RadioGroup>
        </FormControl>
       </form>
      </div>

      <div className={classes.table_wrapper}>
       <table className={classes.table}>
        <thead>
         <tr className={classes.tr}>
          <th className={classes.th}>{t('orders.no')}</th>
          <th className={classes.th}>{t('orders.orderno')}</th>
          <th className={classes.th}>{t('orders.status')}</th>
          <th className={classes.th}>{t('ticket.show')}</th>
          <th className={classes.th}>{t('orders.price')}</th>
          <th className={classes.th}>{t('orders.date')}</th>
          <th className={classes.th}>{t('continue')}</th>
          <th className={classes.th}>{t('cancel')}</th>
         </tr>
        </thead>
        <tbody>
         {orders
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .map((order, i) => {
           return (
            <OrderHistory
             deleteOrder={handleOpenDeleteOrderModal}
             dataProp={order}
             key={order.id}
             number={i}
            />
           );
          })}
        </tbody>
       </table>
      </div>
     </Wrapper>
    </Card>
   </Body>
  </section>
 );
};

export default OrderStatus;
