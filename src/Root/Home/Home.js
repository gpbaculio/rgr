import React from 'react';
import {createRefetchContainer, graphql} from 'react-relay';

import Todo from './Todo';

import './style.css';

// local imports
import TodoAddedSubscription from '../../subscriptions/todoAdded';
import TodoLikedSubscription from '../../subscriptions/todoAdded';

const todoFields = [
  'text',
  'complete',
  'owner',
  'likes',
  'likersUserId',
];

class Home extends React.Component {
  //subscriptions
  subscribeTodoLiked = TodoLikedSubscription({}, {
    onCompleted: () => console.log('todoLiked Successful subscription completed'),
    onError: transaction => console.log('todoLiked subscription failed', transaction),
    onNext: response => console.log('todoLiked subscription response = ', response),
    updater: store => {
      const subscriptionPayload = store.getRootField('todoLiked');
      const subscribedTodoEdge = subscriptionPayload.getLinkedRecord('todo');
      const todoRecordFromStore = store.get(subscribedTodoEdge.id); 
      todoFields.forEach(field => {
        todoRecordFromStore.setValue(
          subscribedTodoEdge[field],
          field,
        );
      })
    }
  })
  subscribeTodoAdded = TodoAddedSubscription({}, {
    onCompleted: () => console.log('todoAdded Successful subscription completed'),
    onError: transaction => console.log('todoAdded subscription failed', transaction),
    onNext: response => console.log('todoAdded subscription response = ', response)
  })
  componentDidMount() {
    this.todoAddedubscription = this.subscribeTodoAdded.commit([
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
    this.todoLikedubscription = this.subscribeTodoLiked.commit()
  }
  componentWillUnmount() {
    this.todoAddedubscription.dispose()
  }
  render() {
    const { viewer } = this.props;
    return (
      <div>
        Home Public Latest Todos!
        <ul>
          {viewer.publicTodos.edges.map(({node: todo}, i) => (
            <li key={i}> 
              <Todo todo={todo} viewer={viewer} />
            </li>
          ))}
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
      ...Todo_viewer
      publicTodos(first: $count, after: $cursor) @connection(key: "User_publicTodos") {
        edges {
          node {
            id
            ...Todo_todo
          }
        }
      }
      displayName
    }
  `,
  graphql`
    query HomeQuery($count: Int!, $cursor:String) {
      viewer {
        id
        ...Home_viewer @arguments(count: $count, cursor: $cursor)
      }
    }
  `
);