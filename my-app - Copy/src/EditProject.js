import React,{Component} from 'react';
import {Modal,Button, Row, Col, Form} from 'react-bootstrap';

export class EditProject extends Component{
    constructor(props){
        super(props);
        this.handleSubmit=this.submitNewInfo.bind(this);
    }

    submitNewInfo(event){
        event.preventDefault();
        fetch(process.env.REACT_APP_API+'project',{
            method:'PUT',
            headers:{
                'Accept':'application/json',
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                id:event.target.id.value,
                name:event.target.name.value,
                description:event.target.description.value
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
            Edit Project
        </Modal.Title>
    </Modal.Header>
    <Modal.Body>

        <Row>
            <Col sm={6}>
                <Form onSubmit={this.submitNewInfo}>
                    <Form.Group controlId="id">
                        <Form.Label>Project id</Form.Label>
                        <Form.Control type="text" name="id" required
                         disabled
                         defaultValue={this.props.projectId}
                        placeholder="id"/>
                    </Form.Group>

                    <Form.Group controlId="date">
                        <Form.Label>Project Date</Form.Label>
                        <Form.Control type="text" name="date" required
                         disabled
                         defaultValue={this.props.projectDate}
                        placeholder="date"/>
                    </Form.Group>

                    <Form.Group controlId="name">
                        <Form.Label>Project Name</Form.Label>
                        <Form.Control type="text" name="name" required 
                        defaultValue={this.props.projectName}
                        placeholder="name"/>
                    </Form.Group>

                    <Form.Group controlId="description">
                        <Form.Label>Description</Form.Label>
                        <Form.Control type="text" name="description" required 
                        defaultValue={this.props.projectDescription}
                        placeholder="description"/>
                    </Form.Group>

                    <Form.Group>
                        <Button variant="primary" type="submit">
                            Edit Project
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