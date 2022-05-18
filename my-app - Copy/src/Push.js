import React,{Component} from 'react';
import {Modal,Button, Row, Col, Form} from 'react-bootstrap';

export class Push extends Component{
    constructor(props){
        super(props);
        this.handleSubmit=this.submitNewInfo.bind(this);
        this.state={lines:' ', file:false};
    }

    submitNewInfo(event){
        event.preventDefault();
        console.log(event.target.file.value)
        if (event.target.file.value === 'false'){
            alert("No file chosen")
            return
        }
        fetch(process.env.REACT_APP_API+'push',{
            method:'POST',
            headers:{
                'Accept':'application/json',
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                id:event.target.id.value,
                lines:event.target.lines.value
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
    uploadFile = (e) => {
        e.preventDefault();
        if (e.target.files.length === 0 ){
            this.setState({file:false});
            return
        }
        const reader = new FileReader();
        reader.onload = (e) => {
          const text = e.target.result;
          this.setState({lines:text, file:true});
        };
        reader.readAsText(e.target.files[0]);
      };
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
            Push Code
        </Modal.Title>
    </Modal.Header>
    <Modal.Body>

        <Row>
            <Col sm={6}>
                <Form onSubmit={this.submitNewInfo}>
                    <Form.Group controlId="id">
                        <Form.Label>Task ID</Form.Label>
                        <Form.Control type="text" name="id" required
                         disabled
                         defaultValue={this.props.taskId}
                        placeholder="id"/>
                    </Form.Group>

                    <Form.Group controlId="name">
                        <Form.Label>Task Name</Form.Label>
                        <Form.Control type="text" name="name" required  disabled
                        defaultValue={this.props.taskName}
                        placeholder="name"/>
                    </Form.Group>
                    <Form.Group>
                    <div>
                    <input type="file" onChange={this.uploadFile} />
                    </div>
                    </Form.Group>

                    <Form.Group controlId="lines">
                        <Form.Control type="hidden" name="lines" value={this.state.lines}/>
                    </Form.Group>
                    <Form.Group controlId="file">
                        <Form.Control type="hidden" name="file" value={this.state.file}/>
                    </Form.Group>

                    <Form.Group>
                        <Button variant="primary" type="submit">
                            Push
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