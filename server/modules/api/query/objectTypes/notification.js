// external imports
import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLBoolean,
  GraphQLInt
} from 'graphql';

import { globalIdField } from 'graphql-relay'

import { nodeInterface } from '../../definitions';

const GraphQLNotification = new GraphQLObjectType({
  name: 'Notification',
  fields: {
    id: globalIdField('Notification'),
    likerId: {
      type: GraphQLString,
      resolve: ({likerId}) => likerId,
    },
    todoId: {
      type: GraphQLString,
      resolve: ({todoId}) => todoId,
    },
    seen : {
      type: GraphQLBoolean,
      resolve: ({seen}) => seen,
    },
  },
  interfaces: [nodeInterface],
});

export default GraphQLNotification;