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
      type:  GraphQLString,
      resolve: ({ displayName }) => displayName
    },
  })
})

export default GraphQLUserType
