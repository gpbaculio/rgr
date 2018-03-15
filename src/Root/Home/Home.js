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
      const todoFieldsToUpdate = [
        'text',
        'complete',
        'owner',
        'likes',
        'likersUserId',
      ];
      console.log('typeof = ',store.getRootField())
      if(typeof store.getRootField('todoLiked') === 'undefined') {
        return;
      }
      const likeTodoPayload = store.getRootField('todoLiked'); // payload from the mutation name
        const todoEdge = likeTodoPayload.getLinkedRecord('todo'); // the new todo added
        const todoNode = todoEdge.getLinkedRecord('node');
      const todoProxy = store.get(todoNode.getValue('id'))
      todoFieldsToUpdate.forEach(field => {
        const value = todoNode.getValue(field);
        console.log('subscription value = ', value);
        todoProxy.setValue(value, field)
      });
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
    this.todoLikedsubscription = this.subscribeTodoLiked.commit()
  }
  componentWillUnmount() {
    this.todoAddedubscription.dispose()
    this.todoLikedsubscription.dispose()
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