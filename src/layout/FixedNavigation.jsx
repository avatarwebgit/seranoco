import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { accesModalActions, drawerActions } from '../store/store';

import { ReactComponent as Basket } from '../assets/svg/basket_white.svg';
import { ReactComponent as Heart } from '../assets/svg/heart_white.svg';

import { AccountCircle, Login } from '@mui/icons-material';
import { Badge, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AccessAccount from './AccessAccount';
import classes from './FixedNavigation.module.css';
const FixedNavigation = () => {
 const [ModalOpen, setModalOpen] = useState(false);

 const dispatch = useDispatch();

 const navigate = useNavigate();

 const lng = useSelector(state => state.localeStore.lng);
 const accessModal = useSelector(state => state.accessModalStore);
 const token = useSelector(state => state.userStore.token);
 const cart = useSelector(state => state.cartStore);
 const favorits = useSelector(state => state.favoriteStore.products);

 const handleOpenCart = () => {
  dispatch(drawerActions.open());
 };

 const handleOpenLogin = () => {
  setModalOpen(true);
  dispatch(accesModalActions.login());
 };

 const handleCloseModal = () => {
  dispatch(accesModalActions.close());
 };

 const handleOpenFavoritesDrawer = () => {
  dispatch(drawerActions.favoritesOpen());
 };

 const handleNavToAcc = () => {
  navigate(`/${lng}/myaccount`);
 };

 return (
  <div className={classes.main}>
   <>
    {token ? (
     <IconButton onClick={handleNavToAcc}>
      <AccountCircle
       width={'20px'}
       height={'20px'}
       className={classes.avatar}
       sx={{ color: '#fff' }}
      />
     </IconButton>
    ) : (
     <IconButton onClick={handleOpenLogin}>
      <Login width={'20px'} height={'20px'} className={classes.svg} />
     </IconButton>
    )}
   </>

   {token && (
    <IconButton onClick={handleOpenFavoritesDrawer}>
     <Badge
      badgeContent={favorits?.length || 0}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
      <Heart width={'23px'} height={'23px'} className={classes.svg} />
     </Badge>
    </IconButton>
   )}

   <IconButton onClick={handleOpenCart}>
    <Badge
     badgeContent={cart?.products.length || 0}
     anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
     <Basket width={'23px'} height={'23px'} className={classes.svg} />
    </Badge>
   </IconButton>

   <AccessAccount open={accessModal.modalOpen} onClose={handleCloseModal} />
  </div>
 );
};

export default FixedNavigation;
