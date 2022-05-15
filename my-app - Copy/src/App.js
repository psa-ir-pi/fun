import logo from './logo.svg';
import './App.css';

import {Home} from './Home';
import {AllProjects} from './AllProjects';
import {ProjectMember} from './ProjectMember';
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
     </Switch>
    </div>
    </BrowserRouter>
  );
}

export default App;
