import React,{Component} from 'react';
import {Modal,Table,ButtonToolbar, Button, Row, Col, Form} from 'react-bootstrap';
import ReactDiffViewer, { DiffMethod } from "react-diff-viewer";

import {Merge} from './Merge';

export class CloseTask extends Component{
    constructor(props){
        super(props);
        this.state={mergeShow:false, codeLines:"", newCode:""}
    }





    render(){
        let mergeShow=()=>this.setState({mergeShow:false});
        return (

            <div className="container">
                <Modal
                {...this.props}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered>

                    <Modal.Header clooseButton>
                        <Modal.Title id="contained-modal-title-vcenter">
                            Close Task
                        </Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <Row>
                            <h1>Code diferences</h1>

                        </Row>
                        <Row>
                            <Col>
                            <h2>Main Branch Code</h2>
                            </Col>
                            <Col>
                            <h2>New Code</h2>
                            </Col>
                        </Row>
                        <ReactDiffViewer
                            oldValue={this.props.code}
                            newValue={this.props.code2}
                            compareMethod={DiffMethod.WORDS}
                            splitView={true}
                            //onLineNumberClick={(string)=>{this.chooseLine(string)}}
                        />
                        <ButtonToolbar>
                        <Button className="mr-2" variant="info"
                                onClick={()=>{this.setState({mergeShow:true})}}>
                                Merge
                            </Button>
                            { <Merge show={this.state.mergeShow}
                                onHide={mergeShow}
                                taskID={this.props.taskId}
                                code={this.props.code}
                                code2={this.props.code2}
                                projectID={this.props.projectID}
                            /> }
                        </ButtonToolbar>

                    </Modal.Body>

                    <Modal.Footer>
                        <Button variant="danger" onClick={this.props.onHide}>Close</Button>
                    </Modal.Footer>

                </Modal>

                
            </div>
        )
    }

}