import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

import Header from '../layout/Header';
import Footer from '../layout/Footer';
import Body from '../components/filters_page/Body';
import CustomSelect from '../components/filters_page/CustomSelect';
import Card from '../components/filters_page/Card';

import shape from '../assets/images/Shape1.png';

import classes from './FilterByShape.module.css';
import SizeBox from '../components/filters_page/SizeBox';
const FilterByShape = () => {
  const [shapeFormEntries, setShapeFormEntries] = useState(null);
  const [dimensionEntries, setDimensionEntries] = useState(null);

  const test = [
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1,
  ];
  const testDim = [50, 92, 71, 29, 58, 16, 62, 1, 74, 9, 63, 19, 12, 45, 88];

  const formRef = useRef();
  const sizeRef = useRef();

  const handleSendFormStatus = e => {
    const form = formRef.current;
    const formData = new FormData(form);
    const formEntries = Object.fromEntries(formData.entries());
    setShapeFormEntries(formEntries);
  };

  const handleSendDimensionsStatus = e => {
    const form = sizeRef.current;
    const formData = new FormData(form);
    const formEntries = Object.fromEntries(formData.entries());
    setDimensionEntries(formEntries);
  };

  useEffect(() => {
    console.log(shapeFormEntries);
  }, [shapeFormEntries]);

  return (
    <div className={classes.main}>
      <Header />
      <Body>
        <Card className={classes.multi_select_wrapper}>
          <form
            ref={formRef}
            onClick={handleSendFormStatus}
            className={classes.grid_form}
          >
            {test.map((elem, i) => {
              return <CustomSelect title={`${i}`} src={shape} key={i} />;
            })}
          </form>
        </Card>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{
            opacity: shapeFormEntries ? 1 : 0,
            y: shapeFormEntries ? 0 : 10,
          }}
        >
          <Card className={classes.size_wrapper}>
            <form
              ref={sizeRef}
              onClick={handleSendDimensionsStatus}
              className={classes.grid_form}
            >
              {testDim.map((elem, i) => {
                return <SizeBox value={`${elem}*${elem}`} key={elem} />;
              })}
            </form>
          </Card>
        </motion.div>
      </Body>
      <Footer />
    </div>
  );
};

export default FilterByShape;
