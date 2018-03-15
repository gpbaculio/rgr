import { GraphQLNonNull, GraphQLString, GraphQLInt } from 'graphql';
import { mutationWithClientMutationId, offsetToCursor, fromGlobalId } from 'graphql-relay';
//local imports
import pubSub from '../../../pubSub';
import { likeTodo } from '../../database';
import { GraphQLTodoEdge } from '../query/objectTypes'; // connection defined on user

const GraphQLLikeTodoMutation = mutationWithClientMutationId({
  name: 'LikeTodo',
  inputFields: {
    todoId: { type: new GraphQLNonNull(GraphQLString) },
    userId: { type: new GraphQLNonNull(GraphQLString) },
  },
  mutateAndGetPayload: async({todoId, userId}) => {
    // userId is a relay id, id is id from db
    console.log('todoId = ', todoId);
    console.log('userId = ', userId);
    const todoLiked = await likeTodo(todoId, userId);
    pubSub.publish(
      'todoLiked', {
        todoLiked: {
          todoLiked
        }
      }
    );
    return ({
      todo: todoLiked
    });
  },
  outputFields: {
    todo: {
      type: GraphQLTodoEdge,
      resolve: ({todo}) => ({
        cursor: offsetToCursor(todo.id),
        node: todo
      }),
    }
  },
});

export default GraphQLLikeTodoMutation;