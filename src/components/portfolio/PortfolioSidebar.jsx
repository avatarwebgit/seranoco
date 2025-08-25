import React, { useState, useEffect, useCallback } from "react";
import classes from "./PortfolioSidebar.module.css";
import { KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material";
import { Skeleton } from "@mui/material";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const isAncestorOfActive = (item, activeFilterName) => {
  if (!item.children || item.children.length === 0) {
    return false;
  }
  return item.children.some(
    (sub) =>
      sub.title === activeFilterName ||
      isAncestorOfActive(sub, activeFilterName)
  );
};

const findPath = (nodes, activeName, path = []) => {
  for (const node of nodes) {
    const newPath = [...path, node.title];
    if (node.title === activeName) {
      return newPath;
    }
    if (node.children) {
      const result = findPath(node.children, activeName, newPath);
      if (result) {
        return result;
      }
    }
  }
  return null;
};

const PortfolioSidebar = ({
  categories,
  activeFilter,
  onFilterChange,
  isPlain = false,
  loading = false,
}) => {
  const [openCategories, setOpenCategories] = useState({});
  const lng = useSelector((state) => state.localeStore.lng);

  const navigate = useNavigate();

  const findItemById = useCallback((nodes, id) => {
    for (const node of nodes) {
      if (String(node.id) === String(id)) {
        return node;
      }
      if (node.children) {
        const found = findItemById(node.children, id);
        if (found) {
          return found;
        }
      }
    }
    return null;
  }, []);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const categoryId = urlParams.get("category");

    if (categoryId && categories.length > 0) {
      const activeItem = findItemById(categories, categoryId);
      if (activeItem) {
        onFilterChange(activeItem.title);
      }
    }
  }, [categories, findItemById, onFilterChange]);

  useEffect(() => {
    if (!loading && activeFilter) {
      const path = findPath(categories, activeFilter);
      if (path) {
        setOpenCategories((prevOpen) => {
          const newOpen = { ...prevOpen };
          let needsUpdate = false;
          path.slice(0, -1).forEach((title) => {
            if (!newOpen[title]) {
              newOpen[title] = true;
              needsUpdate = true;
            }
          });
          return needsUpdate ? newOpen : prevOpen;
        });
      }
    }
  }, [activeFilter, categories, loading]);

  const handleToggle = (categoryName) => {
    setOpenCategories((prev) => ({
      ...prev,
      [categoryName]: !prev[categoryName],
    }));
  };

  if (loading) {
    return (
      <aside className={`${classes.sidebar} ${isPlain ? classes.plain : ""}`}>
        <h2 className={classes.sidebarTitle}>
          <Skeleton width="80%" />
        </h2>
        <nav>
          <ul className={classes.menu}>
            {[...Array(6)].map((_, index) => (
              <li key={index} className={classes.menuItem}>
                <Skeleton
                  variant="text"
                  height={45}
                  style={{ borderRadius: "4px" }}
                  animation={"wave"}
                  key={index}
                />
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    );
  }

  const renderMenuItem = (item, level = 0) => {
    const hasSubCategories = item.children && item.children.length > 0;
    const isActive = activeFilter === item.title;
    const isParentOfActive = isAncestorOfActive(item, activeFilter);
    const isOpen = !!openCategories[item.title];

    return (
      <li
        key={item.title}
        className={`${classes.menuItem} ${
          level > 0 ? classes.subMenuItem : ""
        }`}
      >
        <div className={classes.menuLinkWrapper}>
          <a
            onClick={(e) => {
              e.preventDefault();
              navigate(`?category=${item.id}`);
            }}
            href={`?category=${item.id}`}
            className={`${classes.menuLink} ${
              isActive || isParentOfActive ? classes.active : ""
            }`}
          >
            {item.title}
          </a>
          {hasSubCategories && (
            <button
              onClick={() => handleToggle(item.title)}
              className={classes.toggleButton}
              aria-label={`Toggle ${item.title} sub-menu`}
              aria-expanded={isOpen}
            >
              {lng === "en" ? (
                <KeyboardArrowRight
                  className={`${classes.arrowIcon} ${
                    isOpen ? classes.arrowIconOpen : ""
                  }`}
                />
              ) : (
                <KeyboardArrowLeft
                  className={`${classes.arrowIcon} ${
                    isOpen ? classes.arrowIconOpen_fa : ""
                  }`}
                />
              )}
            </button>
          )}
        </div>
        {hasSubCategories && (
          <ul
            className={`${classes.subMenu} ${
              isOpen ? classes.subMenuOpen : ""
            }`}
          >
            {item.children.map((subItem) => renderMenuItem(subItem, level + 1))}
          </ul>
        )}
      </li>
    );
  };

  return (
    <aside
      className={`${classes.sidebar} ${isPlain ? classes.plain : ""}`}
      dir={lng === "fa" ? "rtl" : "ltr"}
    >
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
