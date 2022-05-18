import React,{Component} from 'react';
import {Table} from 'react-bootstrap';
import {Button,ButtonToolbar} from 'react-bootstrap';
import {CreateTasks} from './CreateTasks';
import { AssignManually } from './AssignManually';

export class ControlTasks extends Component{

    constructor(props){
        super(props);
        this.state={tasks:[], createShow:false,assignShow:false}
    }

    getAllTasks(){
        fetch(process.env.REACT_APP_API+'ControlTasks/'+this.props.match.params.sprintid)
        .then(response=>response.json())
        .then(data=>{
            for (let task of data) {
                task.creation_date = task.creation_date.slice(0, 10);
                task.closing_date = task.closing_date.slice(0, 10);
            }
            this.setState({tasks:data});
        });
    }

    componentDidMount(){
        this.getAllTasks();
    }

    async automaticAssignment(task){
        const projMembers=
        await fetch(process.env.REACT_APP_API+'ControlTasks/GetSpecializedMembers/'+task.id)
        .then(response=>response.json())
        var specialist=[];
        for(const member of projMembers){
            if(member.specialization == task.type){
                specialist.push(member);
            }
        }
        if(specialist.length==0){
            alert("There are no members with same specialization!");
        }
        else{
            var availableMembers = [];
            for(const member of specialist){
                const maxPoints = this.findMemberMaxPoints(member);
                const usersPoints=
                await fetch(process.env.REACT_APP_API+'ControlTasks/GetUsersPoints/'+member.foreign_user)
                .then(response=>response.json());
                const leftPoints = this.findMemberFreePointTotal(maxPoints,usersPoints);
                if(leftPoints >= task.points){
                    availableMembers.push({user:member,leftP:leftPoints});
                }
            }
            if(availableMembers.length==0){
                alert("There are no members capable on taiking the tasks \ndue to not enough points left");
            }
            else{
                
                while(availableMembers.length>0){
                    const choosen = this.selectMember(availableMembers);
                    if(window.confirm('User\'s name:'+choosen.user.name+'\nUser\'s leftover points:'+choosen.leftP+"\nMembers left to choose from:"+availableMembers.length)){
                        fetch(process.env.REACT_APP_API+'ControlTasks/AddMemberToTask',{
                            method:'PUT',
                            headers:{
                                'Accept':'application/json',
                                'Content-Type':'application/json'
                            },
                            body:JSON.stringify({
                                id:task.id,
                                foreign_Team_member:choosen.user.id
                            })
                        })
                        .then(res=>res.json())
                        .then((result)=>{
                            alert(result);
                        },
                        (error)=>{
                            alert('Failed');
                        });
                        this.getAllTasks();
                        return;
                    }else{
                        availableMembers.splice(availableMembers.indexOf(choosen), 1);
                    }
                }
                alert("no members left!")
            }
        }
    }

    findMemberMaxPoints(member){
        return member.max_points;
    }
    selectMember(members){
        var choosenOne={};
        var maxP =0;
        for(const mem of members){
            if (mem.leftP>maxP){
                choosenOne = mem;
                maxP=mem.leftP;
            }
        }
        return choosenOne;
    }
    findMemberFreePointTotal(max,allPoints){
        var pointsUsed = 0;
        for(const point of allPoints){
            pointsUsed += point.points
        }
        return max-pointsUsed;
    }

    render(){
        const tasks=this.state.tasks
        let createClose=()=>{this.setState({createShow:false});
        this.getAllTasks()};
        let assignClose=()=>{this.setState({assignShow:false});
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
                                        <Button variant='primary'
                                        onClick={()=>this.setState({assignShow:true})}>
                                        Assign member manually</Button>

                                        <AssignManually show={this.state.assignShow}
                                        onHide={assignClose}
                                        task={task}
                                        />
                                        <Button className="mr-2" variant="primary"
                                        onClick={()=>this.automaticAssignment(task)}>
                                            Assign task automaticly  
                                        </Button>
                                        </ButtonToolbar>
                                </td>

                            </tr>)}
                    </tbody>

                </Table>

                <ButtonToolbar>
                    <Button variant='primary'
                    onClick={()=>this.setState({createShow:true})}>
                    Add Task</Button>

                    <CreateTasks show={this.state.createShow}
                    onHide={createClose}
                    sprintid={this.props.match.params.sprintid}
                    />
                </ButtonToolbar>
            </div>
        )
    }
}