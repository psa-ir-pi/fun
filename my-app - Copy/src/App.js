import logo from './logo.svg';
import './App.css';

import {Home} from './Home';
import {AllProjects} from './AllProjects';
import MyProjects from './MyProjects';
import {ControlComment} from './ControlComment';
import {Navigation} from './Navigation';

import React, { useState } from "react";

import {BrowserRouter, Route, Switch} from 'react-router-dom';
import { Sprint } from './Sprint';

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
       <Route path='/sprint' component={Sprint}/>
     </Switch>
    </div>
    </BrowserRouter>
  );
}

export default App;
