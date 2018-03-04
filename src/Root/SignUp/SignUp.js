import React from 'react';
import {withRouter} from 'react-router';

import userRegistrationMutation from '../../mutations/userRegistration';
import './style.css';

class SignUp extends React.Component {

  state = {
    displayName: '',
    email: '',
    password: '',
    signUpClicked: false,
    signUpError: false,
    invalidCredentials: false
  }

  _signUp = (e) => {
    e.preventDefault();
    const { displayName, email, password } = this.state;
    this.setState({
      signUpClicked: true
    });
    const mutation = userRegistrationMutation(
      { displayName, email, password },
      {
        onSuccess: ({userRegistration}) => {
          const {error, token} = userRegistration;
          let state = { signUpClicked: false, displayName: '', email: '', password: '', };
          if (!token && error) {
            state = {
              ...state,
              signUpError: true,
            }
          }
          this.setState({ ...state })
        },
        onFailure: transaction => this.setState({ signUpError: true, displayName: '', email: '', password: '', }),
      },
    );
    mutation.commit()
  }
  _handleChange = (name, e) => {
    let change = {};
    change[name] = e.target.value;
    this.setState((state, props) => ({
      ...change,
      signUpError: false,
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
    const {signUpError} = this.state;
    return (
      <div className="signup-container text-center row">
        <div
          style={{
          margin: 'auto',
          padding: '2%',
          backgroundColor: '#F8F9FA',
          border: '1px solid #ced4da',
        }}
          className="container col-md-5 col-md-5 col-sm-6 col-xs-12 text-center">
          <h3
            style={{
              fontWeight: '400',
              marginBottom: '20px',
              color: '#6c757d',
            }}
          >
            Sign Up
          </h3>
          <div
            style={{
              margin: '4% 3% 3% 0',
              padding: '3%',
            }}
            className="container">
            <form onSubmit={(e) => this._signUp(e)}>
              <div className="form-group row">
                <label 
                  style={{
                    color: '#6c757d',
                  }} 
                  className="col-sm-4 col-form-label col-form-label-md"
                >
                  Display Name
                </label>
                <div className="col-sm-8">
                  <input
                    type="displayName"
                    value={this.state.displayName}
                    onChange={(e) => this._handleChange('displayName', e)}
                    className="form-control form-control-md"
                    placeholder="you@example.com"/>
                </div>
              </div>
              <div className="form-group row">
                <label 
                  style={{
                    color: '#6c757d',
                  }} 
                  className="col-sm-4 col-form-label col-form-label-md"
                >
                  Email
                </label>
                <div className="col-sm-8">
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
                    color: '#6c757d',
                  }} 
                  className="col-sm-4 col-form-label col-form-label-md"
                >
                  Password
                </label>
                <div className="col-sm-8">
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
                className="btn btn-primary btn-md"
                disabled={this.state.signUpClicked}>{Boolean(this.state.signUpClicked)
                  ? 'Signing Up...'
                  : 'Sign Up'}</button>
              {Boolean(signUpError)
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
            color: '#6c757d',
          }}>
            Already have an Account?
            <span
              className="btn btn-link"
              onClick={() => this.props.history.push('/login')}>Log In</span>
          </p>
        </div>
      </div>
    )
  }
}

export default withRouter(SignUp)