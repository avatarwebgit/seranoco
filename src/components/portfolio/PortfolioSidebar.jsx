import React, { useState, useEffect } from "react";
import classes from "./PortfolioSidebar.module.css";
import { KeyboardArrowRight } from "@mui/icons-material";

const PortfolioSidebar = ({
  categories,
  activeFilter,
  onFilterChange,
  isPlain = false,
}) => {
  const [openCategories, setOpenCategories] = useState({});

  useEffect(() => {
    // When activeFilter changes, ensure its parent category is open.
    const parent = categories.find((cat) =>
      cat.subCategories?.some((sub) => sub.name === activeFilter)
    );
    if (parent && !openCategories[parent.name]) {
      setOpenCategories((prev) => ({ ...prev, [parent.name]: true }));
    }
  }, [activeFilter, categories]);

  const handleToggle = (categoryName) => {
    setOpenCategories((prev) => ({
      ...prev,
      [categoryName]: !prev[categoryName],
    }));
  };

  const renderMenuItem = (item, level = 0) => {
    const hasSubCategories =
      item.subCategories && item.subCategories.length > 0;
    const isActive = activeFilter === item.name;
    const isParentOfActive =
      hasSubCategories &&
      item.subCategories.some((sub) => sub.name === activeFilter);
    const isOpen = !!openCategories[item.name];

    return (
      <li
        key={item.name}
        className={`${classes.menuItem} ${
          level > 0 ? classes.subMenuItem : ""
        }`}
      >
        <div className={classes.menuLinkWrapper}>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onFilterChange(item.name);
              if (hasSubCategories && !isOpen) {
                // Open on click if it has subs and is closed
                handleToggle(item.name);
              }
            }}
            className={`${classes.menuLink} ${
              isActive || isParentOfActive ? classes.active : ""
            }`}
          >
            {item.name}
          </a>
          {hasSubCategories && (
            <button
              onClick={() => handleToggle(item.name)}
              className={classes.toggleButton}
              aria-label={`Toggle ${item.name} sub-menu`}
              aria-expanded={isOpen}
            >
              <KeyboardArrowRight
                className={`${classes.arrowIcon} ${
                  isOpen ? classes.arrowIconOpen : ""
                }`}
              />
            </button>
          )}
        </div>
        {hasSubCategories && (
          <ul
            className={`${classes.subMenu} ${
              isOpen ? classes.subMenuOpen : ""
            }`}
          >
            {item.subCategories.map((subItem) =>
              renderMenuItem(subItem, level + 1)
            )}
          </ul>
        )}
      </li>
    );
  };

  return (
    <aside className={`${classes.sidebar} ${isPlain ? classes.plain : ""}`}>
      <h2 className={classes.sidebarTitle}>Categories</h2>
      <nav>
        <ul className={classes.menu}>
          {categories.map((category) => renderMenuItem(category))}
        </ul>
      </nav>
    </aside>
  );
};

export default PortfolioSidebar;
