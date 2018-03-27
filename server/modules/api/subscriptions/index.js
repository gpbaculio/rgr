// external imports
import { GraphQLObjectType } from 'graphql'
// local imports
import todoAdded from './todoAdded'
import todoLiked from './todoLiked'
import newNotification from './newNotification'

const subscription = new GraphQLObjectType({
  name: 'Subscription',
  fields: {
    todoAdded,
    todoLiked,
    newNotification
  }
})

export default subscription
