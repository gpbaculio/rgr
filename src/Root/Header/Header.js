import React from 'react';
import { NavLink, withRouter, Link } from 'react-router-dom';
import './style.css';

class Header extends React.Component {
  render() {
    const authorized = localStorage.getItem('token')
    return (
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <a className="navbar-brand" href="#">HighOutput</a>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarText">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item">
              <NavLink
                to="/home"
                activeClassName="active"
                className="nav-link"
              >
                <i className="fa fa-home"/>
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/profile"
                activeClassName="active"
                className="nav-link"
              >
                <i className="fa fa-user-circle-o"/>
                Profile
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/messages"
                activeClassName="active"
                className="nav-link"
              >
                <i className="fa fa-envelope-o" aria-hidden="true"/>
                Messages
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/notifications"
                activeClassName="active"
                className="nav-link"
              >
                <i className="fa fa-bell-o"></i>
                Notifications
              </NavLink>
            </li>
          </ul>
            {authorized ?
              <div className='ml1 pointer black' onClick={() => {
                localStorage.removeItem('token')
                this.props.history.push('login')
              }}>Logout</div>
              :
              <NavLink
                to="/login"
                activeClassName="active"
                className="nav-link"
              >
                <span className="navbar-text">
                  <i className="fa fa-key"/>
                  Login
                </span>
              </NavLink>
            }
        </div>
      </nav>
    );
  }
}
export default withRouter(Header)