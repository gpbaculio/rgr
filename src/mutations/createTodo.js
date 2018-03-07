
// external imports
import { graphql } from 'react-relay'
// local imports
import mutationFromQuery from './mutationFromQuery'

export default mutationFromQuery(graphql`
mutation createTodoMutation($input: CreateTodoInput!) {
  createTodo(input:$input) {
    todoEdge {
      __typename
      cursor
      node {
        complete
        id
        text
      }
    }
  }
}
`);
