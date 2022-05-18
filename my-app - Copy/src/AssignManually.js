import React,{Component} from 'react';
import {Modal,Button, Row, Col, Form} from 'react-bootstrap';

export class AssignManually extends Component{
    constructor(props){
        super(props);
        this.assign=this.assign.bind(this);
        this.state={members:[],available:[]};
    }

    getMembers(){
        fetch(process.env.REACT_APP_API+'AssignManually/'+this.props.task.id)
        .then(response=>response.json())
        .then(data=>{
            this.setState({members:data});
        });
    }
    componentDidMount(){
        this.getMembers();
    }
    componentDidUpdate(prevProps){
        if(prevProps.show !== this.props.show){
            this.checkMembers();
        }
    }

    async checkMembers(){
        var specialist=[];
        for(const member of this.state.members){
            if(member.specialization == this.props.task.type){
                specialist.push(member);
            }
        }
        var availableMembers = [];
        for(const member of specialist){
            const maxPoints = member.max_points;
            var usersPoints=[];
            await fetch(process.env.REACT_APP_API+'AssignManually/GetUsersPoints/'+member.foreign_user)
            .then(response=>response.json())
            .then(data=>{
                usersPoints=data;
            });
            var pointsUsed = 0;
            for(const point of usersPoints){
                pointsUsed += point.points
            }
            const leftPoints = maxPoints-pointsUsed;
            console.dir(member);
            console.dir(usersPoints);
            if(leftPoints >= this.props.task.points){
                availableMembers.push({user:member,leftP:leftPoints});
            }
        }
        this.setState({available:availableMembers});
    }

    assign(event){
        event.preventDefault();
        fetch(process.env.REACT_APP_API+'AssignManually',{
            method:'PUT',
            headers:{
                'Accept':'application/json',
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                id:this.props.task.id,
                foreign_Team_member:event.target.memberid.value
            })
        })
        .then(res=>res.json())
        .then((result)=>{
            alert(result);
        },
        (error)=>{
            alert('Failed');
        });
    }

    render(){    

        return (
            <div className="container">
            <Modal
            {...this.props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            >
                <Modal.Header >
                    <Modal.Title id="contained-modal-title-vcenter">
                        Choose member for task
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    <Row>
                        <Col sm={6}>
                            <Form onSubmit={this.assign}>
                                <Form.Group  controlId="memberid">
                                <Form.Label>User</Form.Label>
                                <Form.Control as="select" required>
                                    {this.state.available.map(mem =>
                                        <option key={mem.user.id} value={mem.user.id}>{mem.user.name}</option>
                                    )}
                                </Form.Control>
                            </Form.Group>
                            <Form.Group>
                                <Button variant="primary" type="submit">
                                    Assign member to task
                                </Button>
                            </Form.Group>
                            </Form>
                        </Col>
                    </Row>
                </Modal.Body>
                
                <Modal.Footer>
                    <Button variant="danger" onClick={this.props.onHide}>Close</Button>
                </Modal.Footer>

            </Modal>

            </div>
        )
    }
}