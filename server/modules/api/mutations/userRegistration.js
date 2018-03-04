import {GraphQLNonNull, GraphQLString} from 'graphql';

import {mutationWithClientMutationId} from 'graphql-relay';

import {User} from '../../models';
import {generateToken} from '../../auth';

const GraphQLUserRegistrationMutation = mutationWithClientMutationId({
  name: 'UserRegistration',
  inputFields: {
    displayName: {
      type: new GraphQLNonNull(GraphQLString)
    },
    email: {
      type: new GraphQLNonNull(GraphQLString)
    },
    password: {
      type: new GraphQLNonNull(GraphQLString)
    }
  },
  mutateAndGetPayload: async({displayName, email, password}) => {
    const user = await User.findOne({
      email: email.toLowerCase()
    });
    if (user) {
      return ({token: null, error: 'EMAIL_ALREADY_IN_USE'});
    }
    const newUser = new User({displayName, email, password});
    await newUser.save();
    return ({token: generateToken(newUser), error: null});
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

export default GraphQLUserRegistrationMutation;
