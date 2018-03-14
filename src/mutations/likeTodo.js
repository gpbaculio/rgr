
// external imports
import { graphql } from 'react-relay'
// local imports
import mutationFromQuery from './mutationFromQuery'

export default mutationFromQuery(graphql`
mutation likeTodoMutation($input: LikeTodoInput!) {
  likeTodo(input:$input) {
    todo {
      __typename
      cursor
      node {
        complete
        id
        text
        owner
        likes
        likersUserId
      }
    }
  }
}
`);

