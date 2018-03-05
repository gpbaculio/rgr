import React from 'react'
import {QueryRenderer, graphql} from 'react-relay';

import Profile from './Profile';
import environment from '../../Root/relayEnv';

const indexQuery = graphql` 
  query ProfileRendererQuery($count: Int!, $cursor: String)  {
    viewer {
      ...Profile_viewer
    }
  }
`

const ProfileRenderer = () => (
  <QueryRenderer
    environment={environment}
    query={indexQuery}
    variables={{ count: 4 }}
    render={({error, props}) => {
      if (error) {
        console.log(error);
        return <div>{error.message}</div>
      } else if (props) {
        return <Profile viewer={props.viewer}/>
      }
      return <div>Loading...</div>
    }}
  />
);

export default ProfileRenderer