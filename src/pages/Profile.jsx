import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { Add } from '@mui/icons-material';

import Header from '../layout/Header';
import Footer from '../layout/Footer';
import Card from '../components/filters_page/Card';
import Body from '../components/filters_page/Body';
import Breadcrumbs from '../components/common/Breadcrumbs';
import { CustomButton } from '../components/account/CustomButton';
import OrderStatus from '../components/account/OrderStatus';
import AccountInformaion from '../components/account/AccountInformaion';

import { userActions } from '../store/store';

import { useUser } from '../services/api';

import classes from './Profile.module.css';
import Favorites from '../components/account/Favorites';
const Profile = ({ windowSize }) => {
  const [selectedButtonId, setSelectedButtonId] = useState(null);
  const [selectedContent, setSelectedContent] = useState(null);
  const [userData, setuserData] = useState(null);

  const token = useSelector(state => state.userStore.token);
  const lng = useSelector(state => state.localeStore.lng);
  const { t } = useTranslation();

  const { data, isLoading, isError } = useUser(token);

  const dispatch = useDispatch();

  useEffect(() => {
    if (data) {
      setuserData(data);
      dispatch(userActions.setUser(data.user));
    }
  }, [data]);

  const accordionsData = [
    {
      id: 'accordion1',
      title: t('my_acc'),
      expanded: true,
      buttons: [
        {
          id: 'btn1',
          title: t('profile.acc_info'),
          content: <AccountInformaion />,
        },
        {
          id: 'btn2',
          title: t('profile.favorites'),
          content: <Favorites />,
        },
      ],
    },
    {
      id: 'accordion2',
      title: t('profile.orders'),
      buttons: [
        {
          id: 'btn4',
          title: t('profile.pending'),
          content: 'Content for Button 3',
        },
        {
          id: 'btn45',
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

  useEffect(() => {
    setSelectedButtonId(accordionsData.at(0).buttons.at(0).id);
    setSelectedContent(accordionsData.at(0).buttons.at(0).content);
  }, []);

  const handleButtonClick = (id, content) => {
    setSelectedButtonId(id);
    setSelectedContent(content);
  };

  const handleAccordionChange = accordionId => {
    return accordionsData.some(accordion =>
      accordion.buttons.some(button => button.id === selectedButtonId),
    );
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
                <Accordion
                  key={accordion.id}
                  // expanded={handleAccordionChange(accordion.id)}
                >
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
                        isActive={button.id === selectedButtonId}
                      >
                        {button.title}
                      </CustomButton>
                    ))}
                  </AccordionDetails>
                </Accordion>
              ))}
              <CustomButton
                onClick={() => handleButtonClick(dispatch(userActions.reset()))}
                className={classes.logout_btn}
              >
                {t('logout')}
              </CustomButton>
            </div>

            <div className={classes.info_wrapper}>
              {selectedButtonId && (
                <div className={classes.info_container}>{selectedContent}</div>
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
