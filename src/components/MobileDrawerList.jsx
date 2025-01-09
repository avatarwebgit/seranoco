import React, { useEffect, useState } from 'react';
import { Menu } from 'antd';

import classes from './MobileDrawerList.module.css';
import { getHeaderMenus } from '../services/api';
const items = [
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
  //   {
  //     key: "alipay",
  //     label: (
  //       <a href="https://ant.design" target="_blank" rel="noopener noreferrer">
  //         Navigation Four - Link
  //       </a>
  //     ),
  //   },
];
const MobileDrawerList = () => {
  const [current, setCurrent] = useState('mail');
  const [items, setItems] = useState(null);

  // const getHeaderLinks = async () => {
  //   setitems(null);
  //   const serverRes = await getHeaderMenus(lng);
  //   console.log(serverRes.result);
  //   if (serverRes.response.ok) {
  //     setitems(serverRes.result);
  //   }
  // };

  // useEffect(() => {
  //   getHeaderLinks();
  // }, []);

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
