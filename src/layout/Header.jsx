import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Menu, Search as MUISearch, Login } from '@mui/icons-material';
import { Badge, Box, Drawer, IconButton, Input } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Skeleton } from '@mui/material';

// import logo from '../assets/svg/Serano-Logo.svg';
import CustomButton from '../components/CustomButton';
import CustomSection from './CustomSection';
import Search from '../components/Search';
import MobileDrawerList from '../components/MobileDrawerList';
import ChangeLanguage from '../utils/ChangeLanguage';

import { basicInformation, getHeaderMenus } from '../services/api';

import close from '../assets/svg/close.svg';
import { ReactComponent as Heart } from '../assets/svg/heart.svg';
import { ReactComponent as Basket } from '../assets/svg/basket.svg';

import classes from './Header.module.css';
const Header = ({ windowSize }) => {
  const [scrollY, setScrollY] = useState(0);
  const [size, setSize] = useState('');
  const [isSmall, setIsSmall] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [headerData, setHeaderData] = useState(null);
  const [logo, setLogo] = useState(null);

  const test = [1, 2, 3, 4, 5, 6, 7];

  const { t } = useTranslation();
  const lng = useSelector(state => state.localeStore.lng);

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
  }, [windowSize]);

  const initialLogoState = {
    y: 0,
    x: 0,
  };

  const returnButtonStyles = () => {
    if (size === 'xs' || size === 's' || size === 'm') {
      setIsSmall(true);
      return {
        opacity: scrollY === 0 ? '0' : '1',
        marginTop: !scrollY === 0 ? '0' : '2rem',
      };
    } else {
      setIsSmall(false);
      return {
        alignItems: scrollY === 0 ? 'flex-end' : 'center',
        marginTop: scrollY === 0 ? '0rem' : '0',
      };
    }
  };
  const returnLogoStyles = () => {
    if (size === 'xs' || size === 's' || size === 'm') {
      setIsSmall(true);
      return {
        x: '25vw',
        y: 0,
        width: scrollY === 0 ? '50%' : '50%',
      };
    } else {
      setIsSmall(false);
      return {
        x: scrollY === 0 ? '31vw' : 0,
        y: scrollY === 0 ? '-20px' : 0,
        width: scrollY === 0 ? '25%' : '20%',
      };
    }
  };

  const closeDrawer = v => {
    setDrawerOpen(v);
  };

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  // API calls
  const getHeaderLinks = async () => {
    setHeaderData(null);
    const serverRes = await getHeaderMenus(lng);
    if (serverRes.response.ok) {
      setHeaderData(serverRes.result);
    }
  };

  const getHeaderLogo = async () => {
    setLogo(null);
    const serverRes = await basicInformation(lng);
    if (serverRes.response.ok) {
      setLogo(serverRes.result?.data.at(0).image);
    }
  };

  useEffect(() => {
    getHeaderLinks();
    getHeaderLogo();
  }, []);

  return (
    <motion.header
      className={classes.main}
      initial={{ y: 0, height: '5rem' }}
      animate={{
        y: scrollY !== 0 ? 0 : '6vh',
        height: scrollY !== 0 ? '4rem' : isSmall ? '5rem' : '5rem',
        backgroundColor:
          scrollY !== 0 ? 'rgba(255,255,255,0.5)' : 'transparent',
        backdropFilter: scrollY !== 0 ? 'blur(20px)' : 'none',
      }}
    >
      <CustomSection className={classes.content} card={classes.card}>
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
          transition={{ duration: 0 }}
        >
          {isSmall ? (
            ''
          ) : (
            <CustomButton className={classes.login_btn}>
              <a href='#'>{t('login')}</a>
            </CustomButton>
          )}

          {isSmall && (
            <span className={classes.icon_pack_wrapper}>
              <IconButton>
                <Login sx={{ width: '30px', height: '30px' }} />
              </IconButton>
            </span>
          )}
          <span className={classes.icon_pack_wrapper}>
            <IconButton>
              <Badge
                badgeContent={4}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              >
                <Heart width={25} height={25} />
              </Badge>
            </IconButton>
          </span>
          <span className={classes.icon_pack_wrapper}>
            <IconButton>
              <Badge
                badgeContent={4}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              >
                <Basket width={25} height={25} />
              </Badge>
            </IconButton>
          </span>
          {!isSmall && (
            <span className={classes.icon_pack_wrapper}>
              <ChangeLanguage className={classes.card_icons} />
            </span>
          )}
        </motion.span>
        <motion.span
          className={classes.logo_container}
          initial={initialLogoState}
          animate={returnLogoStyles}
          transition={{ duration: 0.25, type: 'tween' }}
        >
          {logo && (
            <motion.img
              className={classes.logo_img}
              src={logo}
              alt='Seranoco Logo'
              initial={{ opacity: 0 }}
              animate={{ opacity: logo ? 1 : 1 }}
              variant={'rectangular'}
            />
          )}
        </motion.span>
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
                  const isFullUrl = elem.url.charAt(0) === '/' ? false : true;
                  return (
                    <div className={classes.header_btn_wrapper} key={i}>
                      <a
                        href={`${isFullUrl ? elem.url : '/en' + elem.url}`}
                        className={classes.header_btn}
                      >
                        <motion.button
                          className={classes.header_btn}
                          id='basic-button'
                          aria-controls={open ? 'basic-menu' : undefined}
                          aria-haspopup='true'
                          aria-expanded={open ? 'true' : undefined}
                          onMouseEnter={event => handleClick(event)}
                        >
                          {elem.title}
                        </motion.button>
                      </a>

                      {/* Mega menu paper */}
                      {/* {elem.children && (
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
                      )} */}
                      {elem.children &&
                        elem.children.map((subLink, i) => {
                          return (
                            <motion.div className={classes.mega_paper} key={i}>
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
                    key={i}
                  />
                );
              })}
        </motion.span>
        <motion.span
          className={`${classes.search_container}`}
          initial={{ alignItems: 'flex-start' }}
          animate={{ alignItems: scrollY === 0 ? 'flex-start' : 'center' }}
        >
          {isSmall ? (
            <>
              <ChangeLanguage />
              <IconButton onClick={() => closeDrawer(true)}>
                <Menu className={classes.card_icons} />
              </IconButton>
              <Drawer
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
                          <MUISearch />
                        </>
                      }
                    />
                    <MobileDrawerList />
                  </div>
                </Box>
              </Drawer>
            </>
          ) : (
            <Search />
          )}
        </motion.span>
      </CustomSection>
    </motion.header>
  );
};

export default Header;
