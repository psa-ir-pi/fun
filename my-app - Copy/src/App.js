import logo from './logo.svg';
import './App.css';

import {Home} from './Home';
import {AllProjects} from './AllProjects';
import MyProjects from './MyProjects';
import {ControlComment} from './ControlComment';
import {Navigation} from './Navigation';
import {ControlFinishedTasks} from './ControlFinishedTasks';
import {CloseTask} from './CloseTask';

import React, { useState } from "react";

import {BrowserRouter, Route, Switch} from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
    <div className="container">

     <Navigation/>

     <Switch>
       <Route path='/' component={Home} exact/>
       <Route path='/allProjects' component={AllProjects}/>
       <Route path='/myProjects' component={MyProjects}/>
       <Route path='/comments' component={ControlComment}/>
       <Route path='/controlFinishedTasks' component={ControlFinishedTasks}/>
       <Route path='/closeTask' component={CloseTask}/>
     </Switch>
    </div>
    </BrowserRouter>
  );
}

export default App;
