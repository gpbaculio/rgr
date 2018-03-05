import { GraphQLNonNull, GraphQLString } from 'graphql';

import { mutationWithClientMutationId } from 'graphql-relay';

import { generateToken } from '../../auth';
import { User } from '../../models';

const GraphQLUserLoginMutation = mutationWithClientMutationId({
  name: 'UserLogin',
  inputFields: {
    email: {
      type: new GraphQLNonNull(GraphQLString)
    },
    password: {
      type: new GraphQLNonNull(GraphQLString)
    }
  },
  mutateAndGetPayload: async({email, password}) => {
    const user = await User.findOne({
      email: email.toLowerCase()
    });
    console.log('user id = ', user.id);
    if (!user) {
      return ({token: null, error: 'INVALID_EMAIL_PASSWORD'});
    }
    const correctPassword = user.authenticate(password);
    if (!correctPassword) {
      return {token: null, error: 'INVALID_EMAIL_PASSWORD'};
    }
    return ({token: generateToken(user), error: null});
  },
  outputFields: {
    token: {
      type: GraphQLString,
      resolve: ({token}) => token
    },
    error: {
      type: GraphQLString,
      resolve: ({error}) => error
    }
  }
});

export default GraphQLUserLoginMutation;
