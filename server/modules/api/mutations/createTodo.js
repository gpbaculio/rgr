import { GraphQLNonNull, GraphQLString } from 'graphql';

import { mutationWithClientMutationId, offsetToCursor } from 'graphql-relay';
import {createTodo} from '../../database';
import { GraphQLTodoEdge } from '../query/objectTypes/user'; // connection defined on user

const GraphQLCreateTodoMutation = mutationWithClientMutationId({
  name: 'CreateTodo',
  inputFields: {
    text: { type: new GraphQLNonNull(GraphQLString) },
    userId: { type: new GraphQLNonNull(GraphQLString) },
  },
  mutateAndGetPayload: async({text, userId}) => {
    const newTodo = await createTodo(text, userId);
    console.log('newTodo = ', newTodo);
    return ({ newTodo });
  },
  outputFields: {
    todoEdge: {
      type: GraphQLTodoEdge,
      resolve: async({newTodo}) => ({
        cursor: offsetToCursor(newTodo._id),
        node: newTodo
      }),
    }
  },
});
export default GraphQLCreateTodoMutation;