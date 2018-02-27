import React from 'react';
import axios from 'axios';
import {withRouter} from 'react-router';
import './style.css';
import UserLogin from '../../mutations/UserLoginMutation';

class Login extends React.Component {

  state = {
    email: '',
    password: '',
    loginClicked: false,
    loginError: false,
    invalidCredentials: false
  }

  componentDidMount() {
    const email = localStorage.getItem('email');
    const token = localStorage.getItem('token');
    const apiKey = localStorage.getItem('apiKey');
    if (email && token && apiKey) {
      const {history} = this.props;
      history.push('/profile')
    }
  }

  _login = (e) => {
    e.preventDefault();
    this.setState({
      loginClicked: true
    }, () => {
      const {email, password} = this.state;
      UserLogin.commit(email, password, ({
        token,
        email,
        refreshToken,
        apiKey,
        error,
        auth_token
      }) => {
        this.setState((state, props) => {
          if (error === 'invalidCredentials') {
            return ({loginError: true, invalidCredentials: true, userNotFound: false, loginClicked: false})
          }
          if (error === 'userNotFound') {
            return ({loginError: true, invalidCredentials: false, userNotFound: true, loginClicked: false})
          }
          return ({loginError: false, invalidCredentials: false, userNotFound: false, loginClicked: false})
        }, () => {
          const {location} = window;
          const {history} = this.props;
          const {loginError, invalidCredentials, userNotFound} = this.state;
          localStorage.setItem('token', token);
          localStorage.setItem('email', email);
          localStorage.setItem('refreshToken', refreshToken);
          localStorage.setItem('apiKey', apiKey);
          localStorage.setItem('auth_token', auth_token);
          localStorage.setItem('error', error);
          if (loginError === false && invalidCredentials === false && userNotFound === false) {
            location.reload(true);
            history.push(`/`);
          }
        });
      });
    });
  }

  _handleChange = (name, e) => {
    let change = {};
    change[name] = e.target.value;
    this.setState((state, props) => ({
      ...change,
      loginError: false,
      userNotFound: false,
      invalidCredentials: false
    }));
  }

  _displayError = (invalidCredentials, userNotFound) => {
    if (invalidCredentials) {
      return (
        <span>
          <strong>
            Error !
          </strong>
          Invalid email or password.
        </span>
      )
    }
    if (userNotFound) {
      return (
        <span >
          <strong>
            Error !
          </strong>
          Email does not exis in our database.
        </span>
      )
    }
    return (
      <span>
        <strong>
          Sorry,
        </strong>
        Something went wrong.Please Try Again.
      </span>
    )
  }

  render() {
    const {loginError} = this.state;
    return (
      <div
        style={{
        position: 'relative',
        margin: '6.5%'
      }}
        className="text-center row">
        <div
          style={{
          margin: 'auto',
          padding: '2%',
          backgroundColor: 'black'
        }}
          className="container col-lg-5 col-md-5 col-sm-6 col-xs-12 text-center">
          <h3
            style={{
            fontWeight: '400',
            marginBottom: '20px',
            color: 'white'
          }}>
            Login
          </h3>
          <div
            style={{
            margin: '4% 3% 3% 0',
            padding: '3%',
            backgroundColor: '#333'
          }}
            className="container">
            <form
              style={{
              marginTop: '20px',
              color: 'white'
            }}
              onSubmit={(e) => this._login(e)}>
              <div className="form-group row">
                <label
                  style={{
                  color: 'white'
                }}
                  className="col-sm-3 col-form-label col-form-label-lg">Email</label>
                <div className="col-sm-9">
                  <input
                    type="email"
                    value={this.state.email}
                    onChange={(e) => this._handleChange('email', e)}
                    className="form-control form-control-md"
                    placeholder="you@example.com"/>
                </div>
              </div>
              <div className="form-group row">
                <label
                  style={{
                  color: 'white'
                }}
                  className="col-sm-3 col-form-label col-form-label-lg">Password</label>
                <div className="col-sm-9">
                  <input
                    type="password"
                    value={this.state.password}
                    onChange={(e) => this._handleChange('password', e)}
                    className="form-control form-control-md"
                    placeholder="Please choose a strong password."/>
                </div>
              </div>
              <button
                type="submit"
                className="btn btn-primary btn-lg"
                disabled={this.state.loginClicked}>{Boolean(this.state.loginClicked)
                  ? 'Logging in...'
                  : 'Login'}</button>
              {Boolean(loginError)
                ? (
                  <div
                    style={{
                    margin: '6.5%'
                  }}
                    className="alert alert-danger alert-dismissible fade show"
                    role="alert">
                    {/* ERROR: something went wrong with axios operation. */}
                    <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                    </button>
                    {this._displayError(this.state.invalidCredentials, this.state.userNotFound)}
                  </div>
                )
                : ''}
            </form>
          </div>
          <p
            style={{
            margin: '20px 0 0 0',
            color: 'white'
          }}>
            Don't have an Account?
            <span
              className="btn btn-link"
              onClick={() => this.props.history.push('/signup')}>Sign Up</span>
          </p>
        </div>
      </div>
    )
  }
}

export default withRouter(Login)