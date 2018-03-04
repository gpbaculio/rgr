import React from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import './style.css';

class Header extends React.Component {
  render() {
    return (
      <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <a class="navbar-brand" href="#">HighOutput</a>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarText">
          <ul class="navbar-nav mr-auto">
            <li className="nav-item active">
              <NavLink
                to="/home"
                activeClassName="active"
                className="nav-link"
              >
                <i class="fa fa-home"/>
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/profile"
                activeClassName="active"
                className="nav-link"
              >
                <i class="fa fa-user-circle-o"/>
                Profile
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/messages"
                activeClassName="active"
                className="nav-link"
              >
                <i class="fa fa-envelope-o" aria-hidden="true"/>
                messages
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/notifications"
                activeClassName="active"
                className="nav-link"
              >
                <i class="fa fa-bell-o"></i>
                Notifications
              </NavLink>
            </li>
          </ul>
          <span class="navbar-text">
            Logout
          </span>
        </div>
      </nav>
    );
  }
}
export default withRouter(Header)