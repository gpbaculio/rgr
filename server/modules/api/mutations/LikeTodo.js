import { GraphQLNonNull, GraphQLString, GraphQLInt } from 'graphql';
import { mutationWithClientMutationId, offsetToCursor, fromGlobalId } from 'graphql-relay';
//local imports
import pubSub from '../../../pubSub';
import {createTodo} from '../../database';
import { GraphQLTodoEdge } from '../query/objectTypes'; // connection defined on user

const GraphQLCreateTodoMutation = mutationWithClientMutationId({
  name: 'CreateTodo',
  inputFields: {
    text: { type: new GraphQLNonNull(GraphQLString) },
    userId: { type: new GraphQLNonNull(GraphQLString) },
  },
  mutateAndGetPayload: async({text, userId}) => {
    // userId is a relay id, id is id from db
    const newTodo = await createTodo(text, fromGlobalId(userId).id);
    pubSub.publish(
      'todoAdded', {
        todoAdded: {
          newTodo
        }
      }
    );
    return ({
      todo: newTodo
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

export default GraphQLCreateTodoMutation;