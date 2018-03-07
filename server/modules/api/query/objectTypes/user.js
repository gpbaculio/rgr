// external imports
import { GraphQLObjectType, GraphQLString } from 'graphql'
import { globalIdField, connectionArgs, connectionFromArray, connectionDefinitions } from 'graphql-relay'

import {getAllTodosByViewer, getPublicTodos} from '../../../database'
import GraphQLTodoType from './todo';

export const {
  connectionType: todosConnection,
  edgeType: GraphQLTodoEdge
} = connectionDefinitions({name: 'Todo', nodeType: GraphQLTodoType});

const GraphQLUserType = new GraphQLObjectType({
  name: 'User',
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
    }
  })
})

export default GraphQLUserType
