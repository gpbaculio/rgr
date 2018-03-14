// external imports
import { graphql } from 'react-relay'
// local imports
import subscriptionFromQuery from './subscriptionFromQuery'

export default subscriptionFromQuery(graphql`
  subscription todoLikedSubscription {
    todoLiked {
      todo {
        node {
          id
          text
          complete
          owner
          likes
          likersUserId
        }
      }
    }
  }
`)
