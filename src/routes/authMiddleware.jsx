import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const Authmiddleware = (props) => {
  const token = useSelector((state) => state.userStore.token);
  if (token) {
    return (
      <Navigate to={{ pathname: "/login", state: { from: props.location } }} />
    );
  }
  return <React.Fragment>{props.children}</React.Fragment>;
};

export default Authmiddleware;
