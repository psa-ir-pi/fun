import logo from './logo.svg';
import './App.css';

import {Home} from './Home';
import {AllProjects} from './AllProjects';
import {ProjectMember} from './ProjectMember';
import {CodeView} from './CodeView';
import {ControlSprint} from './ControlSprint';
import {ControlTasks} from './ControlTasks';
import { AssignManually } from './AssignManually';

import MyProjects from './MyProjects';
import {ControlComment} from './ControlComment';
import {Navigation} from './Navigation';
import {ControlFinishedTasks} from './ControlFinishedTasks';
import {CloseTask} from './CloseTask';

import React, { useState } from "react";

import {BrowserRouter, Route, Switch} from 'react-router-dom';
import { Sprint } from './Sprint';


import Branch from './Branch';

function App() {
  return (
    <BrowserRouter>
    <div className="container">

     <Navigation/>

     <Switch>
       <Route path='/' component={Home} exact/>
       <Route path='/allProjects' component={AllProjects}/>
       <Route path='/ProjectMember/:id' component={ProjectMember}/>
       <Route path='/CodeView/:id' component={CodeView}/>
       <Route path='/ControlSprint/:userid' component={ControlSprint}/>
       <Route path='/ControlTasks/:sprintid/:sprintName' component={ControlTasks}/>
       <Route path='/AssignManually/:taskid' component={AssignManually}/>
       <Route path='/myProjects' component={MyProjects}/>
       <Route path='/comments' component={ControlComment}/>
       <Route path='/branch/:id' component={Branch}/>
       <Route path='/sprint/:id' component={Sprint}/>
       <Route path='/controlFinishedTasks' component={ControlFinishedTasks}/>
       <Route path='/closeTask' component={CloseTask}/>
     </Switch>
    </div>
    </BrowserRouter>
  );
}

export default App;
