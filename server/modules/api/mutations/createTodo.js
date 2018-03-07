import { GraphQLNonNull, GraphQLString } from 'graphql';

import { mutationWithClientMutationId, offsetToCursor, fromGlobalId } from 'graphql-relay';
import {createTodo} from '../../database';
import { GraphQLTodoEdge } from '../query/objectTypes/user'; // connection defined on user

const GraphQLCreateTodoMutation = mutationWithClientMutationId({
  name: 'CreateTodo',
  inputFields: {
    text: { type: new GraphQLNonNull(GraphQLString) },
    userId: { type: new GraphQLNonNull(GraphQLString) },
  },
  mutateAndGetPayload: async({text, userId}) => {
    const {id} = fromGlobalId(userId); // userId is a relay id, id is id from db
    console.log('id = ', id);
    const newTodo = await createTodo(text, id);
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