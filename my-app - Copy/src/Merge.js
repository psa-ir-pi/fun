import React,{Component} from 'react';
import {Modal,Table,ButtonToolbar, Button, Row, Col, Form} from 'react-bootstrap';
import ReactDiffViewer, { DiffMethod } from "react-diff-viewer";

export class Merge extends Component{
    constructor(props){
        super(props);
        //this.closeTask=this.closeTask.bind(this);
        //this.banana=this.banana.bind(this);
        this.state={codeLines:[], newCode:""}
    }

    chooseLine(lineNR){
        var newCode = this.state.newCode
    
        if(lineNR.charAt(0)=="L"){
            var nr = lineNR.charAt(2)
            var line = this.props.code.split('\n');
            newCode += line[nr-1] + "\n"
        }  
        else{
            var nr = lineNR.charAt(2)
            var line = this.props.code2.split('\n');
            newCode += line[nr-1] + "\n"
        }
    
        this.setState({newCode:newCode})
    }

    closeTask(taskID,projectID, newCode){
        
        fetch(process.env.REACT_APP_API+'task/close/'+taskID,{
            method:'PUT',
            headers:{
                'Accept':'application/json',
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                taskId:taskID
            })
        })
        .then(res=>res.json())
        .then((result)=>{
            alert(result);
        },
        (error)=>{
            alert('Failed');
        })

        fetch(process.env.REACT_APP_API+'merge/project',{
            method:'POST',
            headers:{
                'Accept':'application/json',
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                id:projectID,
                lines:newCode,
            })
        })
        .then(res=>res.json())
        .then((result)=>{
            alert(result);
        },
        (error)=>{
            alert('Failed');
        })

        fetch(process.env.REACT_APP_API+'merge/task',{
            method:'POST',
            headers:{
                'Accept':'application/json',
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                id:taskID,
                lines:newCode,
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
                centered>

                    <Modal.Header clooseButton>
                        <Modal.Title id="contained-modal-title-vcenter">
                            Merge
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
                            onLineNumberClick={(string)=>{this.chooseLine(string)}}
                        />

                        <Row>
                            <h2>New code</h2>
                        </Row>

                        <textarea rows="4" cols="100" value={this.state.newCode} />
                        <ButtonToolbar>
                            <Button variant="primary"
                                onClick={() => {this.closeTask(this.props.taskID, this.props.projectID, this.state.newCode)}}>
                            Submit New changes
                            </Button>
                            <Button variant="primary"
                                onClick={() => {this.setState({newCode:""})}}>
                            Reset
                            </Button>
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