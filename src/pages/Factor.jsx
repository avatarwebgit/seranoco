import React, { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { getOrderStatusDetail, useBasicInformation } from '../services/api';
import { useParams } from 'react-router-dom';
import { formatNumber, notify } from '../utils/helperFunctions';
import classes from './Factor.module.css';
import html2pdf from 'html2pdf.js';

const Factor = () => {
 const [detailsData, setDetailsData] = useState(null);
 const [storeData, setStoreData] = useState(null);
 const [totalWeight, setTotalWeight] = useState(0);
 const [totalQuantity, setTotalQuantity] = useState(0);
 const [loyaltyOff, setLoyaltyOff] = useState(0);
 const [shippingCost, setShippingCost] = useState(0);

 const componentRef = useRef();

 const { id } = useParams();
 const { data: storeInformation, isLoading: storeInformationLoading } =
  useBasicInformation();

 const lng = useSelector(state => state.localeStore.lng);
 const token = useSelector(state => state.userStore.token);
 const euro = useSelector(state => state.cartStore.euro);

 const { t } = useTranslation();

 const handleGetdetails = async orderId => {
  if (orderId) {
   const serverRes = await getOrderStatusDetail(token, orderId);
   if (serverRes.response.ok) {
    setDetailsData(serverRes.result.orders);
    setShippingCost(serverRes.result.orders.shipping || 0);
    setLoyaltyOff(serverRes.result.orders.loyalty || 0);
    console.log(serverRes);
   } else {
    notify(t('trylater'));
   }
  }
 };

 useEffect(() => {
  handleGetdetails(id);
 }, [id]);

 useEffect(() => {
  if (storeInformation) {
   setStoreData(storeInformation.data.at(0));
  }
 }, [storeInformation]);

 function calculateTotalProductWeight(data) {
  let totalWeight = 0;
  let totalQuantity = 0;
  data.products.forEach(item => {
   if (
    item.product &&
    item.product.variation &&
    item.product.variation.weight
   ) {
    const weightString = item.product.variation.weight.trim();
    console.log(weightString);
    const numericWeight = parseFloat(weightString.split(' ')[0]);

    if (!isNaN(numericWeight)) {
     totalWeight += numericWeight * item.selected_quantity;
     totalQuantity += item.selected_quantity;
    }
   }
  });

  setTotalWeight(totalWeight);
  setTotalQuantity(totalQuantity);
 }

 useEffect(() => {
  if (detailsData && componentRef.current) {
   calculateTotalProductWeight(detailsData);
   console.log(detailsData);
   const timeout = setTimeout(() => {
    //     const element = componentRef.current;
    //     const opt = {
    //      margin: 10,
    //      filename: `factor-${detailsData.order.order_number}.pdf`,
    //      image: { type: 'jpeg', quality: 0.98 },
    //      html2canvas: { scale: 2 },
    //      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    //     };
    //     html2pdf()
    //      .from(element)
    //      .set(opt)
    //      .save()
    //      .catch(err => {
    //       console.error('Error generating PDF:', err);
    //       notify('Failed to download PDF. Please try again.');
    //      });
   }, 300);

   return () => clearTimeout(timeout);
  }
 }, [detailsData]);

 return (
  <div ref={componentRef}>
   <table className={classes.factorTable} dir={lng === 'fa' ? 'rtl' : 'ltr'}>
    <thead>
     {detailsData && (
      <tr>
       <td className={classes.head}>
        <span className={classes.dateWrapper}>
         <span>{t('factor.Serial_Number')}</span>
         <span className={`${classes.center} ${classes.border}`}>
          {detailsData.order.order_number}
         </span>
         <span>{t('factor.Date')}</span>
         <span className={`${classes.center} ${classes.border}`}>
          {detailsData?.order?.created_at
           ? (() => {
              const date = new Date(detailsData.order.created_at);
              const year = date.getFullYear();
              const month = String(date.getMonth() + 1).padStart(2, '0');
              const day = String(date.getDate()).padStart(2, '0');
              return `${year}.${month}.${day}`;
             })()
           : ''}
         </span>
        </span>
        <h1 className={classes.title}>{t('factor.Service_Sales_Invoice')}</h1>
        <span></span>
       </td>
      </tr>
     )}
    </thead>
    <tbody>
     <tr className={classes.sectionTitle}>
      <td>{t('factor.Buyer_Information')}</td>
     </tr>
     <tr>
      {detailsData && (
       <td className={classes.companyInfoWrapper}>
        <span>
         <p>{t('factor.Name_Individual_Legal_Entity')}</p>
         <p>{detailsData.address.title}</p>
         <p></p>
        </span>
        <span>
         <p>{t('factor.Postal_Code')}</p>
         <p>{detailsData.address.postal_code}</p>
         <p></p>
        </span>
        <span>
         <p>{t('factor.Phone_Number')}</p>
         <p>{detailsData.address.tel}</p>
         <p></p>
        </span>
        <span className={classes.address}>
         <p>{t('factor.Address')}</p>
         <p>{detailsData.address.address}</p>
         <p></p>
        </span>
       </td>
      )}
     </tr>
     <tr className={classes.sectionTitle}>
      <td>{t('factor.Seller_Information')}</td>
     </tr>
     <tr>
      {storeData && (
       <td className={classes.companyInfoWrapper}>
        <span>
         <p>{t('factor.Name_Individual_Legal_Entity')}</p>
         <p>{lng === 'fa' ? storeData.name : storeData.name_en}</p>
         <p></p>
        </span>
        <span>
         <p>{t('factor.Postal_Code')}</p>
         <p>{storeData.postalCode}</p>
         <p></p>
        </span>
        <span>
         <p>{t('factor.Phone_Number')}</p>
         <p>{storeData.tel}</p>
         <p></p>
        </span>
        <span>
         <p></p>
         <p></p>
        </span>
        <span className={classes.address}>
         <p>{t('factor.Address')}</p>
         <p>{lng === 'fa' ? storeData.address : storeData.address_en}</p>
         <p></p>
        </span>
       </td>
      )}
     </tr>
     <tr className={classes.sectionTitle}>
      <td>{t('factor.Details_of_Goods_or_Services_Transacted')}</td>
     </tr>
     <tr className={classes.productInfoWrapper}>
      <td>
       <span className={classes.productInfoDetails}>
        <span style={{ border: 'none' }}>{t('factor.Item')}</span>
        <span
         style={{
          borderRight: lng === 'fa' && '1px solid black',
          borderLeft: lng !== 'fa' && '1px solid black',
         }}>
         {t('factor.type')}
        </span>
        <span
         style={{
          borderRight: lng === 'fa' && '1px solid black',
          borderLeft: lng !== 'fa' && '1px solid black',
         }}>
         {t('cut')}
        </span>
        <span
         style={{
          borderRight: lng === 'fa' && '1px solid black',
          borderLeft: lng !== 'fa' && '1px solid black',
         }}>
         {t('size')}
        </span>
        <span
         style={{
          borderRight: lng === 'fa' && '1px solid black',
          borderLeft: lng !== 'fa' && '1px solid black',
         }}>
         {t('color')}
        </span>
        <span
         style={{
          borderRight: lng === 'fa' && '1px solid black',
          borderLeft: lng !== 'fa' && '1px solid black',
         }}>
         {t('factor.Unit_Weight')}
        </span>
        <span
         style={{
          borderRight: lng === 'fa' && '1px solid black',
          borderLeft: lng !== 'fa' && '1px solid black',
         }}>
         {t('factor.Total_Weight')}
        </span>{' '}
        <span
         style={{
          borderRight: lng === 'fa' && '1px solid black',
          borderLeft: lng !== 'fa' && '1px solid black',
         }}>
         {t('factor.Quantity_Amount')}
        </span>
        <span
         style={{
          borderRight: lng === 'fa' && '1px solid black',
          borderLeft: lng !== 'fa' && '1px solid black',
         }}>
         {t('factor.Unit_Price')}
        </span>
        <span
         style={{
          borderRight: lng === 'fa' && '1px solid black',
          borderLeft: lng !== 'fa' && '1px solid black',
         }}>
         {t('availability')}
        </span>
        <span
         style={{
          borderRight: lng === 'fa' && '1px solid black',
          borderLeft: lng !== 'fa' && '1px solid black',
          color: 'red',
          width: '5%',
         }}>
         {t('factor.off')}
        </span>
        <span
         style={{
          borderRight: lng === 'fa' && '1px solid black',
          borderLeft: lng !== 'fa' && '1px solid black',
          width: '12%',
         }}>
         {t('factor.Total_Amount')}
        </span>
       </span>
       {detailsData &&
        detailsData.products.map((product, i) => {
         const prod = product.product;
         const weight = product.product.variation.weight.split(' ').at(0);
         return (
          <span key={product.id} className={classes.productInfoDetails}>
           <span
            style={{
             border: 'none',
            }}>
            {i + 1}
           </span>
           <span
            style={{
             borderRight: lng === 'fa' && '1px solid black',
             borderLeft: lng !== 'fa' && '1px solid black',
            }}>
            {lng === 'fa' ? prod.shape_fa : prod.shape}
           </span>
           <span
            style={{
             borderRight: lng === 'fa' && '1px solid black',
             borderLeft: lng !== 'fa' && '1px solid black',
            }}>
            {lng === 'fa' ? prod.cut_fa : prod.cut}
           </span>
           <span
            style={{
             borderRight: lng === 'fa' && '1px solid black',
             borderLeft: lng !== 'fa' && '1px solid black',
            }}>
            {prod.size}
           </span>
           <span
            style={{
             borderRight: lng === 'fa' && '1px solid black',
             borderLeft: lng !== 'fa' && '1px solid black',
            }}>
            {lng === 'fa' ? prod.color_fa : prod.color}
           </span>
           <span
            style={{
             borderRight: lng === 'fa' && '1px solid black',
             borderLeft: lng !== 'fa' && '1px solid black',
            }}>
            {weight}
           </span>
           <span
            style={{
             borderRight: lng === 'fa' && '1px solid black',
             borderLeft: lng !== 'fa' && '1px solid black',
            }}>
            {+(product.selected_quantity * weight).toFixed(3)}
           </span>
           <span
            style={{
             borderRight: lng === 'fa' && '1px solid black',
             borderLeft: lng !== 'fa' && '1px solid black',
            }}>
            {product.selected_quantity}
           </span>
           <span
            style={{
             borderRight: lng === 'fa' && '1px solid black',
             borderLeft: lng !== 'fa' && '1px solid black',
            }}>
            {lng === 'fa'
             ? `${formatNumber(+prod.sale_price * euro)} ${t('m_unit')}`
             : `${prod.sale_price} ${t('m_unit')}`}
           </span>
           <span
            style={{
             borderRight: lng === 'fa' && '1px solid black',
             borderLeft: lng !== 'fa' && '1px solid black',
            }}>
            {!prod.variation.is_not_available
             ? t('available')
             : t('newpage.newpage')}
           </span>
           <span
            style={{
             borderRight: lng === 'fa' && '1px solid black',
             borderLeft: lng !== 'fa' && '1px solid black',
             width: '5%',
            }}>
            ---
           </span>
           <span
            style={{
             borderRight: lng === 'fa' && '1px solid black',
             borderLeft: lng !== 'fa' && '1px solid black',
             width: '12%',
            }}>
            <strong>
             {lng === 'fa'
              ? `${formatNumber(
                 +prod.sale_price * euro * product.selected_quantity,
                )} ${t('m_unit')}`
              : `${
                 Math.round(prod.sale_price * product.selected_quantity * 10) /
                 10
                } ${t('m_unit')}`}
            </strong>
           </span>
          </span>
         );
        })}
       <span
        className={classes.productInfoTotalWrapper}
        style={{ borderBottom: '1px solid black' }}>
        <span
         className={classes.totalInfo}
         style={{
          border: 'none',
         }}></span>
        <span
         className={classes.totalInfo}
         style={{
          border: 'none',
         }}></span>
        <span
         className={classes.totalInfo}
         style={{
          border: 'none',
         }}></span>
        <span
         className={classes.totalInfo}
         style={{
          border: 'none',
         }}></span>
        <span
         className={classes.totalInfo}
         style={{
          border: 'none',
         }}></span>
        <span
         className={classes.totalInfo}
         style={{
          border: 'none',
          fontWeight: 'bold',
         }}>
         {' '}
         {t('shopping_cart.total')}:
        </span>
        <span
         className={classes.totalInfo}
         style={{
          border: 'none',
          fontWeight: 'bold',
          direction: 'ltr',
         }}>
         {+totalWeight.toFixed(3)}&nbsp;Ct
        </span>
        <span
         className={classes.totalInfo}
         style={{
          border: 'none',
          fontWeight: 'bold',
         }}>
         {totalQuantity}
         &nbsp;{t('factor.pcs')}&nbsp;
        </span>
        <span
         className={classes.totalInfo}
         style={{
          border: 'none',
         }}></span>
        <span
         className={classes.totalInfo}
         style={{
          border: 'none',
         }}></span>
        <span
         className={classes.totalInfo}
         style={{
          border: 'none',
          width: '5%',
         }}></span>
        {detailsData && (
         <span
          className={classes.totalInfo}
          style={{
           borderRight: lng === 'fa' && '1px solid black',
           borderLeft: lng !== 'fa' && '1px solid black',
           width: '12.1%',
          }}>
          <strong>
           {lng === 'fa' ? (
            <>
             {formatNumber(+detailsData.order.paying_amount_fa)}
             <br />
             {t('m_unit')}
             <br />
             (€&nbsp;{detailsData.order.paying_amount})
            </>
           ) : (
            <>
             {Math.round(detailsData.order.paying_amount * 10) / 10}
             {t('m_unit')}
            </>
           )}
          </strong>
         </span>
        )}
       </span>
       <span
        className={classes.productInfoTotalWrapper}
        style={{ borderBottom: '1px solid black' }}>
        <span
         className={classes.totalInfo}
         style={{
          border: 'none',
         }}></span>
        <span
         className={classes.totalInfo}
         style={{
          border: 'none',
         }}></span>
        <span
         className={classes.totalInfo}
         style={{
          border: 'none',
         }}></span>
        <span
         className={classes.totalInfo}
         style={{
          border: 'none',
         }}></span>
        <span
         className={classes.totalInfo}
         style={{
          border: 'none',
         }}></span>
        <span
         className={classes.totalInfo}
         style={{
          border: 'none',
         }}></span>
        <span
         className={classes.totalInfo}
         style={{
          border: 'none',
         }}></span>
        <span
         className={classes.totalInfo}
         style={{
          border: 'none',
         }}></span>
        <span
         className={classes.totalInfo}
         style={{
          border: 'none',
         }}></span>
        <span
         className={classes.totalInfo}
         style={{
          border: 'none',
          color: 'red',
          whiteSpace: 'nowrap',
          display: 'flex',
          alignItems: 'center',
         }}>
         {t('factor.club')}
        </span>
        <span
         className={classes.totalInfo}
         style={{
          border: 'none',

          width: '5%',
         }}></span>
        {detailsData && (
         <span
          className={classes.totalInfo}
          style={{
           borderRight: lng === 'fa' && '1px solid black',
           borderLeft: lng !== 'fa' && '1px solid black',
           width: '12.1%',
           display: 'flex',
           alignItems: 'center',
           justifyContent: 'center',
          }}>
          {loyaltyOff}&nbsp;%
         </span>
        )}
       </span>
       <span
        className={classes.productInfoTotalWrapper}
        style={{ borderBottom: '1px solid black' }}>
        <span
         className={classes.totalInfo}
         style={{
          border: 'none',
         }}></span>
        <span
         className={classes.totalInfo}
         style={{
          border: 'none',
         }}></span>
        <span
         className={classes.totalInfo}
         style={{
          border: 'none',
         }}></span>
        <span
         className={classes.totalInfo}
         style={{
          border: 'none',
         }}></span>
        <span
         className={classes.totalInfo}
         style={{
          border: 'none',
         }}></span>
        <span
         className={classes.totalInfo}
         style={{
          border: 'none',
         }}></span>
        <span
         className={classes.totalInfo}
         style={{
          border: 'none',
         }}></span>
        <span
         className={classes.totalInfo}
         style={{
          border: 'none',
         }}></span>
        <span
         className={classes.totalInfo}
         style={{
          border: 'none',
         }}></span>
        <span
         className={classes.totalInfo}
         style={{
          border: 'none',
          width: '5%',
          whiteSpace: 'nowrap',
          display: 'flex',
          alignItems: 'center',
         }}>
         {t('factor.shipping')}
        </span>
        <span
         className={classes.totalInfo}
         style={{
          border: 'none',
         }}></span>
        {detailsData && (
         <span
          className={classes.totalInfo}
          style={{
           borderRight: lng === 'fa' && '1px solid black',
           borderLeft: lng !== 'fa' && '1px solid black',
           display: 'flex',
           alignItems: 'center',
           justifyContent: 'center',
           width: '12.1%',
          }}>
          {shippingCost}
         </span>
        )}
       </span>
       <span className={classes.productInfoTotalWrapper}>
        <span className={classes.totalInfo} style={{ border: 'none' }}></span>
        <span className={classes.totalInfo} style={{ border: 'none' }}></span>
        <span className={classes.totalInfo} style={{ border: 'none' }}></span>
        <span className={classes.totalInfo} style={{ border: 'none' }}></span>
        <span className={classes.totalInfo} style={{ border: 'none' }}></span>
        <span className={classes.totalInfo} style={{ border: 'none' }}></span>
        <span className={classes.totalInfo} style={{ border: 'none' }}></span>
        <span className={classes.totalInfo} style={{ border: 'none' }}></span>
        <span className={classes.totalInfo} style={{ border: 'none' }}></span>
        <span
         className={classes.totalInfo}
         style={{
          border: 'none',
          whiteSpace: 'nowrap',
          display: 'flex',
          alignItems: 'center',
         }}>
         {t('orders.total_payment')}
        </span>
        <span
         className={classes.totalInfo}
         style={{ border: 'none', fontWeight: 'bold', width: '5%' }}></span>
        <span
         className={classes.totalInfo}
         style={{
          borderRight: lng === 'fa' && '1px solid black',
          borderLeft: lng !== 'fa' && '1px solid black',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'bold',
          width: '12.1%',
         }}>
         {lng === 'fa' ? (
          <>
           {formatNumber(+detailsData?.order.paying_amount_fa)}
           <br />
           {t('m_unit')}
           <br />
           (€&nbsp;
           {(Math.round(+detailsData?.order.paying_amount * 10) / 10).toFixed(
            2,
           )}{' '}
           ${t('m_unit')})
          </>
         ) : (
          <>
           {(Math.round(+detailsData?.order.paying_amount * 10) / 10).toFixed(
            2,
           )}
           {t('m_unit')}
          </>
         )}
        </span>
       </span>
      </td>
     </tr>
     <tr>
      <td className={classes.signatureRow}>
       <span className={classes.signatureColumn}>
        {t('factor.Buyers_Stamp_and_Signature')}
       </span>
       <span className={classes.signatureColumn}>
        {t('factor.Shops_Stamp_and_Signature')}
       </span>
      </td>
     </tr>
    </tbody>
   </table>
  </div>
 );
};

export default Factor;
