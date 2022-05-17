import React,{Component} from 'react';
import {Modal,Button, Row, Col, Form} from 'react-bootstrap';

export class CreateTasks extends Component{
    constructor(props){
        super(props);
        this.submitSprintName=this.submitSprintName.bind(this);
        this.state={projects:[],currentDate:'',
            task_type:[{id:1, name:'Tester'},{id:2, name:'Back end'},{id:3, name:'Front end'},{id:4, name:'Designer'}]};
    }

    componentDidMount(){
        var tempDate = new Date();
        var date = tempDate.getFullYear() + '-' + (tempDate.getMonth()+1) + '-' + tempDate.getDate()
        this.setState({currentDate:date})
    }
    submitSprintName(event){
        event.preventDefault();
        const sprintid = this.props.sprintid; 
        fetch(process.env.REACT_APP_API+'CreateTasks',{
            method:'POST',
            headers:{
                'Accept':'application/json',
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                id:0,
                name:event.target.name.value,
                description:event.target.description.value,
                type:event.target.type.value,
                points:event.target.points.value,
                foreign_sprint:sprintid
            })
        })
        .then(res=>res.json())
        .then((result)=>{
            alert(result);
        },
        (error)=>{
            alert('Failed');
        })
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
                <Modal.Header clooseButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Add task
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    <Row>
                        <Col sm={6}>
                            <Form onSubmit={this.submitSprintName}>
                                <Form.Group controlId="name">
                                    <Form.Label>Task's name</Form.Label>
                                    <Form.Control type="text" required />
                                </Form.Group>
                                <Form.Group controlId="description">
                                    <Form.Label>Task's description</Form.Label>
                                    <Form.Control type="textarea" />
                                </Form.Group>
                                <Form.Group  controlId="type">
                                    <Form.Label>Task type</Form.Label>
                                    <Form.Control as="select" required>
                                        {this.state.task_type.map(type =>
                                            <option key={type.id} value={type.id}>{type.name}</option>
                                        )}
                                    </Form.Control>
                                </Form.Group>
                                <Form.Group controlId="points">
                                    <Form.Label>Task's points</Form.Label>
                                    <Form.Control type="number"  required />
                                </Form.Group>
                                <Form.Group>
                                <Button variant="primary" type="submit">
                                    Add Sprint
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