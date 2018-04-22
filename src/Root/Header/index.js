import React, { Component } from 'react';
import { QueryRenderer, graphql } from 'react-relay';
import {Environment} from 'relay-runtime';

import Header from './Header';
import env from '../relayEnv';
import { network, store } from '../relayEnv';

const HeaderQuery = graphql`
  query HeaderQuery($count: Int, $cursor: String, $userId: String) {
    viewer {
      ...Header_viewer @arguments(count: $count, cursor: $cursor, userId: $userId)
    }
  }
`;

let environment = new Environment({network, store});

class HeaderRenderer extends Component {
  logout = () => {
    environment = new Environment({network, store})
    console.log('logout fired')
  }
  render() {
    return (
      <QueryRenderer
        environment={environment}
        query={HeaderQuery}
        variables={{ count: 5 }}
        render={({error, props}) => {
          if (error) {
            console.log(error);
            return (
              <div>{error.message}</div>
            );
          }
          if (props) { // logged in
            return (
              <Header logout={this.logout} viewer={props.viewer}/>
            );
          }
          return ( // Not logged in
            <Header logout={this.logout} viewer={null} />
          );
        }}
      />
    )
  }
}

export default HeaderRenderer;
