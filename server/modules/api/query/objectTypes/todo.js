// external imports
import { GraphQLObjectType, GraphQLString, GraphQLBoolean } from 'graphql'
import { globalIdField } from 'graphql-relay'

import { nodeInterface } from '../../definitions';

const GraphQLTodo = new GraphQLObjectType({
  name: 'Todo',
  fields: {
    id: globalIdField('Todo'),
    text: {
      type: GraphQLString,
      resolve: (obj) => obj.text,
    },
    complete: {
      type: GraphQLBoolean,
      resolve: (obj) => obj.complete,
    },
  },
  interfaces: [nodeInterface],
});

export default GraphQLTodo;