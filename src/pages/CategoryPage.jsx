import React from "react";

import classes from "./CategoryPage.module.css";
import ChangeLanguage from "../utils/ChangeLanguage";

const CategoryPage = () => {
  return (
    <div className={classes.main}>
      <ChangeLanguage />
    </div>
  );
};

export default CategoryPage;
