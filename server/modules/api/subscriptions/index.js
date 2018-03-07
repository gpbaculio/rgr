// external imports
import { GraphQLObjectType } from 'graphql'
// local imports
import todoAdded from './todoAdded'

const subscription = new GraphQLObjectType({
  name: 'Subscription',
  fields: {
    todoAdded
  }
})

export default subscription
