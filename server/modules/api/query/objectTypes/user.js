// external imports
import { GraphQLObjectType, GraphQLString } from 'graphql'
import { globalIdField } from 'graphql-relay'
// local import
// import { MemberConnectionType, MessageConnectionType } from './'
// import { getMessageList, getMemberList } from '../memoryDb'

const GraphQLUserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: globalIdField('User'), // will receive id field from the resolved root
    displayName: {
      name: 'displayName',
      type:  GraphQLString,
      description: 'A users\' chosen display name',
      resolve: ({ displayName }) => displayName
    },
  })
})

export default GraphQLUserType
