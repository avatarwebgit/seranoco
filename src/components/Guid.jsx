import React from "react";

import CustomSection from "../layout/CustomSection";
import Link from "./Link";

import classes from "./Guid.module.css";
const Guid = () => {
  return (
    <CustomSection card={classes.card} className={classes.main}>
      <Link/>
      <Link/>
      <Link/>
    </CustomSection>
  );
};

export default Guid;
