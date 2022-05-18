import React,{Component} from 'react';
import {Table} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import {Button,ButtonToolbar} from 'react-bootstrap';
import {CreateSprint} from './CreateSprint';
import { format } from 'date-fns'

export class ControlSprint extends Component{

    constructor(props){
        super(props);
        this.state={sprints:[], createShow:false}
    }

    getAllSprints(){
        fetch(process.env.REACT_APP_API+'ControlSprint/'+this.props.match.params.userid)
        .then(response=>response.json())
        .then(data=>{
            for (let sprint of data) {
                sprint.date = sprint.date.slice(0, 10);
            }
            this.setState({sprints:data});
        });
    }

    componentDidMount(){
        this.getAllSprints();
    }

    componentDidUpdate(){
    }

    render(){
        const sprints=this.state.sprints
        let createClose=()=>{this.setState({createShow:false});
            this.getAllSprints()};
        return(
            <div className="col-lg-12  text-center">
                <h1>All user sprints</h1>
                <Table className="mt-4" striped bordered hover size="sm">
                    <thead>
                        <tr>
                            <th>Sprint name</th>
                            <th>Sprint creation date</th>
                            <th>Project's</th>
                            <th>Options</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sprints.map(sprint=>
                            <tr key={sprint.id}>
                                <td>{sprint.name}</td>
                                <td>{sprint.date}</td>
                                <td>{sprint.projectName}</td>
                                <td >
                                        <ButtonToolbar>
                                        <Button className="mr-2" variant="danger">
                                            Edit
                                        </Button>
                                        <Button className="mr-2" variant="danger">
                                            Delete
                                        </Button>
                                                <Link to={'/ControlTasks/'+sprint.id+"/"+sprint.name}>
                                                    <Button className="mr-2" variant="primary">
                                                        Tasks
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
                    Add Sprint</Button>

                    <CreateSprint show={this.state.createShow}
                    onHide={createClose}
                    userid={this.props.match.params.userid}
                    />
                </ButtonToolbar>
            </div>
        )
    }
}