import React,{Component} from 'react';
import {Table} from 'react-bootstrap';
import {Button,ButtonToolbar,Form,Row,Col} from 'react-bootstrap';

export class ProjectMember extends Component{

    constructor(props){
        super(props);
        this.state={members:[],availableUser:[],projectid:this.props.match.params.id,specialization:[{id:1, name:'Tester'},{id:2, name:'Back end'},{id:3, name:'Front end'},{id:4, name:'Designer'}]};
        this.addUserToTeam=this.addUserToTeam.bind(this);
    }

    getInfo(){
        fetch(process.env.REACT_APP_API+'projectMember/'+this.state.projectid)
        .then(response=>response.json())
        .then(data=>{
            this.setState({members:data});
        });
    }

    componentDidMount(){
        this.getInfo();
        this.getUsersNotInProject();
    }

    // gets all tasks assigned to team member and test whether they are closed
    checkTasks(memberId){
        const tasks=[];
        fetch(process.env.REACT_APP_API+'task/TeamMemberTasks/'+memberId)
        .then(response=>response.json())
        .then(data=>{
            this.tasks=data;
        });
        var flag = false;
        tasks.map(task=>{
            if (task.state != 4)flag=true;
        });
        return flag;
    }

    getUsersNotInProject(){
        fetch(process.env.REACT_APP_API+'projectMember/GetNonParticipants/'+this.state.projectid)
        .then(response=>response.json())
        .then(data=>{
            this.setState({availableUser:data});
        });
    }

    // first calls a func testIfAllTasksFinished and then ask for confirmation to delete project by id
    deleteMemberFromTeam(memberId){
        const flag = this.checkTasks(memberId);
        if(flag){
            if(window.confirm('There are unfinished tasks. \nAre you sure you want to delete the project?')){
                fetch(process.env.REACT_APP_API+'projectMember/'+memberId,{
                    method:'DELETE',
                    header:{'Accept':'application/json',
                'Content-Type':'application/json'}
                })
                .then(res=>res.json())
                .then((result)=>{
                    alert(result);
                });  
            }
        }else{
            if(window.confirm('Are you sure?')){
                fetch(process.env.REACT_APP_API+'projectMember/'+memberId,{
                    method:'DELETE',
                    header:{'Accept':'application/json',
                    'Content-Type':'application/json'}
                })
                .then(res=>res.json())
                .then((result)=>{
                    alert(result);
                });  
            }
        }
        setTimeout(() => {
            this.getInfo();
            this.getUsersNotInProject();
        }, 500);
        

    }

    addUserToTeam(event){
        const projid = this.state.projectid;
        event.preventDefault();
        fetch(process.env.REACT_APP_API+'projectmember',{
            method:'POST',
            headers:{
                'Accept':'application/json',
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                specialization:event.target.specialization.value,
                foreign_user:event.target.userid.value,
                foreign_project:projid
            })
        })
        .then(res=>res.json())
        .then((result)=>{
            alert(result);
        },
        (error)=>{
            alert('Failed');
        })
        setTimeout(() => {
            this.getInfo();
            this.getUsersNotInProject();
        }, 500);
    }

    render(){
        const {members,availableUser,projectid,specialization}=this.state;//delete projectDescription mayby
        return(
            <div className="col-lg-12  text-center">
                <h1>All projects members</h1>
                <Table className="mt-4" striped bordered hover size="sm">
                    <thead>
                        <tr>
                            <th>Member</th>
                            <th>Member Specialization</th>
                            <th>Options</th>
                        </tr>
                    </thead>
                    <tbody>
                        {members.map(mem=>
                            <tr key={mem.id}>
                                <td>{mem.name}</td>
                                <td>{mem.specialization}</td>
                                <td >
                                        <ButtonToolbar>
                                                <Button className="mr-2" variant="danger"
                                                onClick={()=>this.deleteMemberFromTeam(mem.id)}>
                                                    Delete
                                                </Button>
                                        </ButtonToolbar>

                                </td>

                            </tr>)}
                    </tbody>

                </Table>

                <Form onSubmit={this.addUserToTeam}>
                    <Row >
                        <Col>
                            <Form.Group  controlId="userid">
                                <Form.Label>User</Form.Label>
                                <Form.Control as="select" required>
                                    {availableUser.map(user =>
                                        <option key={user.id} value={user.id}>{user.name}</option>
                                    )}
                                </Form.Control>
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group  controlId="specialization">
                                <Form.Label>User's specialization</Form.Label>
                                <Form.Control as="select" required>
                                    {specialization.map(spec =>
                                        <option key={spec.id} value={spec.id}>{spec.name}</option>
                                    )}
                                </Form.Control>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Form.Group >
                        <Button variant="primary" type="submit">
                            Add user
                        </Button>
                    </Form.Group>
                </Form>
            </div>
        )
    }
}