import React,{Component} from 'react';
import {Table} from 'react-bootstrap';

import {Button,ButtonToolbar} from 'react-bootstrap';
import {CreateProject} from './CreateProject';
import {EditProject} from './EditProject';
import { format } from 'date-fns'

export class AllProjects extends Component{

    constructor(props){
        super(props);
        this.state={projects:[], createShow:false, editShow:false}
    }

    getProjects(){
        fetch(process.env.REACT_APP_API+'project')
        .then(response=>response.json())
        .then(data=>{
            this.setState({projects:data});
        });
    }

    componentDidMount(){
        this.getProjects();
    }

    componentDidUpdate(){
        this.getProjects();
    }

    deleteProject(projectId){
        if(window.confirm('Are you sure?')){
            fetch(process.env.REACT_APP_API+'project/'+projectId,{
                method:'DELETE',
                header:{'Accept':'application/json',
            'Content-Type':'application/json'}
            })
        }
    }
    render(){
        const {projects, projectId,projectName, projectDate, projectDescription}=this.state;//delete projectDescription mayby
        console.log(projects)
        let createClose=()=>this.setState({createShow:false});
        let editClose=()=>this.setState({editShow:false});
        return(
            <div class="col-lg-12  text-center">
                <h1>All projects</h1>
                <Table className="mt-4" striped bordered hover size="sm">
                    <thead>
                        <tr>
                            <th>Project name</th>
                            <th>Project creation date</th>
                            <th>Options</th>
                        </tr>
                    </thead>
                    <tbody>
                        {projects.map(proj=>
                            <tr key={proj.id}>
                                <td>{proj.name}</td>
                                <td>{proj.date.slice(0, 10)}</td>
                                <td >
                                        <ButtonToolbar>
                                            <Button className="mr-2" variant="info"
                                            onClick={()=>this.setState({editShow:true,
                                                projectId:proj.id, projectDate:proj.date, projectName:proj.name, projectDescription:proj.description})}>
                                                    Edit
                                                </Button>

                                                <Button className="mr-2" variant="danger"
                                            onClick={()=>this.deleteProject(proj.id)}>
                                                    Delete
                                                </Button>

                                                <EditProject show={this.state.editShow}
                                                onHide={editClose}
                                                projectId={projectId}
                                                projectName={projectName}
                                                projectDescription={projectDescription}
                                                projectDate={projectDate}
                                                />
                                        </ButtonToolbar>

                                </td>

                            </tr>)}
                    </tbody>

                </Table>

                <ButtonToolbar>
                    <Button variant='primary'
                    onClick={()=>this.setState({createShow:true})}>
                    Add Project</Button>

                    <CreateProject show={this.state.createShow}
                    onHide={createClose}/>
                </ButtonToolbar>
            </div>
        )
    }
}