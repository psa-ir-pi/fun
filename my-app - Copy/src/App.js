import logo from './logo.svg';
import './App.css';

import {Home} from './Home';
import {AllProjects} from './AllProjects';
import {ProjectMember} from './ProjectMember';
import {CodeView} from './CodeView';
import {ControlSprint} from './ControlSprint';
import {Navigation} from './Navigation';

import {BrowserRouter, Route, Switch} from 'react-router-dom';

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
     </Switch>
    </div>
    </BrowserRouter>
  );
}

export default App;
