import React, { useRef, useState, useEffect } from "react";
import { requestData, getTableDataFromJSONObject } from "./common/CommonFunctions.js";

import ReactTable from "react-table-6";
import LoadingSpinner from "./widgets/LoadingSpinner.js";
import RecordCount from "./widgets/RecordCount.js";
import { ReactTableDefaults } from "react-table-6";
import SprintsTable from "./SprintsTable.js";                                                 //---> 1

import "./index.css";
import "react-table/react-table.css";

//Set default values of React Table
Object.assign(ReactTableDefaults, {
  multiSort: false,
  LoadingComponent: LoadingSpinner
});

const MyProjects = () => {

  const _isMounted = useRef(false);
  const userTableRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [pages, setPages] = useState(null);
  const [data, setData] = useState([]);
  const [totalRecords, setTotalRecords] = useState(null);
  const sort = [{"id": "id","desc": false}];
  
  function getProjects() {

    return requestData(
      "/project",
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
    
    getProjects()
      .then(res => {
        for (let el of res.data) {
          el.date = el.date.slice(0, 10);
      }
        getTableDataFromJSONObject(res.data, pageSize, page, sorted, "users")
          .then(result => {
            if (_isMounted.current) {
              console.log(result.rows[0].users)
              setLoading(false);
              setPages(result.pages === undefined ? 0 : result.pages);
              setData(result.rows[0].users);
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
  console.log(data)
  return (
    <React.Fragment>
    	<div style={{ textAlign: "center", padding: "35px" }}>
        <h3>
            Projects
        </h3>
        <p />
        <ReactTable
            ref={userTableRef}
            columns={[
              {
                Header: "Id",
                accessor: "id",
                width: 70,
                headerClassName: "BoldText ColoredText"
              },
              {
                Header: "Name",
                accessor: "name",
                className: "LeftAlignedText",
                headerClassName: "BoldText ColoredText"
              },
              {
                Header: "Date",
                accessor: "date",
                className: "LeftAlignedText",
                headerClassName: "BoldText ColoredText"
              },
              {
                Header: "Description",
                accessor: "description",
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
                    Sprints
                  </h3>
                  <SprintsTable
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

export default MyProjects;