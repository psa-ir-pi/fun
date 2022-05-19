import React,{Component} from 'react';
import {Modal,Dropdown, able,ButtonToolbar, Button, Row, Col, Form} from 'react-bootstrap';
import ReactDiffViewer, { DiffMethod } from "react-diff-viewer";


export class CodeComparison extends Component{

    constructor(props){
        super(props);
        this.state={codeLines:"", newCode:""}
    }





    render(){
        return (

            <div className="container">
                <Modal
                {...this.props}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered>

                    <Modal.Header clooseButton>
                        <Modal.Title id="contained-modal-title-vcenter">
                            Compare versions
                        </Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <Row>
                            <h1>Code diferences</h1>

                        </Row>
                        <Row>
                            <Col>
                            <h2>Current version code</h2>
                            <h2>{console.log(this.props.code1)}</h2>
                            <h2>{console.log(this.props.code2)}</h2>
                            </Col>
                            <Col>
                            <h2>selected version code</h2>
                            </Col>
                        </Row>

                        <ReactDiffViewer
                            oldValue={this.props.code1}
                            newValue={this.props.code2}
                            compareMethod={DiffMethod.WORDS}
                            splitView={true}
                            //onLineNumberClick={(string)=>{this.chooseLine(string)}}
                        />

                    </Modal.Body>

                    <Modal.Footer>
                        <Button variant="danger" onClick={this.props.onHide}>Close</Button>
                    </Modal.Footer>

                </Modal>

                
            </div>
        )
    }

}