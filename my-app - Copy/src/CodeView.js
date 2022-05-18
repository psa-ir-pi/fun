import React,{Component} from 'react';
import {Table} from 'react-bootstrap';
import {Button,ButtonToolbar,} from 'react-bootstrap';

import {CodeComparison} from './CodeComparison';

export class CodeView extends Component{

    constructor(props){
        super(props);
        this.state={lines:[],code1:"",code2:"", versionid:this.props.match.params.id,  comparisonShow:false, versionIDs:[]};
    }

    selectCodeLines(){
        var code = "";
        fetch(process.env.REACT_APP_API+'codeview/'+this.state.versionid)
        .then(response=>response.json())
        .then(data=>{
            for (let l of data) {   
                code += l.line + "\n"
            }
            this.setState({code1:code})
            console.log(this.state.code1)
            this.setState({lines:data});
        });

    }

    async selectCodeLines2(versionID){
        var code = "";
        var rez = await fetch(process.env.REACT_APP_API+'codeview/'+versionID)
        .then(response=>response.json())
        .then(data=>{
            for (let l of data) {   
                code += l.line + "\n"
            }
            this.setState({code2:code})
            console.log(this.state.code2);
        });
    }

    async getAllBranchVersions(versionID){
        var rez = await fetch(process.env.REACT_APP_API+'codeview/getBranchID/'+versionID)
        .then(response=>response.json())

        var rez2 = await fetch(process.env.REACT_APP_API+'codeview/getVersionsByBranch/' + rez[0].branchID)
        .then(response=>response.json())
        .then(data=>this.setState({versionIDs:data}))
        //console.log(this.state.versionIDs[1].id)
    }

    componentDidMount(){
        this.selectCodeLines();
        this.getAllBranchVersions(this.state.versionid)
    }

    componentDidUpdate(){
        
    }


    render(){
        const {lines,versionid, versionIDs, code1, code2}=this.state;
        let comparisonShow=()=>this.setState({comparisonShow:false});
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
                                <td className='col-lg-11  text-left'><pre>{line.line}</pre></td>
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

                <Table className="mt-4" striped bordered hover size="sm">
                    <thead>
                        <tr>
                            <th className='col-lg-1  text-center'>Versijų id</th>
                            <th className='col-lg-1  text-left'>Pasirinkti</th>
                        </tr>
                    </thead>
                    <tbody>
                        {versionIDs.map(line=>
                            <tr key={line.versionId}>
                                <td className='col-lg-1  text-center'>{line.versionId}</td>
                                <td className='col-lg-1  text-left'>
                                <ButtonToolbar>
                                    <Button className="mr-2" variant="info"
                                        onClick={()=>{this.setState({comparisonShow:true}); this.selectCodeLines2(line.versionId)}}>
                                    Compare versions
                                    </Button>
                                            
                                    { <CodeComparison show={this.state.comparisonShow}
                                    onHide={comparisonShow}
                                    versionIDs={versionIDs}
                                    versionID={versionid}
                                    code1={code1}
                                    code2={code2}
                                    /> }
                                </ButtonToolbar>
                                </td>
                            </tr>)}
                    </tbody>
                </Table>
            </div>
            
        )
    }
}