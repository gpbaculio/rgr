// external imports
import { GraphQLObjectType, GraphQLString, GraphQLBoolean, GraphQLList} from 'graphql'
import { globalIdField } from 'graphql-relay'

import { nodeInterface } from '../../definitions';

const GraphQLTodo = new GraphQLObjectType({
  name: 'Todo',
  fields: {
    id: globalIdField('Todo'),
    text: {
      type: GraphQLString,
      resolve: ({text}) => text,
    },
    complete: {
      type: GraphQLBoolean,
      resolve: ({complete}) => complete,
    },
    likes : {
      type: GraphQLBoolean,
      resolve: ({likes}) => likes,
    },
    likersUserId : {
      type: new GraphQLList(GraphQLString),
      resolve: ({likersUserId}) => likersUserId,
    },
    owner: {
      type: GraphQLString,
      resolve: (root) => {
        if(typeof root.userId !== 'undefined') {
          return root.userId.displayName; // displayName of the ownder of todo 
        }
        return null;
      },
    },
  },
  interfaces: [nodeInterface],
});

export default GraphQLTodo;