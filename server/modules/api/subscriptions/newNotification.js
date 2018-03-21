// external imports
import { GraphQLObjectType } from 'graphql'
import { offsetToCursor } from 'graphql-relay'
// local imports
import { GraphQLNotificationEdge } from '../query/objectTypes'
import pubSub from '../../../pubSub'

const NewNotificationPayloadType = new GraphQLObjectType({
  name: 'NewNotificationPayloadType',
  fields: () => ({
    notification: {
      type: GraphQLNotificationEdge,
      resolve: ({ newNotification }) => {
        return ({
          cursor: offsetToCursor(newNotification.id),
          node: newNotification
        })
      }
    }
  })
})

const newNotification = {
  type: NewNotificationPayloadType,
  subscribe: () => pubSub.asyncIterator('newNotification')
}

export default newNotification
