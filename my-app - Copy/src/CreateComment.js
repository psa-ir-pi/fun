import React,{Component, useState} from 'react';
import {Modal,Button, Row, Col, Form} from 'react-bootstrap';

export class CreateComment extends Component{
    constructor(props){
        super(props);
        this.handleSubmit=this.createComment.bind(this);
        this.state={versionid:this.props.versionID};

    }


    createComment(event){
        event.preventDefault();
        console.log(event.target.from_line.value)
        if(event.target.from_line.value == ""){
            event.target.from_line.value = -1
        }
        if(event.target.to_line.value == ""){
            event.target.to_line.value = -1
        }
        fetch(process.env.REACT_APP_API+'createComment',{
            method:'POST',
            headers:{
                'Accept':'application/json',
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                text:event.target.text.value,
                from_line:event.target.from_line.value,
                to_line:event.target.to_line.value,
                foreign_version:event.target.foreign_version.value,
                foreign_user:event.target.foreign_user.value,

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
        const {versionid}=this.state;
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
                        Add Comment
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    <Row>
                        <Col sm={6}>
                            <Form onSubmit={this.createComment}>
                                <Form.Group controlId="text">
                                    <Form.Label>Text</Form.Label>
                                    <Form.Control type="text" name="text" required 
                                    placeholder=''/>
                                </Form.Group>
                                <Form.Group controlId="from_line">
                                    <Form.Label>From line</Form.Label>
                                    <Form.Control type="nummber" name="from_line"  
                                    placeholder=''/>
                                </Form.Group>
                                <Form.Group controlId="to_line">
                                    <Form.Label>To line</Form.Label>
                                    <Form.Control type="nummber" name="to_line"
                                    placeholder=''  />
                                </Form.Group>

                                <Form.Group controlId="foreign_version">
                                    <Form.Control type="hidden" name="foreign_version" value={versionid}/>
                                </Form.Group>   
                                <Form.Group controlId="foreign_user">
                                    <Form.Control type="hidden" name="foreign_user" value={1}/>
                                </Form.Group>   


                                <Form.Group>
                                    <Button variant="primary" type="submit">
                                        Add Comment
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