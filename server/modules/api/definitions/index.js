// external imports
import { nodeDefinitions, fromGlobalId } from 'graphql-relay'
// local imports
import { getUser, getTodo } from '../../database'
import { User, Todo } from '../../models'
import { GraphQLUserType, GraphQLTodoType } from '../query/objectTypes'

export const { nodeInterface, nodeField } = nodeDefinitions(
  async (globalId) => {
    const { type, id } = fromGlobalId(globalId)
    console.log('id = ', id);
    console.log('type = ', type);
    console.log('getTodo(id); = ', await getTodo(id))
    if (type === 'User') {
      return await getUser(id);
    } if (type === 'Todo') {
      return await getTodo(id);
    } else {
      return null
    }
  },
  obj => {
    if (obj instanceof User) { // instance of User model
      console.log('obj instance of user!')
      return GraphQLUserType; // resolved user, GraphQLUserType type
    } else if (obj instanceof Todo) { // instance of User model
      return GraphQLTodoType; // resolved user, GraphQLUserType type
    } else {
      return null
    }
  }
);
