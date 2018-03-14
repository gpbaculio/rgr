// external imports
import { GraphQLObjectType } from 'graphql'
// local imports
import userRegistration from './userRegistration'
import userLogin from './userLogin'
import createTodo from './createTodo'
import likeTodo from './likeTodo'

const mutations = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    userRegistration,
    userLogin,
    createTodo,
    likeTodo,
  }
})

export default mutations
