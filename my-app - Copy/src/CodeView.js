import React,{Component} from 'react';
import {Table} from 'react-bootstrap';
import {Button,ButtonToolbar,} from 'react-bootstrap';

export class CodeView extends Component{

    constructor(props){
        super(props);
        this.state={lines:[],versionid:this.props.match.params.id};
    }

    selectCodeLines(){
        fetch(process.env.REACT_APP_API+'codeview/'+this.state.versionid)
        .then(response=>response.json())
        .then(data=>{
            this.setState({lines:data});
        });
    }

    componentDidMount(){
        this.selectCodeLines();
    }

    componentDidUpdate(){
    }


    render(){
        const {lines,versionid}=this.state;
        return(
            <div className="col-lg-12  text-center">
                <h1>Version {versionid}</h1>
                <Table className="mt-4" striped bordered hover size="sm">
                    <thead>
                        <tr>
                            <th className='col-lg-1  text-center'>#</th>
                            <th className='col-lg-11  text-left'>Line</th>
                        </tr>
                    </thead>
                    <tbody>
                        {lines.map(line=>
                            <tr key={line.id}>
                                <td className='col-lg-1  text-center'>{line.line_number}</td>
                                <td className='col-lg-11  text-left'>{line.line}</td>
                            </tr>)}
                    </tbody>
                </Table>
                <ButtonToolbar>
                    <Button className="mr-2" variant="danger">
                            Create comment
                    </Button>
                    <Button className="mr-2" variant="danger">
                            Delete
                    </Button>
                </ButtonToolbar>
            </div>
            
        )
    }
}