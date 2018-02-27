// external imports
import { GraphQLObjectType } from 'graphql'
// local imports
import { GraphQLUserType } from './objectTypes'
import { nodeField } from '../definitions'
import { getUser } from '../../database'

const query = new GraphQLObjectType({
  name: 'Query',
  fields: {
    viewer: {
      type: GraphQLUserType,
      resolve: (_root, _args, context) => {
        console.log('context = ', context);
        const { user } = context;
        console.log('context user = ', user);
        return getUser(user.id);
      }
    },
    node: nodeField
  }
})

export default query
