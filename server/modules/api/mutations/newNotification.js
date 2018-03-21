import { GraphQLNonNull, GraphQLString } from 'graphql';
import { mutationWithClientMutationId, offsetToCursor } from 'graphql-relay';
//local imports
import pubSub from '../../../pubSub';
import { newNotification } from '../../database';
import { GraphQLNotificationEdge } from '../query/objectTypes'; // connection defined on user

const GraphQLNewNotificationMutation = mutationWithClientMutationId({
  name: 'NewNotification',
  inputFields: {
    todoId: { type: new GraphQLNonNull(GraphQLString) },
    likerId: { type: new GraphQLNonNull(GraphQLString) },
  },
  mutateAndGetPayload: async({todoId, likerId}) => {
    const notification = await newNotification(todoId, likerId);
    pubSub.publish('newNotification', { newNotification: { notification } });
    return ({ notification });
  },
  outputFields: {
    notification: {
      type: GraphQLNotificationEdge,
      resolve: ({notification}) => ({
        cursor: offsetToCursor(notification.id),
        node: notification
      }),
    }
  },
});

export default GraphQLNewNotificationMutation;