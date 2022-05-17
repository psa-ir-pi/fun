import React,{Component} from 'react';
import {Table} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import {Button,ButtonToolbar} from 'react-bootstrap';
import {CreateTasks} from './CreateTasks';
import { format } from 'date-fns'

export class ControlTasks extends Component{

    constructor(props){
        super(props);
        this.state={tasks:[], createShow:false}
    }

    getAllTasks(){
        fetch(process.env.REACT_APP_API+'ControlTasks/'+this.props.match.params.sprintid)
        .then(response=>response.json())
        .then(data=>{
            for (let task of data) {
                task.creation_date = task.creation_date.slice(0, 10);
                task.closing_date = task.closing_date.slice(0, 10);
            }
            this.setState({sprints:data});
        });
    }

    componentDidMount(){
        this.getAllTasks();
    }

    componentDidUpdate(){
    }

    render(){
        const tasks=this.state.tasks
        let createClose=()=>{this.setState({createShow:false});
        this.getAllTasks()};
        return(
            <div className="col-lg-12  text-center">
                <h1>Tasks assigned to sprint {this.props.match.params.sprintName}</h1>
                <Table className="mt-4" striped bordered hover size="sm">
                    <thead>
                        <tr>
                            <th>Task name</th>
                            <th>Task's description</th>
                            <th>Task state</th>
                            <th>Task's closing date</th>
                            <th>Assigned member</th>
                            <th>Options</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tasks.map(task=>
                            <tr key={task.id}>
                                <td>{task.name}</td>
                                <td>{task.description}</td>
                                <td>{task.state}</td>
                                <td>{task.closing_date}</td>
                                <td>{task.userName}</td>
                                <td >
                                        <ButtonToolbar>
                                        <Button className="mr-2" variant="danger">
                                            Edit
                                        </Button>
                                        <Button className="mr-2" variant="danger">
                                            Delete
                                        </Button>
                                                <Link to={'/AssignManually/'+tasks.id}>
                                                    <Button className="mr-2" variant="primary">
                                                        Assign task manually 
                                                    </Button>
                                                </Link>
                                        </ButtonToolbar>

                                </td>

                            </tr>)}
                    </tbody>

                </Table>

                <ButtonToolbar>
                    <Button variant='primary'
                    onClick={()=>this.setState({createShow:true})}>
                    Add Task</Button>

                    {/* <CreateTasks show={this.state.createShow}
                    onHide={createClose}
                    projectid={this.props.match.params.userid}
                    /> */}
                </ButtonToolbar>
            </div>
        )
    }
}