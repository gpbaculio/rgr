import React, { Component } from 'react';
import { createFragmentContainer, graphql } from 'react-relay';
import { fromGlobalId } from 'graphql-relay';

import likeTodoMutation from '../../mutations/likeTodo';
import newNotificationMutation from '../../mutations/newNotification';

class Todo extends Component {
  _likeTodo = e => {
    e.preventDefault();
    const { viewer, todo } = this.props;
    const todoId = fromGlobalId(todo.id).id;
    const likerId = fromGlobalId(viewer.id).id;
    const mutation = likeTodoMutation(
      { todoId, userId: likerId },
      {
        optimisticUpdater: store => {
          const todoProxy = store.get(todo.id)
          const todoProxyLikes = todoProxy.getValue('likes')
          const todoProxyLikersUserId = todoProxy.getValue('likersUserId')
          const userIdinDb = fromGlobalId(likerId).id
          const userLiked = todoProxyLikersUserId.includes(userIdinDb)
          const newTodoLikes = userLiked ? todoProxyLikes - 1 : todoProxyLikes + 1
          const newTodoLikersUserId = userLiked ? [...todoProxyLikersUserId].filter(id => id !== userIdinDb) : [...todoProxyLikersUserId, userIdinDb]
            todoProxy.setValue(newTodoLikes, 'likes')
            todoProxy.setValue(newTodoLikersUserId, 'likersUserId')
        },
        updater: store => {
          const todoFieldsToUpdate = [ 'text', 'complete', 'owner', 'likes', 'likersUserId'];
          const likeTodoPayload = store.getRootField('likeTodo'); // payload from the mutation name
            const todoEdge = likeTodoPayload.getLinkedRecord('todo'); // the new todo added
            const todoNode = todoEdge.getLinkedRecord('node');
          const todoProxy = store.get(todo.id)
          todoFieldsToUpdate.forEach(field => {
            const value = todoNode.getValue(field);
            todoProxy.setValue(value, field)
          });
        },
        onCompleted: () => console.log('like completed')
      },
    );
    const ntfmutation = newNotificationMutation(
      { todoId, likerId },
      {
        onCompleted: () => console.log('newNotificationMutation completed!'),
        onError: () => console.log('newNotificationMutation error!'),
      }
    );
    mutation.commit()
    ntfmutation.commit()
  }
  render() {
    const { todo, viewer } = this.props;
    const userIdinDb = fromGlobalId(viewer.id).id;
    const userLiked = todo.likersUserId.includes(userIdinDb);
    return (
      <div className="card text-center" style={{ width: '18rem' }}>
        <div className="card-body">
          <h5 className="card-title">{todo.owner}</h5>
          <p className="card-text">text: {todo.text} complete: {`${todo.complete}`} likes: {Number(todo.likes)}</p>
          <button
            className={userLiked ? 'btn btn-primary' : 'btn btn-secondary'}
            onClick={this._likeTodo}
          >
            Like
          </button>
          {userLiked ? ` you and ${Number(todo.likes) -1} people likes this todo` : ` ${Number(todo.likes)} likes this`}
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