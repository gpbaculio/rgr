import React, {Component} from 'react'
import {Switch, Route} from 'react-router-dom';

import SignIn from './SignIn';
import SignUp from './SignUp';
import Header from './Header';
import Home from './Home';

class App extends Component {
  render() {
    return (
      <div>
        <Header/>
        <Switch>
          <Route path='/home' component={Home}/>
          <Route path='/login' component={SignIn}/>
          <Route path='/signup' component={SignUp}/>
        </Switch>
      </div>
    )
  }
}

export default App
