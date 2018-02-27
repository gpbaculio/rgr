// external imports
import express from 'express'
import bodyParser from 'body-parser'
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express'
import { createServer } from 'http'
import { SubscriptionServer } from 'subscriptions-transport-ws'
import { execute, subscribe } from 'graphql'
import mongoose from 'mongoose';
// local imports
import schema from './modules/api/schema'
import {getUser} from './modules/database'
// our application
const app = express()
const port = 4000

//connect mongoose
try {
  mongoose.connect('mongodb://iamglenbacs:highoutput2017@ds127126.mlab.com:27126/gpb-relay-todos-advance');
} catch (err) {
  mongoose.createConnection('mongodb://iamglenbacs:highoutput2017@ds127126.mlab.com:27126/gpb-relay-todos-advance');
}

mongoose
  .connection
  .once('open', () => console.log('MongoDB Running'))
  .on('error', e => {
    throw e;
  });

app.get('/', (req, res) => res.send('Hello world! You are at the server port'))

app.use('/graphql', bodyParser.json(), graphqlExpress(async(req) => {
  let { user } = await getUser(req.headers.authorization);
  return ({
    schema,
    pretty: true,
    graphiql: true,
    context: {
      user
    },
  });
}));
app.use('/graphiql', graphiqlExpress({
  endpointURL: '/graphql',
  subscriptionsEndpoint: `ws://localhost:${port}/subscriptions`
}))

const server = createServer(app)
server.listen(port, () => {
  console.log(`server now listening at :${port}`)
  new SubscriptionServer(
    {
      onConnect: connectionParams => console.log('client subscription connected!', connectionParams),
      onDisconnect: () => console.log('client subscription disconnected!'),
      execute,
      subscribe,
      schema
    },
    { server, path: '/subscriptions' }
  )
})
