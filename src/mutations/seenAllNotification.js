
// external imports
import { graphql } from 'react-relay'
// local imports
import mutationFromQuery from './mutationFromQuery'

export default mutationFromQuery(graphql`
mutation seenAllNotificationMutation($input: SeenAllNotificationInput!) {
  seenAllNotification(input:$input) {
    seenNotifications {
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
