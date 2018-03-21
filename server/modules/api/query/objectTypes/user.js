// external imports
import { GraphQLObjectType, GraphQLString } from 'graphql'
import {
  globalIdField,
  connectionArgs,
  connectionFromArray,
  connectionDefinitions
} from 'graphql-relay'

import {getAllTodosByViewer, getPublicTodos, getUserNotofications} from '../../../database'
import GraphQLTodoType from './todo';
import GraphQLNotificationType from './notification';
import { nodeInterface } from '../../definitions'

export const { connectionType: todosConnection, edgeType: GraphQLTodoEdge } = connectionDefinitions({name: 'Todo', nodeType: GraphQLTodoType});
export const { connectionType: notificationsConnection, edgeType: GraphQLNotificationEdge } = connectionDefinitions({name: 'Notification', nodeType: GraphQLNotificationType});

const GraphQLUserType = new GraphQLObjectType({
  name: 'User',
  interfaces: [nodeInterface],
  fields: () => ({
    id: globalIdField('User'),
    displayName: {
      type:  GraphQLString,
      resolve: ({ displayName }) => displayName
    },
    allTodosByViewer: {
      type: todosConnection,
      args: {
        ...connectionArgs,
      },
      resolve: async(_root, { ...args }, { user }) => {
        const allTodosByViewer = await getAllTodosByViewer(user._id);
        return connectionFromArray(allTodosByViewer, args)
      }
    },
    publicTodos: {
      type: todosConnection,
      args: {
        ...connectionArgs,
      },
      resolve: async(_root, { ...args }, { user }) => {
        const publicTodos = await getPublicTodos();
        return connectionFromArray(publicTodos, args)
      }
    },
    notifications: {
      type: notificationsConnection,
      args: {
        ...connectionArgs,
      },
      resolve: async(_root, { ...args }, { user }) => {
        return connectionFromArray(await getUserNotofications(user._id), args)
      }
    }
  })
})

export default GraphQLUserType
