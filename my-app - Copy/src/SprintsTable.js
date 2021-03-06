import React, { useRef, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { requestData, getTableDataFromJSONObject } from "./common/CommonFunctions.js";
import ReactTable from "react-table-6";
import RecordCount from "./widgets/RecordCount.js";
import "./index.css";
import TasksTable from "./TasksTable.js";                                          
import { useHistory } from "react-router-dom";


const SprintsTable = (props) => {

  const _isMounted = useRef(false);
  const postTableRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [pages, setPages] = useState(null);
  const [data, setData] = useState([]);
  const [totalRecords, setTotalRecords] = useState(null);
  const sort = [{"id": "id","desc": false}];

  
  
  function getSprints() {
    return requestData(
      "/sprint/" + props.Id,
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
    
    getSprints()
      .then(res => {
        for (let el of res.data) {
          el.date = el.date.slice(0, 10);
      }
        getTableDataFromJSONObject(res.data, pageSize, page, sorted, "sprints")
          .then(result => {
            if (_isMounted.current) {
              console.log(result)
              setLoading(false);
              setPages(result.pages === undefined ? 0 : result.pages);
              setData(result.rows[0].sprints);
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
  const history = useHistory();
    const sprintPage = (id) => {
      history.push("/sprint/"+id)
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
                Header: "View sprint",
                accessor: "id",
                Cell: cell => (
                <button className="btn btn-success" 
                onClick={() =>sprintPage(cell.original.id)}>Kanban board
                </button>
                )
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
                    Tasks
                  </h3>
                  <TasksTable
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

SprintsTable.propTypes = {
  Id: PropTypes.number,
};

export default SprintsTable;