import React from 'react';
import {createRefetchContainer, graphql} from 'react-relay';
import { fromGlobalId } from 'graphql-relay'
// local imports
import likeTodoMutation from '../../mutations/likeTodo';

import TodoAddedSubscription from '../../subscriptions/todoAdded';
import TodoLikedSubscription from '../../subscriptions/todoAdded';

import './style.css';

const todoFields = [
  'text',
  'complete',
  'owner',
  'likes',
  'likersUserId',
];

class Home extends React.Component {
  //mutations
  _likeTodo = (e, todo) => {
    e.preventDefault();
    const { newTodoText: text } = this.state;
    const { viewer } = this.props;
    const { id: clientUserId } = viewer; // userId is owner of the todo
    this.setState({ createClicked: true });
    const mutation = likeTodoMutation(
      { todoId: todo.id, userId: clientUserId },
      {
        onSuccess: () => console.log('like mutation successful'),
        onError: e => console.log('like mutation failed = ', e),
        updater: store => {
          const likeTodoPayload = store.getRootField('likeTodo'); // payload from the mutation name
          const todoEdge = likeTodoPayload.getLinkedRecord('todo'); // the new todo added
          const todoRecordFromStore = store.get(todoEdge.id);
          todoFields.forEach(field => {
            todoRecordFromStore.setValue(
              todoEdge[field],
              field,
            );
          })
        },
        optimisticResponse: () => ({
          likeTodo: { // mock of payload we like to take effect on client
            todo: {
              id: todo.id,
              likersUserId: [...todo.likersUserId, fromGlobalId(clientUserId).id]
            },
          },
        }),
      },
    );
    mutation.commit()
  }
  //subscriptions
  subscribeTodoAdded = TodoAddedSubscription({}, {
    onCompleted: () => console.log('todoAdded Successful subscription completed'),
    onError: transaction => console.log('todoAdded subscription failed', transaction),
    onNext: response => console.log('todoAdded subscription response = ', response)
  })
  subscribeTodoLiked = TodoLikedSubscription({}, {
    onCompleted: () => console.log('todoLiked Successful subscription completed'),
    onError: transaction => console.log('todoLiked subscription failed', transaction),
    onNext: response => console.log('todoLiked subscription response = ', response),
    updater: store => {
      const subscriptionPayload = store.getRootField('todoLiked');
      const subscribedTodoEdge = subscriptionPayload.getLinkedRecord('todo');
      // maybe we can subscribedTodoEdge fields instead of todoFields? *to try next
      const todoRecordFromStore = store.get(subscribedTodoEdge.id); 
      todoFields.forEach(field => {
        todoRecordFromStore.setValue(
          subscribedTodoEdge[field],
          field,
        );
      })
    }
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
    this.todoLikedubscription.dispose()
  }
  render() {
    return (
      <div>
        Home Public Latest Todos!
        <ul style={{listStyleType: 'square'}}>
          {this.props.viewer.publicTodos.edges.map(({node: todo}) => {
            return ( 
              <li key={todo.id}>
                <div class="card text-center" style={{ width: '18rem' }}>
                  <div class="card-body">
                    <h5 class="card-title">{todo.owner}</h5>
                    <p class="card-text">{todo.text} complete: {`${todo.complete}`}</p>
                    <a href="/" class={todo.likersUserId.includes(fromGlobalId(this.props.viewer.id).id) ? 'btn btn-primary' : 'btn btn-secondary'}>Like</a>
                  </div>
                </div>
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
            likes
            likersUserId
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