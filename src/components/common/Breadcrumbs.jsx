import React from 'react';
import {
  Breadcrumbs as MuiBreadcrumbs,
  Typography,
  Link,
  Skeleton,
} from '@mui/material';
import { useSelector } from 'react-redux';

// prop structure:
// [ { pathname:'',url:'' }, {pathname:'',url:'' } ]
const Breadcrumbs = ({ linkDataProp }) => {
  const lng = useSelector(state => state.localeStore.lng);
  return (
    <MuiBreadcrumbs
      aria-label='breadcrumb'
      separator='>'
      sx={{
        marginBottom: '1rem',
        width: '100%',
        direction: lng === 'fa' ? 'rtl' : 'ltr',
      }}
    >
      {linkDataProp.map((el, index) => {
        if (index === linkDataProp.length - 1) return;
        return (
          <Link
            underline='hover'
            color='inherit'
            href={`/${lng}/${el.url}`}
            sx={{
              fontSize: '0.5rem !important',
              textDecoration: 'underline !important',
            }}
          >
            {el.pathname}
          </Link>
        );
      })}
      (
      <Typography
        color='black'
        href={`/${lng}/${linkDataProp[linkDataProp.length - 1].url}`}
        sx={{ fontSize: '0.5rem' }}
      >
        {linkDataProp[linkDataProp.length - 1].pathname}
      </Typography>
      )
    </MuiBreadcrumbs>
  );
};

export default Breadcrumbs;
