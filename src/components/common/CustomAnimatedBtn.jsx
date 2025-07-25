import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";

import classes from "./CustomAnimatedBtn.module.css";
import { Link } from "react-router-dom";
const CustomAnimatedBtn = ({ children, type = "dark", to, className }) => {
  const divRef = useRef();
  const [dimensions, setDimensions] = useState({
    width: 0,
    height: 0,
    top: 0,
    left: 0,
  });

  useEffect(() => {
    if (!divRef.current) return;

    const { width, height, top, left } = divRef.current.getBoundingClientRect();

    setDimensions({ width, height, top, left });
  }, [divRef.current]);

  return (
    <Link
      ref={divRef}
      className={`${classes.container} ${className}`}
      to={to}
      target="_blank"
    >
      <motion.svg
        className={classes.svg_border}
        width={dimensions.width + 250}
        height={dimensions.height + 100}
        viewBox={`0 0 ${dimensions.width + 100} ${dimensions.height + 100}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter
            id="neon"
            filterUnits="userSpaceOnUse"
            x="-50%"
            y="-50%"
            width="200%"
            height="200%"
          >
            <feGaussianBlur
              in="SourceGraphic"
              stdDeviation="2"
              result="blur2"
            />
            <feGaussianBlur
              in="SourceGraphic"
              stdDeviation="4"
              result="blur4"
            />
            <feGaussianBlur
              in="SourceGraphic"
              stdDeviation="6"
              result="blur6"
            />
            <feGaussianBlur
              in="SourceGraphic"
              stdDeviation="8"
              result="blur8"
            />
            <feGaussianBlur
              in="SourceGraphic"
              stdDeviation="10"
              result="blur8"
            />
            <feGaussianBlur
              in="SourceGraphic"
              stdDeviation="8"
              result="blur8"
            />

            <feMerge result="blur-merged">
              <feMergeNode in="blur10" />
              <feMergeNode in="blur20" />
              {/* <feMergeNode in='blur30' />
       <feMergeNode in='blur40' />
       <feMergeNode in='blur50' />
       <feMergeNode in='blur100' /> */}
            </feMerge>

            <feColorMatrix
              result="red-blur"
              in="blur-merged"
              type="matrix"
              values="0.5 0 0 0 0
          0 0.5 0 0 0
          0 0 0.5 0 0
          0 0 0 1 0"
            />
            <feMerge>
              <feMergeNode in="red-blur" />
              <feMergeNode in="blur5" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <svg className={classes.neon} x={50} y={50}>
          <motion.path
            d={`M 0 0 h ${dimensions.width} v ${dimensions.height} h -${dimensions.width} v -${dimensions.height}`}
            stroke={type === "dark" ? "black" : "white"}
            strokeWidth="2"
            animate={{
              pathLength: [0, 0.75],
              pathOffset: [0, 0.2],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              repeatType: "loop",
            }}
          />
        </svg>
      </motion.svg>

      <span className={type === "dark" ? classes.cb : classes.cw}>
        {children}
      </span>
    </Link>
  );
};

export default CustomAnimatedBtn;
