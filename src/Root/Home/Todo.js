import React, { Component } from 'react';
import { createFragmentContainer, graphql } from 'react-relay';
import { fromGlobalId } from 'graphql-relay';

import likeTodoMutation from '../../mutations/likeTodo';

class Todo extends Component {
  _likeTodo = (e) => {
    e.preventDefault();
    const { viewer, todo } = this.props;
    const { id: clientUserId } = viewer; // userId is owner of the todo
    const mutation = likeTodoMutation(
      { todoId: fromGlobalId(todo.id).id, userId: fromGlobalId(clientUserId).id },
      {
        onSuccess: () => console.log('like mutation successful'),
        onError: e => console.log('like mutation failed = ', e),
        updater: store => {
          const todoFieldsToUpdate = [
            'text',
            'complete',
            'owner',
            'likes',
            'likersUserId',
          ];
          const likeTodoPayload = store.getRootField('likeTodo'); // payload from the mutation name
            const todoEdge = likeTodoPayload.getLinkedRecord('todo'); // the new todo added
            const todoNode = todoEdge.getLinkedRecord('node');
          const todoProxy = store.get(todo.id)
          todoFieldsToUpdate.forEach(field => {
            const value = todoNode.getValue(field);
            console.log('value = ', value);
            todoProxy.setValue(value, field)
          })
          console.log('todoProxy = ', todoProxy);
        },
        optimisticResponse: () => {
          const userIdinDb = fromGlobalId(clientUserId).id
          const userLiked = todo.likersUserId.includes(userIdinDb);
          return ({
            likeTodo: { // mock of payload we like to take effect on client
              todo: {
                id: todo.id,
                likes: userLiked ? todo.likes + 1 : todo.likes - 1,
                likersUserId: userLiked ? [...todo.likersUserId].filter(id => id !== userIdinDb) : [...todo.likersUserId, userIdinDb]
              },
            },
          })
        },
      },
    );
    mutation.commit()
  }
  componentWillUnmount() {
    this.todoLikedubscription.dispose()
  }
  render() {
    const { todo, viewer } = this.props;
    const userIdinDb = fromGlobalId(viewer.id).id;
    console.log('todo = ', todo);
    return (
      <div className="card text-center" style={{ width: '18rem' }}>
        <div className="card-body">
          <h5 className="card-title">{todo.owner}</h5>
          <p className="card-text">text: {todo.text} complete: {`${todo.complete}`} likes: {Number(todo.likes)}</p>
          <button
            className={todo.likersUserId.includes(userIdinDb) ? 'btn btn-primary' : 'btn btn-secondary'}
            onClick={this._likeTodo}
          >
            Like
          </button>
        </div>
      </div>
    );
  }
}

export default createFragmentContainer(
  Todo,
  {
    todo: graphql`
      fragment Todo_todo on Todo {
        id
        text
        complete
        owner
        likes
        likersUserId
      }
    `,
    viewer: graphql`
      fragment Todo_viewer on User {
        id
        displayName
      }
    `
  }
)