import React,{Component} from 'react';
import {Table} from 'react-bootstrap';
import { requestData, getTableDataFromJSONObject } from "./common/CommonFunctions.js";
import {Button,ButtonToolbar} from 'react-bootstrap';
import {CloseTask} from './CloseTask';
import {NavLink} from 'react-router-dom';


export class ControlFinishedTasks extends Component{
    constructor(props){
        super(props);
        this.state = {tasks:[], closeShow:false, projectID:[], code:"", code2:"", projectID:0};
    }

    selectFinished(){
        fetch(process.env.REACT_APP_API+'task')
        .then(response=>response.json())
        .then(data=>{
            for (let task of data) {
                task.creation_date = task.creation_date.slice(0, 10);
            }
            this.setState({tasks:data});
        });
    }

    async getMainVersionCode(taskid){
        var rez = await fetch(process.env.REACT_APP_API+'task/projectID/'+taskid)
        .then(response=>response.json())
        //.then(data=>data[0].ProjectId);	
        //alert("project id " + rez[0].ProjectId)		
        //return rez[0].ProjectId;
        this.setState({projectID:rez[0].ProjectId})
        var rez2 = await fetch(process.env.REACT_APP_API+'branch/projectBranch/'+rez[0].ProjectId)
        .then(response=>response.json())
        //alert("versionId id " + rez2[0].versionId)
    
        var rez3 = await fetch(process.env.REACT_APP_API+'codeline/versionCode/'+rez2[0].versionId)
        .then(response=>response.json())
        //.then(data=>this.setState({projectID:data}))
    
        var code = "";
        for (let l of rez3) {   
            code += l.line + "\n"
        }
        console.log(code)
        this.setState({code:code})
        return await code
    
    }

    async getBranchVersionCode(taskid){
    
        var rez = await fetch(process.env.REACT_APP_API+'branch/taskBranch/'+taskid)
        .then(response=>response.json())
        //alert("versionId id " + rez2[0].versionId)
    
        var rez2 = await fetch(process.env.REACT_APP_API+'codeline/versionCode/'+rez[0].versionId)
        .then(response=>response.json())
        //.then(data=>this.setState({projectID:data}))
    
        var code = "";
        for (let l of rez2) {   
            code += l.line + "\n"
        }
        console.log(code)
        this.setState({code2:code})
        return await code
    
    }

    
    componentDidMount(){
        this.selectFinished();
    }

    componentDidUpdate(){
        this.selectFinished();
    }

    render(){
        const {tasks, taskId, projectID, taskState, code, code2}=this.state;
        let closeShow=()=>this.setState({closeShow:false});
        return(
            <div class="col-lg-12  text-center">
                <h1>All finished tasks</h1>
                <Table className="mt-4" striped bordered hover size="sm">
                    <thead>
                        <tr>
                            <th>Task name</th>
                            <th>Task description</th>
                            <th>Task type</th>
                            <th>Task points</th>
                            <th>Task creation date</th>
                            <th>Sprint</th>
                            <th>Option</th>
                        </tr>
                    </thead>
                    <tbody>
                    {tasks.map(task=>
                            <tr key={task.id}>
                                <td>{task.name}</td>
                                <td>{task.description}</td>
                                <td>{task.taskType}</td>
                                <td>{task.points}</td>
                                <td>{task.creation_date}</td>
                                <td>{task.sprintName}</td>
                                <td >
                                        <ButtonToolbar>
                                            <Button className="mr-2" variant="info"
                                             onClick={()=>{this.setState({closeShow:true,
                                                taskId:task.id, taskState:task.state}); this.getMainVersionCode(task.id); this.getBranchVersionCode(task.id);}}>
                                                    Close task
                                            </Button>
                                            
                                            { <CloseTask show={this.state.closeShow}
                                                onHide={closeShow}
                                                taskId={taskId}
                                                projectID={projectID}
                                                code={code}
                                                code2={code2}
                                                /> }
                                        </ButtonToolbar>

                                </td>
                            </tr>)}
                    </tbody>
                </Table>
            </div>
        )
    }
}