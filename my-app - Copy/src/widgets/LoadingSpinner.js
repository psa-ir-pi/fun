import React from "react";
import classNames from "classnames";
import PropTypes from "prop-types";
import "font-awesome/css/font-awesome.min.css";

const LoadingSpinner = props => (
  <div className={classNames("-loading", { "active -active": props.loading })}>
    <div id="spinner" style={{ top: "50%" }}>
      <i
        className="fa fa-spinner fa-pulse fa-3x fa-fw"
        style={{ fontSize: 36, color: "#ef6c00" }}
      />
    </div>
  </div>
);

LoadingSpinner.propTypes = {
  loading: PropTypes.bool
};

export default LoadingSpinner;
