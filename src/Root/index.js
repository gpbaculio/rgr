import React, {Component} from 'react'
import {Switch, Route} from 'react-router-dom';

import Header from './Header';

import Home from './Home';
import LogIn from './LogIn';
import SignUp from './SignUp';
import Profile from './Profile';

class App extends Component {
  render() {
    return (
      <div>
        <Header/>
        <Switch>
          <Route path='/home' component={Home}/>
          <Route path='/login' component={LogIn}/>
          <Route path='/signup' component={SignUp}/>
          <Route path='/profile' component={Profile}/>
        </Switch>
      </div>
    )
  }
}

export default App
