// external imports
import { GraphQLObjectType } from 'graphql'
import { offsetToCursor } from 'graphql-relay'
// local imports
import { GraphQLTodoEdge } from '../query/objectTypes'
import pubSub from '../../../pubSub'

const TodoAddedPayloadType = new GraphQLObjectType({
  name: 'TodoAddedPayloadType',
  fields: () => ({
    todo: {
      type: GraphQLTodoEdge,
      resolve: ({ newTodo }) => {
        console.log('newTodo = ', newTodo);
        return ({
          cursor: offsetToCursor(newTodo.id),
          node: newTodo
        })
      }
    }
  })
})

const todoAdded = {
  type: TodoAddedPayloadType,
  subscribe: () => pubSub.asyncIterator('todoAdded')
}

export default todoAdded
