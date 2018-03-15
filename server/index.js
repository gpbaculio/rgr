import express from 'express';
import path from 'path';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import {graphiqlExpress, graphqlExpress} from 'apollo-server-express'
import {SubscriptionServer} from 'subscriptions-transport-ws';
import {execute, subscribe} from 'graphql';
import bluebird from 'bluebird';

import schema from './modules/api/schema'
import {getUser} from './modules/auth'

require('events').EventEmitter.defaultMaxListeners = 0

mongoose.Promise = bluebird;
mongoose.connect(
  'mongodb://iamglenbacs:highoutput2017@ds127126.mlab.com:27126/gpb-relay-todos-advance', 
  {
    server: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } },
    replset: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } }
  }
);

const db = mongoose.connection;
db.on('error', (e) => console.log(e)).once('open', () => console.log('Connection to Database established.'))

const port = 4000
var app = express();
const indexPath = path.join(__dirname, '../public/index.html')
const publicPath = express.static(path.join(__dirname, '../public'))

// use bodyparser
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use('/public', publicPath)
app.use('/graphql', graphqlExpress(async(req,res,next) => {
  let {user} = await getUser(req.headers.authorization);
  return ({
    schema,
    pretty: true,
    graphiql: true,
    context: {
      user
    }
  })
}))
app.use('/graphiql', graphiqlExpress({
  endpointURL: '/graphql',
  subscriptionsEndpoint: `ws://localhost:${port}/subscriptions`
}))

app.get('/*', function (_, res) {
  res.sendFile(indexPath)
});
let http = require('http');
let server = http.createServer(app);
server.listen(port, () => {
  console.log(`server now listening at :${port}`)
  new SubscriptionServer({
    onConnect: connectionParams => console.log('client subscription connected!', connectionParams),
    onDisconnect: () => console.log('client subscription disconnected!'),
    execute,
    subscribe,
    schema
  }, {server, path: '/subscriptions'})
})
