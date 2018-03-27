// external imports
import { GraphQLObjectType } from 'graphql'
// local imports
import userRegistration from './userRegistration'
import userLogin from './userLogin'
import createTodo from './createTodo'
import likeTodo from './likeTodo'
import newNotification from './newNotification'

const mutations = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    userRegistration,
    userLogin,
    createTodo,
    likeTodo,
    newNotification,
  }
})

export default mutations
