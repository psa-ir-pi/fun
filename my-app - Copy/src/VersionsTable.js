import React, { useRef, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { requestData, getTableDataFromJSONObject } from "./common/CommonFunctions.js";

import ReactTable from "react-table-6";
import LoadingSpinner from "./widgets/LoadingSpinner.js";
import RecordCount from "./widgets/RecordCount.js";

import "./index.css";


const VersionsTable = (props) => {

  const _isMounted = useRef(false);
  const postTableRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [pages, setPages] = useState(null);
  const [data, setData] = useState([]);
  const [totalRecords, setTotalRecords] = useState(null);
  const sort = [{"id": "id","desc": false}];

  
  
  function getVersions() {
    return requestData(
      "/version/" + props.Id,
      {},
      "get"
    );

  }
  
  useEffect(() => {

    _isMounted.current = true;
    fetchData();

    return () => {
      _isMounted.current = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function fetchData(state) {
    
    let pageSize = state === undefined ? 5 : state.pageSize;
    let page = state === undefined ? 0 : state.page;
    let sorted = state === undefined ? sort : state.sorted;
    setLoading(true);
    
    getVersions()
      .then(res => {
        for (let el of res.data) {
          el.date = el.date.slice(0, 10);
      }
        getTableDataFromJSONObject(res.data, pageSize, page, sorted, "versions")
          .then(result => {
            if (_isMounted.current) {
              console.log(result)
              setLoading(false);
              setPages(result.pages === undefined ? 0 : result.pages);
              setData(result.rows[0].versions);
              setTotalRecords(result.totalRecords);
            }
        })
        .catch(error => {
          console.warn(error);
          if (_isMounted.current) {
            setLoading(false);
          }
        });
      })
    .catch(error => {
      console.warn(error);
      if (_isMounted.current) {
        setLoading(false);
      }
    });
  }

  return (
    <React.Fragment>
    	<div style={{ textAlign: "center", padding: "35px" }}>
        <p />
        <ReactTable
            ref={postTableRef}
            columns={[
              {
                Header: "Id",
                accessor: "id",
                className: "LeftAlignedText",
                headerClassName: "BoldText ColoredText"
              },
              {
                Header: "Date",
                accessor: "date",
                className: "LeftAlignedText",
                headerClassName: "BoldText ColoredText"
              }
            ]}
            defaultSorted={[
              {
                id: "id",
                desc: false
              }
            ]}
            manual
            data={data}
            pages={pages}
            loading={loading}
            onFetchData={fetchData}
            defaultPageSize={5}
            className="-striped -highlight"
        >
          {(state, makeTable) => {
            return (
              <RecordCount
                state={state}
                makeTable={makeTable}
                totalRecords={totalRecords}
              />
            );
          }}
        </ReactTable>
    	</div>
    </React.Fragment>
  );
}

VersionsTable.propTypes = {
  Id: PropTypes.number,
};

export default VersionsTable;