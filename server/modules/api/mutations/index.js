// external imports
import { GraphQLObjectType } from 'graphql'
// local imports
import addMember from './addMember'
import addMessage from './addMessage'
import userRegistration from './userRegistration'
import userLogin from './userLogin'

const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addMember,
    addMessage,
    userRegistration,
    userLogin,
  }
})

export default mutation
