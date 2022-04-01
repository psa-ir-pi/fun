import React,{Component} from 'react';
import {Table} from 'react-bootstrap';

import {Button,ButtonToolbar} from 'react-bootstrap';
import {CreateProject} from './CreateProject';
import {EditProject} from './EditProject';

export class AllProjects extends Component{

    constructor(props){
        super(props);
        this.state={projects:[], createShow:false, editShow:false}
    }

    refreshList(){
        fetch(process.env.REACT_APP_API+'project')
        .then(response=>response.json())
        .then(data=>{
            this.setState({projects:data});
        });
    }

    componentDidMount(){
        this.refreshList();
    }

    componentDidUpdate(){
        this.refreshList();
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
        console.log("Hello world!");
        const {projects, projectId,projectName, projectDate, projectDescription}=this.state;//delete projectDescription mayby
        let createClose=()=>this.setState({createShow:false});
        let editClose=()=>this.setState({editShow:false});
        return(
            <div >
                <Table className="mt-4" striped bordered hover size="sm">
                    <thead>
                        <tr>
                            <th>ProjectId</th>
                            <th>ProjectName</th>
                            <th>Options</th>
                        </tr>
                    </thead>
                    <tbody>
                        {projects.map(proj=>
                            <tr key={proj.id}>
                                <td>{proj.id}</td>
                                <td>{proj.name}</td>
                                <td>
                                        <ButtonToolbar>
                                            <Button className="mr-2" variant="info"
                                            onClick={()=>this.setState({editShow:true,
                                                projectId:proj.id,projectName:proj.Name})}>
                                                    Edit
                                                </Button>

                                                <Button className="mr-2" variant="danger"
                                            onClick={()=>this.deleteProject(proj.id)}>
                                                    Delete
                                                </Button>

                                                <EditProject show={this.state.editShow}
                                                onHide={editClose}
                                                projectId={projectId}
                                                projectName={projectName}/>
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