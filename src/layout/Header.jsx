import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search as MUISearch } from '@mui/icons-material';
import {
  Badge,
  Box,
  Drawer as MuiDrawer,
  IconButton,
  Input,
  Menu,
  Tooltip,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { Skeleton } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { nanoid } from '@reduxjs/toolkit';

import close from '../assets/svg/close.svg';

import { accesModalActions, drawerActions } from '../store/store';

import CustomSection from './CustomSection';
import Search from '../components/Search';
import MobileDrawerList from '../components/MobileDrawerList';
import ChangeLanguage from '../utils/ChangeLanguage';

import { useBasicInformation, getHeaderMenus } from '../services/api';

import { ReactComponent as Heart } from '../assets/svg/heart_white.svg';
import { ReactComponent as Basket } from '../assets/svg/basket_white.svg';
import { ReactComponent as Heart_black } from '../assets/svg/heart.svg';
import { ReactComponent as Basket_black } from '../assets/svg/basket.svg';
import { ReactComponent as Signin } from '../assets/svg/signin.svg';
import { ReactComponent as Signin_White } from '../assets/svg/signin_white.svg';

import classes from './Header.module.css';
import AccessAccount from './AccessAccount';
import LoginButton from '../components/header/LoginButton';
const Header = ({ windowSize }) => {
  const { data: basicInformation } = useBasicInformation('en');

  const [scrollY, setScrollY] = useState(0);
  const [size, setSize] = useState('');
  const [isSmall, setIsSmall] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isFixed, setIsFixed] = useState(true);
  const [headerData, setHeaderData] = useState(null);
  const [logo, setLogo] = useState(null);
  const [isHomePage, setIsHomePage] = useState(true);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const test = [1, 2, 3, 4, 5, 6, 7];

  const lng = useSelector(state => state.localeStore.lng);
  const cart = useSelector(state => state.cartStore);
  const token = useSelector(state => state.userStore.token);
  const modalOpen = useSelector(state => state.accessModalStore.modalOpen);

  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    window.addEventListener('load', () => setScrollY(window.scrollY));
    window.addEventListener('scroll', () => setScrollY(window.scrollY));

    return () => {
      window.removeEventListener('load', () => setScrollY(window.scrollY));
      window.removeEventListener('scroll', () => setScrollY(window.scrollY));
    };
  }, []);

  useEffect(() => {
    setSize(windowSize);
    setIsFixed(location.pathname.split('/').length <= 2 ? true : false);
  }, [windowSize, location.pathname]);

  const initialLogoState = {
    y: 0,
    x: 0,
  };

  const returnButtonStyles = () => {
    let style = {};

    if (size === 'xs' || size === 's' || size === 'm') {
      setIsSmall(true);
      style = {
        opacity: scrollY === 0 ? '0' : '1',
        marginTop: scrollY === 0 ? '5px' : '0px',
      };
    } else {
      setIsSmall(false);
      style = {
        alignItems: scrollY === 0 ? 'flex-end' : 'center',
        marginTop: scrollY === 0 ? '5px' : '0px',
      };
    }

    return style;
  };

  const returnLogoStyles = () => {
    if (size === 'xs') {
      setIsSmall(true);
      return {
        left: scrollY === 0 ? '50%' : '25%',
      };
    } else if (size === 's') {
      setIsSmall(true);
      return {
        left: scrollY === 0 ? '50%' : '25%',
      };
    } else if (size === 'm') {
      return {
        left: scrollY === 0 ? '50%' : '25%',
      };
    } else if (size === 'l') {
      return {
        left: scrollY === 0 ? '50%' : '25%',
      };
    } else {
      setIsSmall(false);
      return {
        left: scrollY === 0 ? '50%' : '15%',
      };
    }
  };

  const closeDrawer = v => {
    setDrawerOpen(v);
  };

  const handleOpenCart = () => {
    dispatch(drawerActions.open());
  };

  const handleOpenModal = () => {
    dispatch(accesModalActions.login());
  };

  const open = Boolean(anchorEl);
  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  useEffect(() => {
    if (location.pathname === `/${lng}`) {
      setIsHomePage(true);
    } else {
      setIsHomePage(false);
    }
  }, [location.pathname]);

  useEffect(() => {
    if (isHomePage && basicInformation && basicInformation !== undefined) {
      setLogo(basicInformation?.data.at(0)?.image);
    } else {
      setLogo(basicInformation?.data.at(0)?.image_white);
    }
  }, [basicInformation, isHomePage]);

  // API calls
  const getHeaderLinks = async () => {
    setHeaderData(null);
    const serverRes = await getHeaderMenus(i18n.language);
    if (serverRes.response.ok) {
      setHeaderData(serverRes.result);
    }
  };

  useEffect(() => {
    getHeaderLinks();
  }, []);

  const handleCloseModal = () => {
    dispatch(accesModalActions.close());
  };

  return (
    <motion.header
      className={classes.main}
      initial={{ y: 0, height: '5rem' }}
      animate={{
        y: isHomePage && scrollY === 0 ? '50px' : 0,
        height: scrollY !== 0 ? '3.5rem' : isSmall ? '4rem' : '5rem',
        backgroundColor:
          scrollY !== 0 ? 'rgba(255,255,255,0.5)' : 'rgba(0, 0, 0, 0)',
        backdropFilter: scrollY !== 0 ? 'blur(20px)' : 'none',
      }}
      style={{ position: isFixed ? 'fixed' : 'sticky' }}
      transition={{
        type: 'spring',
        duration: 0.3,
        ease: 'linear',
      }}
    >
      <CustomSection
        className={classes.content}
        card={`${classes.card} ${
          isHomePage ? classes.transparent : classes.black
        }`}
      >
        <motion.span
          className={classes.card_action_wrapper}
          initial={{ display: 'flex', alignItems: 'flex-start' }}
          animate={{
            display:
              scrollY === 0
                ? isSmall
                  ? 'flex'
                  : 'flex'
                : isSmall
                ? 'flex'
                : 'none',
            alignItems: scrollY === 0 ? 'flex-start' : 'center',
          }}
          transition={{ delay: scrollY === 0 ? 0.2 : 0, duration: 0 }}
        >
          {!isSmall && (
            <>
              {token ? (
                <LoginButton />
              ) : (
                <>
                  <IconButton
                    className={classes.login_btn}
                    onClick={handleOpenModal}
                    ishomepage={isHomePage}
                  >
                    <Tooltip title={t('login')} placement='top' arrow>
                      {isHomePage ? (
                        <Signin width={32} height={32} />
                      ) : (
                        <Signin_White width={32} height={32} />
                      )}
                    </Tooltip>
                  </IconButton>
                </>
              )}
            </>
          )}

          <span className={classes.icon_pack_wrapper}>
            <IconButton>
              <Badge
                // badgeContent={1}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              >
                <Tooltip
                  title={t('favorites')}
                  placement='top'
                  arrow
                  sx={{
                    '& .MuiTooltip-tooltip': {
                      backgroundColor: 'red', // Change background color
                    },
                  }}
                >
                  {isHomePage ? (
                    <Heart_black
                      width={isSmall ? '0px' : '30px'}
                      height={isSmall ? '0px' : '30px'}
                    />
                  ) : (
                    <Heart
                      width={isSmall ? '0px' : '30px'}
                      height={isSmall ? '0px' : '30px'}
                    />
                  )}
                </Tooltip>
              </Badge>
            </IconButton>
          </span>
          <span className={classes.icon_pack_wrapper}>
            <IconButton onClick={handleOpenCart}>
              <Badge
                badgeContent={cart?.products.length || 0}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              >
                <Tooltip title={t('cart')} placement='top' arrow>
                  {isHomePage ? (
                    <Basket_black
                      width={isSmall ? '0px' : '30px'}
                      height={isSmall ? '0px' : '30px'}
                    />
                  ) : (
                    <Basket
                      width={isSmall ? '0px' : '30px'}
                      height={isSmall ? '0px' : '30px'}
                    />
                  )}
                </Tooltip>
              </Badge>
            </IconButton>
          </span>
          {!isSmall && (
            <span className={classes.icon_pack_wrapper}>
              <ChangeLanguage
                className={classes.card_icons}
                ishomepage={isHomePage}
              />
            </span>
          )}
        </motion.span>
        <motion.a
          className={classes.logo_container}
          initial={initialLogoState}
          animate={returnLogoStyles}
          transition={{ duration: 0.1, type: 'tween' }}
          href={`/${lng}`}
        >
          {logo && (
            <motion.img
              className={classes.logo_img}
              src={logo}
              alt='Seranoco Logo'
              initial={{ opacity: 0 }}
              animate={{ opacity: logo ? 1 : 1 }}
            />
          )}
        </motion.a>
        <motion.span
          className={classes.navigation_container}
          initial={{ alignItems: 'center', marginTop: '0' }}
          animate={returnButtonStyles}
        >
          {/* Header buttons  */}
          {headerData
            ? headerData
                .sort((a, b) => {
                  return lng === 'en' ? a.id - b.id : b.id - a.id;
                })
                .map((elem, i) => {
                  let isFullUrl;
                  if (elem.url) {
                    isFullUrl = elem.url.charAt(0) === '/' ? false : true;
                  } else {
                    isFullUrl = null;
                  }

                  return (
                    <div className={classes.header_btn_wrapper} key={nanoid()}>
                      <a
                        href={`${
                          isFullUrl ? elem.url : '/en' + elem.url || '#'
                        }`}
                        className={classes.header_btn}
                      >
                        <motion.button
                          className={classes.header_btn}
                          id='basic-button'
                          aria-controls={open ? 'basic-menu' : undefined}
                          aria-haspopup='true'
                          aria-expanded={open ? 'true' : undefined}
                          onMouseEnter={event => handleClick(event)}
                          style={{ color: isHomePage ? '#000000' : '#ffffff' }}
                        >
                          {elem.label}
                        </motion.button>
                      </a>

                      {/* Mega menu paper */}
                      {elem.children && (
                        <motion.div className={classes.mega_paper}>
                          <div className={classes.sub_menu_wrapper}>
                            <p className={classes.sub_menu_text}>test</p>
                          </div>
                          <div className={classes.link_menu_wrapper}>
                            <span></span>
                            <span></span>
                            <span></span>
                            <span></span>
                          </div>
                        </motion.div>
                      )}
                      {elem.children &&
                        elem.children.map((sublink, i) => {
                          return (
                            <div key={nanoid()}>
                              <motion.div
                                className={classes.mega_paper}
                                key={i}
                              >
                                <div className={classes.sub_menu_wrapper}>
                                  <p className={classes.sub_menu_text}>
                                    {sublink.label}
                                  </p>
                                </div>
                                <div className={classes.link_menu_wrapper}>
                                  <span></span>
                                  <span></span>
                                  <span></span>
                                  <span></span>
                                </div>
                                <div className={classes.backdrop} />
                              </motion.div>
                            </div>
                          );
                        })}
                    </div>
                  );
                })
            : test.map((_, i) => {
                return (
                  <Skeleton
                    className={classes.header_btn_skeleton}
                    variant='text'
                    key={nanoid()}
                  />
                );
              })}
        </motion.span>
        <motion.span
          className={`${classes.search_container}`}
          initial={{ alignItems: 'flex-start' }}
          animate={{ marginTop: scrollY === 0 ? '2rem' : '2rem' }}
          transition={{ type: 'spring', damping: 100, stiffness: 1000 }}
        >
          {isSmall ? (
            <>
              <ChangeLanguage width={30} height={30} ishomepage={isHomePage} />
              <IconButton onClick={() => closeDrawer(true)}>
                <Menu
                  className={classes.card_icons}
                  sx={{
                    width: '20px',
                    height: '20px',
                    color: isHomePage ? '#000000' : '#ffffff',
                  }}
                />
              </IconButton>
              <MuiDrawer
                anchor={'right'}
                open={drawerOpen}
                onClose={() => closeDrawer(false)}
              >
                <Box
                  sx={{
                    width: '90vw',
                    height: '100%',
                  }}
                >
                  <div className={classes.drawer_content}>
                    <button
                      className={classes.drawer_close}
                      onClick={() => closeDrawer(false)}
                    >
                      <img
                        className={classes.drawer_close_img}
                        src={close}
                        alt=''
                      />
                    </button>
                    <Input
                      className={classes.menu_input}
                      endAdornment={
                        <>
                          <MUISearch sx={{ color: 'white' }} />
                        </>
                      }
                    />
                    <MobileDrawerList />
                  </div>
                </Box>
              </MuiDrawer>
            </>
          ) : (
            <Search isHomePage={isHomePage} />
          )}
        </motion.span>
      </CustomSection>
      <AccessAccount open={modalOpen} onClose={handleCloseModal} />
    </motion.header>
  );
};

export default Header;
