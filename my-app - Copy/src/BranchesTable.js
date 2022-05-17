import React, { useRef, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { requestData, getTableDataFromJSONObject } from "./common/CommonFunctions.js";
import ReactTable from "react-table-6";
import RecordCount from "./widgets/RecordCount.js";
import "./index.css";
import VersionsTable from "./VersionsTable.js";   

const BranchesTable = (props) => {

  const _isMounted = useRef(false);
  const postTableRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [pages, setPages] = useState(null);
  const [data, setData] = useState([]);
  const [totalRecords, setTotalRecords] = useState(null);
  const sort = [{"id": "id","desc": false}];
  
  function getBranches() {
    return requestData(
      "/branch/" + props.Id,
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
  }, []);

  function fetchData(state) {
    let pageSize = state === undefined ? 5 : state.pageSize;
    let page = state === undefined ? 0 : state.page;
    let sorted = state === undefined ? sort : state.sorted;
    setLoading(true);
    
    getBranches()
      .then(res => {
        getTableDataFromJSONObject(res.data, pageSize, page, sorted, "branches")
          .then(result => {
            if (_isMounted.current) {
              console.log(result)
              setLoading(false);
              setPages(result.pages === undefined ? 0 : result.pages);
              setData(result.rows[0].branches);
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
                Header: "Name",
                accessor: "name",
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
            SubComponent={row => {     
              return (
                
                <div style={{ padding: "10px" }}>
                  <h3>
                    Versions
                  </h3>
                  <VersionsTable
                    Id={row.original.id}
                  />
                </div>
              );
            }}      
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

BranchesTable.propTypes = {
  Id: PropTypes.number,
};

export default BranchesTable;