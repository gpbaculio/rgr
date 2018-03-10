// external imports
import { graphql } from 'react-relay'
// local imports
import subscriptionFromQuery from './subscriptionFromQuery'

export default subscriptionFromQuery(graphql`
  subscription todoAddedSubscription {
    todoAdded {
      todo {
        node {
          id
          text
          complete
          owner
        }
      }
    }
  }
`)
