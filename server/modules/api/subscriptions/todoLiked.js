// external imports
import { GraphQLObjectType } from 'graphql'
import { offsetToCursor } from 'graphql-relay'
// local imports
import { GraphQLTodoEdge } from '../query/objectTypes'
import pubSub from '../../../pubSub'

const TodoLikedPayloadType = new GraphQLObjectType({
  name: 'TodoLikedPayloadType',
  fields: () => ({
    todo: {
      type: GraphQLTodoEdge,
      resolve: ({ todoLiked }) => {
        return ({
          cursor: offsetToCursor(todoLiked.id),
          node: todoLiked
        })
      }
    }
  })
})

const todoLiked = {
  type: TodoLikedPayloadType,
  subscribe: () => pubSub.asyncIterator('todoLiked')
}

export default todoLiked
