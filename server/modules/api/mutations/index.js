// external imports
import { GraphQLObjectType } from 'graphql'
// local imports
import userRegistration from './userRegistration'
import userLogin from './userLogin'
import createTodo from './createTodo'

const mutations = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    userRegistration,
    userLogin,
    createTodo,
  }
})

export default mutations
