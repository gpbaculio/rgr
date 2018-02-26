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
        const { user } = context;
        return getUser(user.id);
      }
    },
    node: nodeField
  }
})

export default query
