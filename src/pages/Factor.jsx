import React, { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { getOrderStatusDetail, useBasicInformation } from '../services/api';
import { useParams } from 'react-router-dom';
import { formatNumber, notify } from '../utils/helperFunctions';
import classes from './Factor.module.css';
import html2pdf from 'html2pdf.js'; // Import the html2pdf library

const Factor = () => {
 const [detailsData, setDetailsData] = useState(null);
 const [storeData, setStoreData] = useState(null);
 const [totalWeight, setTotalWeight] = useState(0);
 const componentRef = useRef(); // Create a ref for the component

 const { id } = useParams();
 const { data: storeInformation, isLoading: storeInformationLoading } =
  useBasicInformation();

 const lng = useSelector(state => state.localeStore.lng);
 const token = useSelector(state => state.userStore.token);
 const euro = useSelector(state => state.cartStore.euro);

 const { t } = useTranslation();

 const handleGetdetails = async orderId => {
  // Changed id to orderId
  if (orderId) {
   const serverRes = await getOrderStatusDetail(token, orderId);
   if (serverRes.response.ok) {
    setDetailsData(serverRes.result.orders);
   } else {
    notify(t('trylater'));
   }
  }
 };

 useEffect(() => {
  handleGetdetails(id);
 }, [id]);

 useEffect(() => {
  if (detailsData) {
   const weights = detailsData.products
    .map(item => item.product?.variation?.weight)
    .filter(weight => weight !== undefined && weight !== null);

   const numericWeights = weights.map(el => {
    return +el.split(' ').at(0);
   });
   const sumOfWeights = numericWeights.reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0,
   );
   setTotalWeight(sumOfWeights);
  }
 }, [detailsData]);

 useEffect(() => {
  if (storeInformation) {
   setStoreData(storeInformation.data.at(0));
  }
 }, [storeInformation]);

 useEffect(() => {
  console.log(detailsData);
 }, [detailsData]);

 useEffect(() => {
  // Check if detailsData is available and the component has rendered
  if (detailsData && componentRef.current) {
   const element = componentRef.current;
   const opt = {
    margin: 10,
    filename: `factor-${detailsData.order.order_number}.pdf`, // Use a dynamic filename
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
   };

   // Use html2pdf().from().set().save()
   html2pdf()
    .from(element)
    .set(opt)
    .save()
    .catch(err => {
     console.error('Error generating PDF:', err); // Handle errors during PDF generation
     notify('Failed to download PDF. Please try again.'); // Inform the user
    });
  }
 }, [detailsData]); // Trigger when detailsData changes, and the component is mounted

 return (
  <div ref={componentRef}>
   {' '}
   {/* Wrap the table with a div and assign the ref */}
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
       <span className={classes.productInfoHeader}>
        <span style={{ border: 'none' }}>{t('factor.Item')}</span>
        <span
         style={{
          borderRight: lng === 'fa' && '1px solid black',
          borderLeft: lng !== 'fa' && '1px solid black',
         }}>
         {t('factor.Invoice_Number_ID')}
        </span>
        <span
         style={{
          borderRight: lng === 'fa' && '1px solid black',
          borderLeft: lng !== 'fa' && '1px solid black',
         }}>
         {t('factor.Description_of_Goods_Service')}
        </span>
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
         {t('factor.Unit_Weight')}
        </span>
        <span
         style={{
          borderRight: lng === 'fa' && '1px solid black',
          borderLeft: lng !== 'fa' && '1px solid black',
         }}>
         {t('factor.Total_Amount')}
        </span>
       </span>
       {detailsData &&
        detailsData.products.map(product => {
         const prod = product.product;
         return (
          <span key={product.id} className={classes.productInfoDetails}>
           <span
            style={{
             border: 'none',
            }}>
            {product.id}
           </span>
           <span
            style={{
             borderRight: lng === 'fa' && '1px solid black',
             borderLeft: lng !== 'fa' && '1px solid black',
            }}>
            2
           </span>
           <span
            style={{
             borderRight: lng === 'fa' && '1px solid black',
             borderLeft: lng !== 'fa' && '1px solid black',
            }}></span>
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
            {prod.variation.weight}
           </span>
           <span
            style={{
             borderRight: lng === 'fa' && '1px solid black',
             borderLeft: lng !== 'fa' && '1px solid black',
            }}>
            {lng === 'fa'
             ? `${formatNumber(
                +prod.sale_price * euro * product.selected_quantity,
               )} ${t('m_unit')}`
             : `${prod.sale_price * product.selected_quantity} ${t('m_unit')}`}
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
         }}>
         {t('factor.Grand_Total')}
        </span>
        {detailsData && (
         <span
          className={classes.totalInfo}
          style={{
           borderRight: lng === 'fa' && '1px solid black',
           borderLeft: lng !== 'fa' && '1px solid black',
          }}>
          {lng === 'fa'
           ? `${detailsData.order.paying_amount_fa} ${t('m_unit')}`
           : `${detailsData.order.paying_amount} ${t('m_unit')}`}
         </span>
        )}
       </span>
       <span className={classes.productInfoTotalWrapper}>
        <span className={classes.totalInfo} style={{ border: 'none' }}></span>
        <span className={classes.totalInfo} style={{ border: 'none' }}></span>
        <span className={classes.totalInfo} style={{ border: 'none' }}></span>
        <span className={classes.totalInfo} style={{ border: 'none' }}></span>
        <span className={classes.totalInfo} style={{ border: 'none' }}></span>
        <span className={classes.totalInfo} style={{ border: 'none' }}>
         {t('factor.Total_Weight')}
        </span>
        <span
         className={classes.totalInfo}
         style={{
          borderRight: lng === 'fa' && '1px solid black',
          borderLeft: lng !== 'fa' && '1px solid black',
         }}>
         {totalWeight}&nbsp;Ct
        </span>
       </span>
      </td>
     </tr>
     {/* <tr>
                        <td className={classes.paymentDetails}>
                            <span className={classes.paymentTerms}>
                                <span>{t('factor.Sales_Terms_and_Method')}</span>
                                <span className={classes.paymentOptions}>
                                    <label htmlFor='cash'>{t('factor.Cash')}</label>
                                    <input type='radio' name='payment' id='cash' />
                                    <span className={classes.customRadio}></span>
                                </span>
                                <span className={classes.paymentOptions}>
                                    <label htmlFor='no-cash'>{t('factor.Non_Cash')}</label>
                                    <input type='radio' name='payment' id='no-cash' />
                                    <span className={classes.customRadio}></span>
                                </span>
                            </span>
                            <span className={classes.paymentText}></span>
                        </td>
                    </tr>
                    <tr>
                        <td style={{ display: 'flex', flexDirection: 'column' }}>
                            <label
                                htmlFor=''
                                className={classes.descriptionLabel}
                                style={{ fontSize: '13px' }}
                            >
                                {t('factor.Description')}
                            </label>
                            <textarea
                                name=''
                                id=''
                                className={classes.descriptionTextarea}
                                style={{ outline: 'none', borderBottom: 'none' }}
                            ></textarea>
                        </td>
                    </tr> */}
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
