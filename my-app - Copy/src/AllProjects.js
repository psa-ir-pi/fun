import React,{Component} from 'react';
import {Table} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import {Button,ButtonToolbar} from 'react-bootstrap';
import {CreateProject} from './CreateProject';
import {EditProject} from './EditProject';
import { format } from 'date-fns'

export class AllProjects extends Component{

    constructor(props){
        super(props);
        this.state={projects:[], createShow:false, editShow:false}
        this.state2 = {tasks:[]};
    }

    getProjects(){
        fetch(process.env.REACT_APP_API+'project')
        .then(response=>response.json())
        .then(data=>{
            for (let project of data) {
                project.date = project.date.slice(0, 10);
            }
            this.setState({projects:data});
        });
    }

    componentDidMount(){
        this.getProjects();
    }

    componentDidUpdate(){
    }

    // gets all tasks assigned to project and test whether they are Uzdaryti
    testIfAllTasksFinished(projectid){
        fetch(process.env.REACT_APP_API+'task/')
        .then(response=>response.json())
        .then(data=>{
            this.setState({tasks:data});
        });
        var flag = false;
        const {tasks} = this.state2
        tasks.map((task)=>{
            if (task.busena=='Uzdaryta')flag=true;
        });
        return flag;
    }

    // first calls a func testIfAllTasksFinished and then ask for confirmation to delete project by id
    deleteProject(projectId){
        const flag = this.testIfAllTasksFinished(projectId);
        if(flag){
            if(window.confirm('There are unfinished tasks. \nAre you sure you want to delete the project?')){
                fetch(process.env.REACT_APP_API+'project/'+projectId,{
                    method:'DELETE',
                    header:{'Accept':'application/json',
                'Content-Type':'application/json'}
                });
            }
        }else{
            if(window.confirm('Are you sure?')){
                fetch(process.env.REACT_APP_API+'project/'+projectId,{
                    method:'DELETE',
                    header:{'Accept':'application/json',
                    'Content-Type':'application/json'}
                });
            }
        }
        setTimeout(() => {
            this.getProjects();
        }, 500);
    }

    render(){
        const {projects, projectId,projectName, projectDate, projectDescription}=this.state;//delete projectDescription mayby
        let createClose=()=>{this.setState({createShow:false})
        this.getProjects();};
        let editClose=()=>{this.setState({editShow:false})
        this.getProjects();};
        return(
            <div className="col-lg-12  text-center">
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
                                <td>{proj.date}</td>
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
                                                <Link to={'/ProjectMember/'+proj.id}>
                                                    <Button className="mr-2" variant="primary">
                                                        Members
                                                    </Button>
                                                </Link>
                                                <Button className="mr-2" variant="secondary">
                                                    Statistic
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