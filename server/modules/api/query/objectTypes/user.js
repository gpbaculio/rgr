// external imports
import { GraphQLObjectType, GraphQLString } from 'graphql'
import { globalIdField, connectionArgs, connectionFromArray, connectionDefinitions } from 'graphql-relay'

import {getAllTodosByViewer} from '../../../database'
import GraphQLTodoType from './todo';

export const {
  connectionType: allTodosByViewerConnection,
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
      type: allTodosByViewerConnection,
      args: {
        ...connectionArgs,
      },
      resolve: async(_root, { ...args }, { user }) => {
        const allTodosByViewer = await getAllTodosByViewer(user._id);
        console.log('allTodosByViewer = ', allTodosByViewer);
        return connectionFromArray(allTodosByViewer, args)
      }
    }
  })
})

export default GraphQLUserType
