// external imports
import { GraphQLObjectType, GraphQLString } from 'graphql'
import { globalIdField } from 'graphql-relay'
// local imports
import { GraphQLUserType } from './objectTypes';

const query = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    viewer: {
      type: GraphQLUserType,
      resolve: async(root, args) => 'asdsdasd',
      // it's important to have function to get user from Db.
    }
  })
});

export default query
