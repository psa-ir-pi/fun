import React,{Component} from 'react';
import {Table} from 'react-bootstrap';

import {Button,ButtonToolbar} from 'react-bootstrap';
import {CreateComment} from './CreateComment';

export class ControlComment extends Component{

    constructor(props){
        super(props);
        this.state={comments:[], createShow:false, editShow:false}
    }

    getAllComments(){
        fetch(process.env.REACT_APP_API+'controlComment')
        .then(response=>response.json())
        .then(data=>{
            for (let comment of data) {
                comment.date = comment.date.slice(0, 10);
                if (comment.from_line == -1){
                    comment.from_line = "unspecified"
                }
                if (comment.to_line == -1){
                    comment.to_line = "unspecified"
                }
            }
            this.setState({comments:data});
        });
    }

    componentDidMount(){
        this.getAllComments();
    }

    componentDidUpdate(){
        this.getAllComments();
    }

    deleteComment(commentId){
        if(window.confirm('Are you sure?')){
            fetch(process.env.REACT_APP_API+'controlComment/'+commentId,{
                method:'DELETE',
                header:{'Accept':'application/json',
                'Content-Type':'application/json'}
            });
        }
    }

    render(){
        const {comments}=this.state;
        let createClose=()=>this.setState({createShow:false});
        return(
            <div class="col-lg-12  text-center">
                <h1>All comments</h1>
                <Table className="mt-4" striped bordered hover size="sm">
                    <thead>
                        <tr>
                            <th>Comment text</th>
                            <th>Comment creation date</th>
                            <th>User name</th>
                            <th>Version id</th>
                            <th>From line</th>
                            <th>To line</th>
                            <th>Project name</th>
                            <th>Options</th>
                            
                        </tr>
                    </thead>
                    <tbody>
                        {comments.map(co=>
                            <tr key={co.id}>
                                <td>{co.text}</td>
                                <td>{co.date}</td>
                                <td>{co.name}</td>
                                <td>{co.foreign_version}</td>
                                <td>{co.from_line}</td>
                                <td>{co.to_line}</td>
                                <td>{co.Project_name}</td>
                                <td >
                                        <ButtonToolbar>
                                                <Button className="mr-2" variant="danger"
                                            onClick={()=>this.deleteComment(co.id)}>
                                                    Delete
                                                </Button>
                                        </ButtonToolbar>

                                </td>

                            </tr>)}
                    </tbody>

                </Table>
            </div>
        )
    }
}