import React,{Component} from 'react';
import ReactFlow from 'react-flow-renderer';
import { withRouter } from "react-router";
import PropTypes from "prop-types";

class Branch extends Component{
  
  static propTypes = {
    match: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
  };
    constructor(props){
        super(props);
        this.state={createShow:false, editShow:false,nodes:[],edges:[],id:this.props.match.params.id}
    }

    getVersionElementsToDisplay(id){
        var nodesNew=[]
        var edgesNew=[]
        var allNodes = []
        var dates = []
        var bId = []
        var layers=[]
        var colors=["#1F45FC", "#00FFFF", "#008080", "#347235","#4CC417","#EDDA74","##FFFF00","#FFA62F","#966F33"]
        fetch(process.env.REACT_APP_API+'version/getAll/'+id)
        .then(response=>response.json())
        .then(data=>{
            var index = 0
            var ai = -1
            var ci = -1
            for (let d of data) {
              console.log('index'+index)
              if(index != 0){
                ai=bId.indexOf(-1)
              }
                if(!bId.includes(d.foreign_branch)){
                    if (index != 0 && ai != -1){
                      bId[ai]=d.foreign_branch
                      ci=ai
                    }
                    else{
                      bId.push(d.foreign_branch)
                      if(index != 0){
                        ai=Math.max(...layers)
                      }
                      ai+=1
                      ci=ai
                      if(allNodes.length == ai){
                        allNodes.push([])
                        dates.push([])
                      }
                      layers.push(ai)
                    }
                }
                else{
                    ci=bId.indexOf(d.foreign_branch)
                }
                allNodes[ci].push(index)
                dates[ci].push(d.date)
                var le = allNodes[0].length
                if(ci==0 || (ci != 0 && d.date != dates[0][le-1])){
                    nodesNew.push({
                        id: index.toString(),
                        type: 'default',
                        data: { label: index.toString(), id:d.id },
                        position: { x: 250+ ci*50, y: 25 + index*50 },
                        style: { width: 30, height:30, borderRadius: "50%", backgroundColor:colors[ci]},
                      })
                      if(index > 0){
                          const l = allNodes[ci].length
                          var i=allNodes[0][allNodes[0].length-1]
                          if(l != 1){
                                i= allNodes[ci][l-2]
                          }
                        edgesNew.push({ id: 'e'+i+'-'+index, source: i.toString(), target: index.toString() })
                      }
                }
                else{
                    edgesNew.push({ id: 'e'+i+'-'+index, source: allNodes[ci][allNodes[ci].length-2].toString(), target: allNodes[0][le-1].toString() })
                    var xi=layers.indexOf(ci)
                    layers.splice(xi,1)
                    index-=1
                    allNodes[ci] = []
                    dates[ci] = []
                    bId[ci] = -1
                }
                  index+=1
            }
            this.setState({nodes:nodesNew});
            this.setState({edges:edgesNew});
        });
    }

    componentDidMount(){
      this.getVersionElementsToDisplay(this.state.id);
    }

    // componentDidUpdate(){
    //     this.full();
    // }

    initialNodes = [
        {
          id: '1',
          type: 'input',
          data: { label: '' },
          position: { x: 250, y: 25 },
          style: { width: 30, height:30, borderRadius: "50%"},
        },
      
        {
          id: '2',
          data: { label: <div>Default Node</div> },
          position: { x: 100, y: 125 },
        },
        {
          id: '3',
          type: 'output',
          data: { label: 'Output Node' },
          position: { x: 250, y: 250 },
        },
      ];
      
      initialEdges = [
        { id: 'e1-2', source: '1', target: '2' },
        { id: 'e2-3', source: '2', target: '3', animated: true },
      ];

    render(){
        const {nodes,edges}=this.state;
        const {history} = this.props;
        const nav = (id) => {
            history.push("/branch/"+id)
        }
        return(
            <ReactFlow onNodeClick={(event, node) => nav(node.data.id)} nodes={nodes} edges={edges} style={{ height: 1000 }}/>
        )
    }
}

export default withRouter(Branch);