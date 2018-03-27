import React, { Component } from 'react';
import { QueryRenderer, graphql } from 'react-relay';

import Header from './Header';
import env from '../relayEnv';

const HeaderQuery = graphql`
  query HeaderQuery($count: Int!, $cursor: String) {
    viewer {
      ...Header_viewer @arguments(count: $count, cursor: $cursor)
    }
  }
`;

class HeaderRenderer extends Component {
  render() {
    return (
      <QueryRenderer
        environment={env}
        query={HeaderQuery}
        variables={{ count: 5 }}
        render={({error, props}) => {
          if (error) {
            console.log(error);
            return (
              <div>{error.message}</div>
            );
          }
          if (props) {
            return (
              <Header viewer={props.viewer}/>
            );
          }
          return (
            <div>
              Loading...
            </div>
          );
        }}
      />
    )
  }
}

export default HeaderRenderer;
