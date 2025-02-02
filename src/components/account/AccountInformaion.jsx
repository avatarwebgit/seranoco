import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import Wrapper from './Wrapper';
import Body from '../filters_page/Body';
import Card from '../filters_page/Card';

import { ReactComponent as Edit } from '../../assets/svg/edit-black.svg';

import {
  IconButton,
  Input,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from '@mui/material';

import AddressTable from './accountInformation/AddressTable';
import { getAllAddresses, removeAddress } from '../../services/api';

import classes from './AccountInformation.module.css';
import { Add, Delete } from '@mui/icons-material';
import { notify } from '../../utils/helperFunctions';
import { cartActions } from '../../store/store';
const AccountInformaion = () => {
  const { t } = useTranslation();
  const userData = useSelector(state => state.userStore.user);
  const lng = useSelector(state => state.localeStore.lng);
  const token = useSelector(state => state.userStore.token);

  const abortControllerRef = useRef(new AbortController());

  const dispatch = useDispatch()

  const [addressData, setAddressData] = useState([]);
  const [user, setUser] = useState(null);
  const [fields, setFields] = useState([
    {
      label: t('signup.fname'),
      value: null,
      updateAble: true,
      sec: 'username',
    },
    {
      label: t('signup.lname'),
      value: null,
      updateAble: true,
      sec: 'lastname',
    },
    { label: t('signup.email'), value: null, updateAble: true, sec: 'email' },
    { label: t('signup.pnumber'), value: null, updateAble: false },
    { label: t('signup.country'), value: null, updateAble: false },
    { label: t('signup.city'), value: null, updateAble: false },
  ]);

  const [edits, setEdits] = useState({
    username: false,
    lastname: false,
    email: false,
  });

  useEffect(() => {
    if (userData) {
      setUser(userData);
      setFields([
        {
          label: t('signup.fname'),
          value: userData.first_name,
          updateAble: true,
          sec: 'username',
        },
        {
          label: t('signup.lname'),
          value: userData.last_name,
          updateAble: true,
          sec: 'lastname',
        },
        {
          label: t('signup.email'),
          value: userData.email,
          updateAble: true,
          sec: 'email',
        },
        { label: t('signup.pnumber'), value: userData.cellphone },
        { label: t('signup.country'), value: userData.Country },
        { label: t('signup.city'), value: userData.City },
      ]);
    }
  }, [userData]);

  const allAddresses = async () => {
    console.log(';laskfdjklsajf')
    abortControllerRef.current.abort();
    abortControllerRef.current = new AbortController();
    const serverRes = await getAllAddresses(token, {
      signal: abortControllerRef.current.signal,
    });
    if (serverRes.response.ok) {
      setAddressData(serverRes.result.address);
    }
  };

  useEffect(() => {
    allAddresses();
  }, []);

  const handleSubmit = () => {
    // Handle form submission logic here (e.g., API call to save data)
  };

  const handleEditClick = field => {
    setEdits(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleChange = (e, field) => {
    setFields(prev =>
      prev.map(el =>
        el.sec === field ? { ...el, value: e.target.value } : el,
      ),
    );
  };

  const hnadleDeleteAddress = async (e, token, id) => {
    e.preventDefault();
    e.stopPropagation();
    const serverRes = await removeAddress(token, id);
    if (serverRes.response.ok) {
      notify(t('profile.suc_rem_add'));
      allAddresses();
    } else {
      notify(t('profile.err_rem_add'));
    }
  };

  return (
    <section>
      {user && (
        <>
          <Body>
            <Card className={classes.main}>
              <h3
                className={classes.title}
                style={{ direction: lng === 'fa' ? 'rtl' : 'ltr' }}
              >
                {t('wellcome')} {lng === 'en' && t('back')} {user.first_name}{' '}
                {user.last_name}
              </h3>
              <Wrapper>
                <h4 className={classes.title}>{t('profile.acc_info')}</h4>
                <form onSubmit={handleSubmit}>
                  <div
                    className={classes.wrapper}
                    style={{ direction: lng === 'fa' ? 'rtl' : 'ltr' }}
                  >
                    {fields.map((el, index) => {
                      return (
                        <div className={classes.content} key={index}>
                          <div className={classes.values}>
                            <span className={classes.label}>{el.label}</span>
                            {el.updateAble ? (
                              edits[el.sec] ? (
                                <Input
                                  className={classes.value}
                                  value={el.value}
                                  onChange={e => handleChange(e, el.sec)}
                                  sx={{ fontSize: '13px' }}
                                />
                              ) : (
                                <span className={classes.value}>
                                  {el.value}
                                </span>
                              )
                            ) : (
                              <span className={classes.value}>{el.value}</span>
                            )}
                          </div>
                          {el.updateAble && (
                            <IconButton onClick={() => handleEditClick(el.sec)}>
                              <Edit width={17} height={17} />
                            </IconButton>
                          )}
                        </div>
                      );
                    })}
                    <div className={classes.adress}>
                      <div className={classes.values}>
                        <span className={classes.title}>
                          {t('profile.addresses')}
                        </span>
                        <span className={classes.value}></span>
                      </div>
                    </div>
                  </div>
                </form>
              </Wrapper>
              <Wrapper>
                <h4 className={classes.title}>{t('profile.add_add')}</h4>
                <AddressTable refetch={allAddresses} />
              </Wrapper>
              {addressData && addressData.length > 0 && (
                <>
                  <h4 className={classes.title}>{t('profile.urad')}</h4>
                  {addressData.map(el => (
                    <Wrapper>
                      <Accordion key={el.id} sx={{ boxShadow: 'none' }}>
                        {/* Ensure each Accordion has a unique key */}
                        <AccordionSummary
                          expandIcon={<Add fontSize='small' />}
                          aria-controls={`${el.id}-content`}
                          id={`${el.id}-header`}
                        >
                          <Typography
                            component='span'
                            style={{ fontSize: '.7rem', fontWeight: 'bold' }}
                            variant='h1'
                          >
                            {el.address}
                          </Typography>
                          <IconButton
                            onClick={e => hnadleDeleteAddress(e, token, el.id)}
                            sx={{ marginLeft: 'auto' }}
                            size='small'
                          >
                            <Delete fontSize='small' />
                          </IconButton>
                        </AccordionSummary>
                        <AccordionDetails>
                          <AddressTable formData={el} />
                        </AccordionDetails>
                      </Accordion>
                    </Wrapper>
                  ))}
                </>
              )}
            </Card>
          </Body>
        </>
      )}
    </section>
  );
};

export default AccountInformaion;
