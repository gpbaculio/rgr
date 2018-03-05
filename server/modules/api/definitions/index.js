// external imports
import { nodeDefinitions, fromGlobalId } from 'graphql-relay'
// local imports
import { getUser, getTodo } from '../../database'
import { User } from '../../models'
import { GraphQLUserType, GraphQLTodoType } from '../query/objectTypes'

export const { nodeInterface, nodeField } = nodeDefinitions(
  globalId => {
    const { type, id } = fromGlobalId(globalId)
    if (type === 'User') {
      return getUser(id);
    } if (type === 'Todo') {
      return getTodo(id);
    } else {
      return null
    }
  },
  obj => {
    if (obj instanceof User) { // instance of User model
      return GraphQLUserType; // resolved user, GraphQLUserType type
    } else if (obj instanceof User) { // instance of User model
      return GraphQLTodoType; // resolved user, GraphQLUserType type
    } else {
      return null
    }
  }
);
