import React,{Component} from 'react';
import {Modal,Button, Row, Col, Form} from 'react-bootstrap';

export class CreateTasks extends Component{
    constructor(props){
        super(props);
        this.submitSprintName=this.submitSprintName.bind(this);
        this.state={projects:[]};
    }

    getProjects(){
        fetch(process.env.REACT_APP_API+'CreateSprint/'+this.props.userid)
        .then(response=>response.json())
        .then(data=>{
            this.setState({projects:data});
        });
    }
    componentDidMount(){
        this.getProjects();
    }
    submitSprintName(event){
        event.preventDefault();
        fetch(process.env.REACT_APP_API+'CreateSprint',{
            method:'POST',
            headers:{
                'Accept':'application/json',
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                id:0,
                name:event.target.name.value,
                foreign_project:event.target.projectid.value
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
                        Add sprint
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    <Row>
                        <Col sm={6}>
                            <Form onSubmit={this.submitSprintName}>
                                <Form.Group controlId="name">
                                    <Form.Label>Sprint Name</Form.Label>
                                    <Form.Control type="text" name="name" required 
                                    placeholder=''/>
                                </Form.Group>
                                <Form.Group  controlId="projectid">
                                <Form.Label>User's managed projects</Form.Label>
                                <Form.Control as="select" required>
                                    {this.state.projects.map(proj =>
                                        <option key={proj.id} value={proj.id}>{proj.name}</option>
                                    )}
                                </Form.Control>
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