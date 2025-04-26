import React, { useEffect, useRef, useState } from 'react';
import { IconButton, Input, InputAdornment, Modal } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { Send } from '@mui/icons-material';

import show from '../../../assets/svg/show.svg';
import { ReactComponent as Close } from '../../../assets/svg/close.svg';

import { replyTicket, getOrderStatusDetail } from '../../../services/api';

import Card from '../../filters_page/Card';

import { formatNumber, notify } from '../../../utils/helperFunctions';

import classes from './OrderHistory.module.css';
const OrderHistory = ({ dataProp, number }) => {
 const [detailsData, setDetailsData] = useState(null);
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

   if (serverRes.response.ok) {
    setDetailsData(serverRes.result.orders);
    console.log(serverRes.result.orders);
   } else {
    notify(t('trylater'));
   }
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
      <div className={classes.sheet}>
       {detailsData && (
        <>
         
       
         <div className={classes.modal_content}>  <div className={classes.content}>
          <div>
           <label>{t('signup.fname')}</label>
           <input type='text' readOnly value={detailsData.address.title} />
           <label>{t('signup.pnumber')}</label>
           <input type='text' readOnly value={detailsData.address.cellphone} />
           <label>{t('signup.city')}</label>
           <input type='text' readOnly value={detailsData.address.city_id} />
           <label>{t('pc.postalcode')}</label>
           <input
            type='text'
            readOnly
            value={detailsData.address.postal_code}
           />
           <label></label>
           <input type='text' readOnly />
           <label></label>
           <input type='text' readOnly />
          </div>
          <div>
           <label></label>
           <input type='text' readOnly />
           <label></label>
           <input type='text' readOnly />
           <label></label>
           <input type='text' readOnly />
           <label></label>
           <input type='text' readOnly />
           <label></label>
           <input type='text' readOnly />
           <label></label>
           <input type='text' readOnly />
          </div>
         </div>
          <table className={classes.table}>
           <thead>
            <tr className={classes.tr}>
             <td className={classes.td}>{t('pc.image')}</td>
             <td className={classes.td}>{t('pc.color')}</td>
             <td className={classes.td}>{t('pc.size')}</td>
             <td className={classes.td}>
              {t('pc.price')}/{t('1_pcs')}
             </td>
             <td className={classes.td}>{t('quantity')}</td>
             <td className={classes.td}>{t('pc.payment')}</td>
            </tr>
           </thead>
           <tbody>
            {detailsData.products.map(el => {
             return (
              <tr className={classes.tr} key={el.id}>
               <td className={classes.td}>
                <div className={classes.img_wrapper}>
                 <img src={el.product.primary_image} alt='' loading='lazy' />
                </div>
               </td>
               <td className={classes.td}>
                {lng === 'fa' ? el.product.color_fa : el.product.color}
               </td>
               <td className={classes.td}>{el.product.size}</td>
               <td
                className={classes.td}
                style={{ direction: lng === 'fa' ? 'rtl' : 'ltr' }}>
                {lng !== 'fa'
                 ? el.price
                 : formatNumber(el.product.price * euro)}
                &nbsp;{t('m_unit')}
               </td>
               <td className={classes.td}>{el.selected_quantity}</td>
               <td
                className={classes.td}
                style={{ direction: lng === 'fa' ? 'rtl' : 'ltr' }}>
                {lng === 'fa'
                 ? formatNumber(el.total_price * euro)
                 : +el.total_price.toFixed(2)}
                &nbsp;{t('m_unit')}
               </td>
              </tr>
             );
            })}
           </tbody>
          </table>
         </div>
         
        </>
       )}
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
