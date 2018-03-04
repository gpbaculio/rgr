// external imports
import { GraphQLObjectType } from 'graphql'
// local imports
import userRegistration from './userRegistration'
import userLogin from './userLogin'

const mutations = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    userRegistration,
    userLogin,
  }
})

export default mutations
