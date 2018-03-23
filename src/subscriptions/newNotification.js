// external imports
import { graphql } from 'react-relay'
// local imports
import subscriptionFromQuery from './subscriptionFromQuery'

export default subscriptionFromQuery(graphql`
  subscription newNotificationSubscription {
    newNotification {
      notification {
        node {
          likerId
          seen
          todoId
          id
        }
      }
    }
  }
`)
