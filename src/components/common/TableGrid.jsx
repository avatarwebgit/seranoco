import React, { useEffect, useState } from 'react';
import classes from './TableGrid.module.css';

const TableGrid = ({ dataProp }) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    if (dataProp) {
      //   console.log(dataProp);
      setData(dataProp);
    }
  }, [dataProp]);

  const sizes = data?.map(item => item.size) || [];

  return (
    <div className={classes.main}>
      <table>
        <thead className={classes.table_head}>
          <tr>
            <th>
              <div></div>
            </th>
            {data?.map((el, index) => (
              <th key={index}>
                <div className={classes.img_container}>
                  <img src={el.primary_image} alt='' />
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className={classes.table_body}>
          {sizes.map((size, index) => (
            <tr key={index}>
              <td>
                <div className={classes.title}>{size}</div>
              </td>

              {data?.map((el, productIndex) => (
                <td className={classes.data_text} key={productIndex}>
                  {el.size === size ? 'Avalable' : 'Not Available'}{' '}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableGrid;
