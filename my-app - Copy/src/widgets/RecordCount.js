import React from "react";
import PropTypes from "prop-types";

const RecordCount = ({ ...props }) => {
  const { state, makeTable, totalRecords } = props;
  let recordsInfoText = "";
  const { pageRows, pageSize, sortedData, page } = state;

  if (sortedData && sortedData.length > 0) {
    let recordsCountFrom = page * pageSize + 1;
    let recordsCountTo = recordsCountFrom + pageRows.length - 1;
    recordsInfoText = `Showing ${recordsCountFrom} - ${recordsCountTo} of ${totalRecords} records`;
  } else recordsInfoText = "";

  return (
    <div>
      {makeTable()}
      <div className="RightAlignedText">
        <div className="col-sm-12">
          <b>{recordsInfoText}</b>
        </div>
      </div>
    </div>
  );
};

RecordCount.propTypes = {
  state: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  makeTable: PropTypes.func,
  totalRecords: PropTypes.number
};

export default RecordCount;
