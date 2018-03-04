// external imports
import { graphql } from 'react-relay'
// local imports
import mutationFromQuery from './mutationFromQuery'

export default mutationFromQuery(graphql`
  mutation userRegistrationMutation($input: UserRegistrationInput!) {
    userRegistration(input: $input) {
      token
      error
    }
  }
`)
