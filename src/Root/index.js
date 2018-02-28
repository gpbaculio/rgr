import React, {Component} from 'react'
import {Switch, Route} from 'react-router-dom';

import Header from './Header';

import Home from './Home';
import LogIn from './LogIn';
import SignUp from './SignUp';

class App extends Component {
  render() {
    return (
      <div>
        <Header/>
        <Switch>
          <Route path='/home' component={Home}/>
          <Route path='/login' component={LogIn}/>
          <Route path='/signup' component={SignUp}/>
        </Switch>
      </div>
    )
  }
}

export default App
