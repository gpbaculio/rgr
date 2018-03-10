import React from 'react';
import {createRefetchContainer, graphql} from 'react-relay';
// local imports
import TodoAddedSubscription from '../../subscriptions/todoAdded';
import './style.css';

class Home extends React.Component {
  subscribe = TodoAddedSubscription({}, {
    onCompleted: () => console.log('Successful subscription completed'),
    onError: transaction => console.log('subscription failed', transaction),
    onNext: response => console.log('subscription response = ', response)
  })
  componentDidMount() {
    this.subscription = this.subscribe.commit([
      {
        type: 'RANGE_ADD',
        parentID: this.props.viewer.id,
        connectionInfo: [
          {
            key: 'User_publicTodos',
            rangeBehavior: 'prepend'
          }
        ],
        edgeName: 'todo'
      }
    ])
  }
  componentWillUnmount() {
    console.log('Home unmounted!')
    this.subscription.dispose()
  }
  render() {
    return (
      <div>
        Home Public Latest Todos!
        <ul style={{listStyleType: 'square'}}>
          {this.props.viewer.publicTodos.edges.map(({node}, i) => {
            return ( 
              <li key={node.id}>
                {i+1}: &nbsp;
                owner: {node.owner} &nbsp;
                text: {node.text} &nbsp;
                compelete: {`${node.complete}`} &nbsp; 
              </li>
            )
          })}
        </ul>
      </div>
    );
  }
}

export default createRefetchContainer(
  Home,
  graphql`
    fragment  Home_viewer on User 
    @argumentDefinitions(  count: {type: "Int"}, cursor: {type: "String"}) {
      id
      publicTodos(first: $count, after: $cursor) @connection(key: "User_publicTodos") {
        edges {
          node {
            id
            text
            complete
            owner
          }
        }
      }
      displayName
    }
  `,
  graphql`
    # Refetch query to be fetched upon calling refetch.
    # Notice that we re-use our fragment and the shape of this query matches our fragment spec.
    query HomeQuery($count: Int!, $cursor:String) {
      viewer {
        id
        ...Home_viewer @arguments(count: $count, cursor: $cursor)
      }
    }
  `
);