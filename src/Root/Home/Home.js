import React from 'react';
import {createRefetchContainer, graphql} from 'react-relay';

import Todo from './Todo';

import './style.css';

// local imports
import TodoAddedSubscription from '../../subscriptions/todoAdded';
import TodoLikedSubscription from '../../subscriptions/todoLiked';

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
    updater: store => {
      const todoFieldsToUpdate = [
        'text',
        'complete',
        'owner',
        'likes',
        'likersUserId',
      ];
        const likeTodoPayload = store.getRootField('todoLiked'); // payload from the mutation name
        const todoEdge = likeTodoPayload.getLinkedRecord('todo'); // the new todo added
        const todoNode = todoEdge.getLinkedRecord('node');
        const todoProxy = store.get(todoNode.getValue('id'))
        todoFieldsToUpdate.forEach(field => {
          const value = todoNode.getValue(field);
          todoProxy.setValue(value, field)
        });
    }
  })
  subscribeTodoAdded = TodoAddedSubscription({}, {})
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