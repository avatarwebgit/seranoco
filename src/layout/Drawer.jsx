import React from 'react';
import { Box, Drawer as MuiDrawer } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { drawerActions } from '../store/store';
import classes from './Drawer.module.css';

const Drawer = ({ children }) => {
  const drawerState = useSelector(state => state.drawerStore.open);
  const dispatch = useDispatch();

  const toggleDrawer = newOpen => () => {
    if (newOpen) {
      dispatch(drawerActions.open());
    } else {
      dispatch(drawerActions.close());
    }
  };

  return (
    <div
      className={`${classes.main} ${
        drawerState ? classes.open : classes.close
      }`}
    >
      <div className={classes.content}>{children}</div>
      {drawerState && (
        <div className={classes.backdrop} onClick={toggleDrawer(false)} />
      )}
    </div>
  );
};

export default Drawer;
