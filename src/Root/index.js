import React, {Component} from 'react'
import {Switch, Route} from 'react-router-dom';
import { 
  InputGroup,
  Input,
  InputGroupAddon,
  Button,
} from 'reactstrap'

import Header from './Header';

import Home from './Home';
import LogIn from './LogIn';
import SignUp from './SignUp';
import Profile from './Profile';
import Footer from './Footer';

class App extends Component {
  state = {
    name: '',
    email: '',
  }
  handleChange = (e) => {
    const { name, value } = e.target;
    const change = {};
    change[name] = value;
    this.setState({ ...change });
  }
  render() {
    const { name, email } = this.state;
    return (
      <div>
        <Header/>
        <div style={{ width: '300px', margin: '5% auto' }}>  
          <InputGroup>
            <Input value={name} placeholder="name" name="name" onChange={this.handleChange} />
            <Input value={email} placeholder="email" name="email" onChange={this.handleChange} />
            <InputGroupAddon addonType="append" onClick={() => window.growTiger(name, email)} ><Button>Subscribe</Button></InputGroupAddon>
          </InputGroup>
        </div>
        <Switch>
          <Route path='/home' component={Home}/>
          <Route path='/login' component={LogIn}/>
          <Route path='/signup' component={SignUp}/>
          <Route path='/profile' component={Profile}/>
        </Switch>
        <Footer/>
      </div>
    )
  }
}

export default App
