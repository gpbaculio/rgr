// external imports
import { nodeDefinitions, fromGlobalId } from 'graphql-relay'
// local imports
import { getUser, getTodo, getNotification } from '../../database'
import { User, Todo, Notification } from '../../models'
import { GraphQLUserType, GraphQLTodoType, GraphQLNotificationType } from '../query/objectTypes'

export const { nodeInterface, nodeField } = nodeDefinitions(
  async (globalId) => {
    const { type, id } = fromGlobalId(globalId)
    if (type === 'User') {
      return await getUser(id);
    } if (type === 'Todo') {
      return await getTodo(id);
    } if (type === 'Notification') {
      return await getNotification(id);
    } else {
      return null
    }
  },
  obj => {
    if (obj instanceof User) { // instance of User model
      return GraphQLUserType; // resolved user, GraphQLUserType type
    } else if (obj instanceof Todo) { // instance of User model
      return GraphQLTodoType; // resolved user, GraphQLUserType type
    } else if (obj instanceof Notification) { // instance of User model
      return GraphQLNotificationType; // resolved user, GraphQLUserType type
    } else {
      return null
    }
  }
);
