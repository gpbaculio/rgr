// external imports
import { GraphQLObjectType } from 'graphql'
// local imports
import todoAdded from './todoAdded'
import todoLiked from './todoLiked'

const subscription = new GraphQLObjectType({
  name: 'Subscription',
  fields: {
    todoAdded,
    todoLiked
  }
})

export default subscription
