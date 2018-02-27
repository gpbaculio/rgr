import React from 'react';
import {withRouter} from 'react-router';
import './style.css';

class Header extends React.Component {

  state = {
    activeItem: '',
    navCollapsed: true,
    loggedIn: false
  }

  componentWillMount() {
    const email = localStorage.getItem('email');
    const token = localStorage.getItem('token');
    const apiKey = localStorage.getItem('apiKey');
    if (Boolean(email && token && apiKey) && this.props.location.pathname === "/news") {
      this.setState((state, props) => ({loggedIn: true}), () => {
        if (this.state.loggedIn) {
          this.handleHeaderMenuClick('news')
        }
      });
    }
  }

  _onToggleNav = () => {
    this.setState({
      navCollapsed: !this.state.navCollapsed
    })
  }

  handleHeaderMenuClick = (name) => {
    this.forceUpdate()
    const {history} = this.props;
    history.push(name);
    this.setState({activeItem: name});
  }

  onHomeClick = () => {
    this.setState((state, props) => ({activeItem: ''}), () => {
      const {history} = this.props;
      history.push('/')
    });
  }

  clearStorage = () => {
    const {location} = window;
    const {history} = this.props;
    localStorage.clear();
    setTimeout(() => {
      history.push('/login')
      location.reload(true)
    }, 200);
  }

  getFontColor = (active) => {
    if (active) {
      return ({color: '#ff9966'})
    }
    return ({color: '#fff'})
  }

  render() {
    const email = localStorage.getItem('email');
    const token = localStorage.getItem('token');
    const apiKey = localStorage.getItem('apiKey');
    return Boolean(email && token && apiKey)
      ? (
        <nav
          style={{
          fontSize: '24px',
          position: 'relative',
          backgroundColor: '#111326 !important',
          width: '100%'
        }}
          className="navbar navbar-expand-md navbar-dark bg-dark fixed-top">
          <span className="navbar-brand" onClick={this.onHomeClick}>CryptoNewsApi</span>
          <button
            onClick={this._onToggleNav}
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            aria-expanded="false"
            aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div
            className={(Boolean(this.state.navCollapsed)
            ? 'collapse'
            : '') + ' navbar-collapse'}>
            <ul className="navbar-nav mr-auto">
              <li className="nav-item">
                <a
                  style={this.getFontColor(Boolean(this.state.activeItem === 'news'))}
                  className="nav-link"
                  onClick={() => this.handleHeaderMenuClick('news')}>
                  News
                </a>
              </li>
              <li className="nav-item">
                <a
                  href={'//www.cryptonewsapi.com/api.html'}
                  target="_blank"
                  style={this.getFontColor(Boolean(this.state.activeItem === 'documentation'))}
                  className="nav-link">Documentation</a>
              </li>
              <li className="nav-item">
                <a
                  style={this.getFontColor(Boolean(this.state.activeItem === 'profile'))}
                  className="nav-link"
                  onClick={() => this.handleHeaderMenuClick('profile')}>Profile</a>
              </li>
              <li className="nav-item">
                <a
                  style={this.getFontColor(Boolean(this.state.activeItem === 'get'))}
                  className="nav-link"
                  onClick={() => this.handleHeaderMenuClick('get')}>Get API Key</a>
              </li>
            </ul>

            <ul className="navbar-nav ml-auto">
              <li className="nav-item">
                <a
                  style={{
                  color: '#fff'
                }}
                  className="nav-link"
                  onClick={() => this.clearStorage()}>Logout</a>
              </li>
            </ul>

          </div>
        </nav>
      )
      : (
        <nav
          style={{
          fontSize: '24px',
          position: 'relative',
          backgroundColor: '#111326 !important'
        }}
          className="navbar navbar-expand-md navbar-dark bg-dark fixed-top">
          <span className="navbar-brand" onClick={this.onHomeClick}>CryptoNewsApi</span>
          <button
            onClick={this._onToggleNav}
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            aria-expanded="false"
            aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div
            className={(Boolean(this.state.navCollapsed)
            ? 'collapse'
            : '') + ' navbar-collapse'}>
            <ul className="navbar-nav mr-auto">
              <li className="nav-item">
                <a
                  style={this.getFontColor(Boolean(this.state.activeItem === 'news'))}
                  className="nav-link"
                  onClick={() => this.handleHeaderMenuClick('news')}>News
                </a>
              </li>
              <li className="nav-item">
                <a
                  style={this.getFontColor(Boolean(this.state.activeItem === 'documentation'))}
                  className="nav-link"
                  onClick={() => this.handleHeaderMenuClick('documentation')}>Documentation</a>
              </li>
              <li className="nav-item">
                <a
                  style={this.getFontColor(Boolean(this.state.activeItem === 'login'))}
                  className="nav-link"
                  onClick={() => this.handleHeaderMenuClick('login')}>Login</a>
              </li>
              <li className="nav-item">
                <a
                  style={this.getFontColor(Boolean(this.state.activeItem === 'get'))}
                  className="nav-link"
                  onClick={() => this.handleHeaderMenuClick('get')}>Get API Key</a>
              </li>
            </ul>
          </div>
        </nav>
      )
  }
}

export default withRouter(Header)