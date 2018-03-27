
// external imports
import { graphql } from 'react-relay'
// local imports
import mutationFromQuery from './mutationFromQuery'

export default mutationFromQuery(graphql`
mutation newNotificationMutation($input: NewNotificationInput!) {
  newNotification(input:$input) {
    notification {
      __typename
      cursor
      node {
        id
        likerId
        seen
        todoId
      }
    }
  }
}
`);

