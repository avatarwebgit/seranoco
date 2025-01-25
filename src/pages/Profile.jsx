import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from '@mui/material';
import { useSelector } from 'react-redux';
import { Add } from '@mui/icons-material';

import Header from '../layout/Header';
import Footer from '../layout/Footer';
import Card from '../components/filters_page/Card';
import Body from '../components/filters_page/Body';
import Breadcrumbs from '../components/common/Breadcrumbs';
import Wrapper from '../components/account/Wrapper';
import { CustomButton } from '../components/account/CustomButton';

import classes from './Profile.module.css';
import OrderStatus from '../components/account/OrderStatus';
import AccountInformaion from '../components/account/AccountInformaion';

const Profile = ({ windowSize }) => {
  const lng = useSelector(state => state.localeStore.lng);
  const { t } = useTranslation();

  const accordionsData = [
    {
      id: 'accordion1',
      title: t('my_acc'),
      buttons: [
        {
          id: 'btn1',
          title: t('profile.acc_info'),
          content: <AccountInformaion />,
        },
        {
          id: 'btn2',
          title: t('profile.favorites'),
          content: 'Content for Button 2',
        },
        {
          id: 'btn2',
          title: t('profile.log_out'),
          content: 'Content for Button 2',
        },
      ],
    },
    {
      id: 'accordion2',
      title: t('profile.orders'),
      buttons: [
        {
          id: 'btn3',
          title: t('profile.pending'),
          content: 'Content for Button 3',
        },
        {
          id: 'btn4',
          title: t('profile.order_status'),
          content: <OrderStatus />,
        },
      ],
    },
    {
      id: 'accordion3',
      title: t('profile.support'),
      buttons: [
        {
          id: 'btn7',
          title: t('profile.ticket'),
          content: 'Content for Button 7',
        },
        {
          id: 'btn8',
          title: t('profile.contact'),
          content: 'Content for Button 8',
        },
      ],
    },
  ];

  const [selectedButtonId, setSelectedButtonId] = useState(null);
  const [selectedContent, setSelectedContent] = useState(null);

  useEffect(() => {
    setSelectedButtonId(accordionsData.at(0).buttons.at(0).id);
    setSelectedContent(accordionsData.at(0).buttons.at(0).content);
  }, []);

  const handleButtonClick = (id, content) => {
    setSelectedButtonId(id);
    setSelectedContent(content);
  };

  return (
    <div className={classes.main}>
      <Header windowSize={windowSize} />
      <Body className={`${lng === 'fa' ? classes.fa : classes.en}`}>
        <Card className={classes.main_card}>
          <Breadcrumbs
            linkDataProp={[
              { pathname: t('home'), url: ' ' },
              { pathname: t('my_acc'), url: 'myaccount' },
            ]}
          />
          <section className={classes.container}>
            <div className={classes.accordion_wrapper}>
              {accordionsData.map(accordion => (
                <Accordion key={accordion.id}>
                  <AccordionSummary
                    expandIcon={<Add fontSize='10px' />}
                    aria-controls={`${accordion.id}-content`}
                    id={`${accordion.id}-header`}
                  >
                    <Typography
                      component='span'
                      style={{ fontSize: '.7rem', fontWeight: 'bold' }}
                      variant='h1'
                    >
                      {accordion.title}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    {accordion.buttons.map(button => (
                      <CustomButton
                        key={button.id}
                        onClick={() =>
                          handleButtonClick(button.id, button.content)
                        }
                      >
                        {button.title}
                      </CustomButton>
                    ))}
                  </AccordionDetails>
                </Accordion>
              ))}
            </div>

            <div className={classes.info_wrapper}>
              {selectedButtonId && (
                <div
                  className={classes.info_container}
                  title={`Content for ${selectedButtonId}`}
                >
                  <p>{selectedContent}</p>
                </div>
              )}
            </div>
          </section>
        </Card>
      </Body>
      <Footer />
    </div>
  );
};

export default Profile;
