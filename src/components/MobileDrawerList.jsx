import React, { useEffect, useState } from 'react';
import { Menu } from 'antd';

import classes from './MobileDrawerList.module.css';
import { getHeaderMenus, useHeaderMenus } from '../services/api';
import { useSelector, useDispatch } from 'react-redux';

import { userActions } from '../store/store';
import { useTranslation } from 'react-i18next';
import { Logout } from '@mui/icons-material';
import { Link } from 'react-router-dom';
const itemss = [
 {
  label: 'Navigation One',
  key: 'mail',
  children: [
   {
    type: 'group',
    label: 'Item 1',
    children: [
     {
      label: 'Option 1',
      key: 'setting:1',
     },
     {
      label: 'Option 2',
      key: 'setting:2',
     },
    ],
   },
   {
    type: 'group',
    label: 'Item 2',
    children: [
     {
      label: 'Option 3',
      key: 'setting:3',
     },
     {
      label: 'Option 4',
      key: 'setting:4',
     },
    ],
   },
  ],
 },
 {
  label: 'Navigation Two',
  key: 'app',
  // disabled: true,
  children: [
   {
    type: 'group',
    label: 'Item 1',
    children: [
     {
      label: 'Option 1',
      key: 'setting:1',
     },
     {
      label: 'Option 2',
      key: 'setting:2',
     },
    ],
   },
   {
    type: 'group',
    label: 'Item 2',
    children: [
     {
      label: 'Option 3',
      key: 'setting:3',
     },
     {
      label: 'Option 4',
      key: 'setting:4',
     },
    ],
   },
  ],
 },
 {
  label: 'Navigation Three - Submenu',
  key: 'SubMenu',
  children: [
   {
    type: 'group',
    label: 'Item 1',
    children: [
     {
      label: 'Option 1',
      key: 'setting:1',
     },
     {
      label: 'Option 2',
      key: 'setting:2',
     },
    ],
   },
   {
    type: 'group',
    label: 'Item 2',
    children: [
     {
      label: 'Option 3',
      key: 'setting:3',
     },
     {
      label: 'Option 4',
      key: 'setting:4',
     },
    ],
   },
  ],
 },
 {
  key: 'alipay',
  label: (
   <a href='https://ant.design' target='_blank' rel='noopener noreferrer'>
    Navigation Four - Link
   </a>
  ),
 },
];
const MobileDrawerList = () => {
 const lng = useSelector(state => state.localeStore.lng);
 const { data } = useHeaderMenus(lng);

 const [current, setCurrent] = useState('mail');
 const [items, setItems] = useState(null);
 const [struc, setStruc] = useState(null);

 const dispatch = useDispatch();

 const { t } = useTranslation();

 const handleLogOut = () => {
  dispatch(userActions.reset());
 };

 useEffect(() => {
  let updatedItems = [];
  if (data) {
   data.map(el => {
    if (el.label === 'کلیه خدمات') console.log(el);
    console.log(el);
    if (el.children) {
     const children = [];
     el.children.map(child => {
      if (child.url) {
       children.push({
        label: <Link to={child.url}>{child.label}</Link>,
        key: child.key,
       });
      } else if (child.alias) {
       children.push({
        label: <Link to={`/${lng}/page/${child.alias}`}>{child.label}</Link>,
        key: child.key,
       });
      } else {
       children.push({
        label: child.label,
        key: child.key,
       });
      }
     });
     updatedItems.push({ label: el.label, key: el.key, children });
    } else {
     updatedItems.push({
      label: el.label,
      key: el.key,
     });
    }
   });
  }

  updatedItems.push({
   key: 'logout',
   id: 'logout',
   label: <div onClick={handleLogOut}>{t('logout')}</div>,
   icon: <Logout />,
  });

  setItems(updatedItems);
 }, [data]);

 const onClick = e => {
  setCurrent(e.key);
 };

 return (
  <>
   {items && (
    <Menu
     onClick={onClick}
     selectedKeys={[current]}
     mode='inline'
     items={items}
     className={classes.main}
    />
   )}
  </>
 );
};

export default MobileDrawerList;
