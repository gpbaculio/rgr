import React from 'react';
import {withRouter} from 'react-router';
import './style.css';

class Header extends React.Component {
  render() {
    return (
      <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <a class="navbar-brand" href="#">Glendon</a>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarText">
          <ul class="navbar-nav mr-auto">
            <li className="nav-item active">
              <a className="nav-link" href="#">
                <i class="fa fa-home"/>
                Home
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#"><i class="fa fa-user-circle-o"/>Profile</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#"><i class="fa fa-envelope-o" aria-hidden="true"/>Message</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">
              <i class="fa fa-bell-o"></i>Notifications</a>
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