// external imports
import { GraphQLObjectType, GraphQLString } from 'graphql'
import { globalIdField } from 'graphql-relay'
// local imports
import { GraphQLUserType } from './objectTypes';
import { getUser } from '../../database';

const query = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    viewer: {
      type: GraphQLUserType,
      resolve: async(_root, _args, {user}) => {
        console.log('user context = ', user);
        if(user){
          return getUser(user._id)
        }
        return null;
      },
    }
  })
});

export default query
