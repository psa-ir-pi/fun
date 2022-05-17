import React,{Component, useState} from 'react';
import {Table} from 'react-bootstrap';
import {Button,ButtonToolbar} from 'react-bootstrap';
import TasksTable from "./TasksTable.js";   
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import uuid from 'react-uuid';



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
        console.log(this.state.columns)
    }

    getTasks(){
        fetch(process.env.REACT_APP_API+'task/'+ this.id)
        .then(response=>response.json())
        .then(data=>{
            this.setState({tasks:data});
            const columnsList = {
                [uuid()]:{
                    name:"To do",
                    items: data
                },
                [uuid()]:{
                    name:"Started",
                    items: []
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
        console.log(tasks)
        console.log(columns)
        return(
            <div style={{display: 'flex', justifyContent: 'center', height: '100%'}}>``
                <DragDropContext onDragEnd={result => this.onDragEnd(result,columns)}>
                    {Object.entries(columns).map(([id,column])=> {
                        return(
                            <div style={{display: 'flex', flexDirection: 'column', alignItems:'center'}}>
                                <h2>{column.name}</h2>
                                <div style={{margin:8}}>
                                    <Droppable droppableId={id} key={id}>
                                        {(provided, snapshot) => {
                                            return(
                                                <div
                                                    {...provided.droppableProps}
                                                    ref={provided.innerRef}
                                                    style={{
                                                        background: snapshot.isDraggingOver ? 'lightblue' : 'lightgrey',
                                                        padding:4,
                                                        width: 250,
                                                        minHeight: 500
                                                    }}
                                                >
                                                    {column.items.map((item,index) => {
                                                        return(
                                                            <Draggable key={item.id} draggableId={''+item.id} index={index}>
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
                                                                            backgroundColor: snapshot.isDragging ? '#263B4A': '#456C86',
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
        )
    }
}