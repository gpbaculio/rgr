import React, {Component} from 'react';
import {QueryRenderer, graphql} from 'react-relay';

import Home from './Home';
import environment from '../relayEnv';

const HomeRendererQuery = graphql `
  query HomeRendererQuery($count: Int, $cursor:String) {
    viewer {
      ...Home_viewer 
    }
  }
`;

class HomeRenderer extends Component {
  render() {
    return (
      <QueryRenderer
        environment={environment}
        query={HomeRendererQuery}
        variables={{
          count: 30 // limit 30 nodes on first query
        }}
        render={({error, props}) => {
          if (error) {
            console.log(error);
            return <div>{error.message}</div>
          } else if (props) {
            return <Home viewer={props.viewer}/>
          }
          return <div>Loading...</div>
        }}
      />
    )
  }
}

export default HomeRenderer