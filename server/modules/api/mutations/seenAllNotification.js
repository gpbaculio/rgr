import { GraphQLString, GraphQLList } from 'graphql';
import { mutationWithClientMutationId, offsetToCursor, fromGlobalId } from 'graphql-relay';
//local imports
import pubSub from '../../../pubSub';
import { seenAllNotification } from '../../database';
import { GraphQLNotificationEdge } from '../query/objectTypes'; // connection defined on user

const GraphQLSeenAllNotificationMutation = mutationWithClientMutationId({
  name: 'SeenAllNotification',
  inputFields: {
    ids: { type: new GraphQLList(GraphQLString) },
  },
  mutateAndGetPayload: async({ ids }) => {
    const seenNotifications = await seenAllNotification(ids.map(id => fromGlobalId(id)));
    pubSub.publish('seenNotifications', { seenNotifications: { seenNotifications } });
    return ({ seenNotifications }); 
  },
  outputFields: {
    seenNotifications: {
      type: new GraphQLList(GraphQLNotificationEdge),
      resolve: ({ seenNotifications }) => seenNotifications.map(node => ({
        cursor: offsetToCursor(node.id),
        node,
      })),
    }
  },
});

export default GraphQLSeenAllNotificationMutation;