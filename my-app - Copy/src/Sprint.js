import React,{Component} from 'react';
import {Table} from 'react-bootstrap';
import {Button,ButtonToolbar} from 'react-bootstrap';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";



export class Sprint extends Component{

    constructor(props){
        super(props);
        this.state = {tasks:[], columns:[]};
        this.id = 1;
    }

    onDragEnd(result,columns){
        if(!result.destination) return;
        const {source, destination} = result;
        if(source.droppableId != destination.droppableId){
            const sourceColumn = columns[source.droppableId];
            const destColumn = columns[destination.droppableId];
            const task = {
                id: result.draggableId,
                state: result.destination.droppableId
            }
            this.handleUpdate(task)
            const sourceItems = [...sourceColumn.items];
            const destItems = [...destColumn.items];
            const [removed] = sourceItems.splice(source.index, 1);
            destItems.splice(destination.index, 0, removed);
            this.setState({columns: ({
                ...columns,
                [source.droppableId]:{
                    ...sourceColumn,
                    items: sourceItems
                },
                [destination.droppableId]: {
                    ...destColumn,
                    items: destItems
                }
            })});
        } else{
            const column = columns[source.droppableId];
            const copiedItems = [...column.items];
            const [removed] = copiedItems.splice(source.index, 1);
            copiedItems.splice(destination.index, 0, removed);
            this.setState({columns: ({
                ...columns,
                [source.droppableId]:{
                    ...column,
                    items: copiedItems
                }
            })});
        }
    }
    handleUpdate(task){
        fetch(process.env.REACT_APP_API+'task',{
            method:'PUT',
            headers:{
                'Accept':'application/json',
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                id:task.id,
                state:task.state
            })
        })
        .then(res=>res.json())
        .then((result)=>{
            console.log(result);
        },
        (error)=>{
            alert('Failed');
        })
    }

    getTasks(){
        fetch(process.env.REACT_APP_API+'task/'+ this.id)
        .then(response=>response.json())
        .then(data=>{
            this.setState({tasks:data});
            var toDo = [];
            var started = [];
            var done = [];
            var closed = [];
            data.forEach(element => {
                switch (element.state){
                    case 1:
                        toDo.push(element)
                        break;
                    case 2:
                        started.push(element)
                        break;
                    case 3:
                        done.push(element)
                        break;
                    case 4:
                        closed.push(element)
                        break;
                }
            });
            const columnsList = {
                ['1']:{
                    name:"To do",
                    items: toDo
                },
                ['2']:{
                    name:"Started",
                    items: started
                }
                ,
                ['3']:{
                    name:"Done",
                    items: done
                },
                ['4']:{
                    name:"Closed",
                    items: closed
                }
            }
            this.setState({columns:columnsList});
        });

    }
    componentDidMount(){
        this.getTasks();
    }
    render(){
        const {tasks, columns}=this.state;
        console.log(columns)
        return(
            <div style={{ justifyContent: 'center', height: '100%', textAlign: 'center'}}>
                <h1>Sprint Tasks</h1>
                <div style={{display: 'flex', justifyContent: 'center', height: '100%'}}>

                    <DragDropContext onDragEnd={result => this.onDragEnd(result,columns)}>
                        {Object.entries(columns).map(([id,column])=> {
                            return(
                                <div style={{display: 'flex', flexDirection: 'column', alignItems:'center'}}>
                                    <h2>{column.name}</h2>
                                    <div style={{margin:8}}>
                                        <Droppable droppableId={id} key={id} type={column.name === 'Closed' ? 'closed' : 'active'}>
                                            {(provided, snapshot) => {
                                                return(
                                                    <div
                                                        {...provided.droppableProps}
                                                        ref={provided.innerRef}
                                                        style={{
                                                            background: column.name === 'Closed' ? '#9de26b' : snapshot.isDraggingOver ? 'lightblue' : 'lightgrey',
                                                            padding:4,
                                                            width: 250,
                                                            minHeight: 500
                                                        }}
                                                    >
                                                        {column.items.map((item,index) => {
                                                            return(
                                                                <Draggable key={item.id} draggableId={''+item.id} index={index}
                                                                isDragDisabled={column.name === 'Closed'}>
                                                                    {(provided,snapshot) => {
                                                                        return(
                                                                            <div 
                                                                            ref={provided.innerRef}
                                                                            {...provided.draggableProps}
                                                                            {...provided.dragHandleProps}
                                                                            style={{
                                                                                userSelect: 'none',
                                                                                padding: 16,
                                                                                margin:'0 0 8px 0',
                                                                                minHeight: '50px',
                                                                                backgroundColor: column.name === 'Closed' ? '#000066' : snapshot.isDragDisabled ? '#9de26b' : '#456C86',
                                                                                color: 'white',
                                                                                ...provided.draggableProps.style
                                                                            }}
                                                                            >
                                                                                {item.name}
                                                                            </div>
                                                                        )
                                                                    }}
                                                                </Draggable>
                                                            )
                                                        })}
                                                        {provided.placeholder}
                                                    </div>
                                                )
                                            }}
                                        </Droppable>
                                    </div>
                                </div>
                            )
                        })}
                    </DragDropContext>
                </div>
            </div>
        )
    }
}