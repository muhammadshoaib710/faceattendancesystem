require('dotenv').config();

const { ApolloServer } = require('apollo-server-express');
const express = require('express');
const mongoose = require('mongoose');
const { PubSub } = require('graphql-subscriptions');
const cors = require('cors');

const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');
const trxRoutes = require('./routes/trxRoute');

const pubsub = new PubSub();

const PORT = process.env.PORT || 4000;

var env = process.env.NODE_ENV || 'development';

const app = express();

// Implement CORS middleware
const corsOptions = {
  origin: env === "development" ? ['http://localhost:3000', 'http://localhost:80'] : ['https://attendlytical.netlify.app'],
  credentials: true
};
app.use(cors(corsOptions));

app.use('/api/trx', trxRoutes);

async function startApolloServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => ({ req, pubsub }),
    playground: true,
    introspection: true
  });

  await server.start();

  server.applyMiddleware({ 
    app, 
    path: '/',
    cors: false // Disable Apollo Server's CORS as we're handling it with Express
  });

  mongoose.set('useCreateIndex', true);
  mongoose.set('useFindAndModify', false);

  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected');

    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error(err);
  }
}

startApolloServer();

/*Test

  Postman
{
  "query": "mutation {createCourse(courseInput: {code: \"123\", section: \"123\", name: \"123\"}) {name}}"
}

  mutation{
  createPerson(personInput:{
    firstName: "chai"
    lastName: "cheah Wen"
    email:"12wss3"
    password: "123"
    userLevel: 0
    SchoolCardID: "A17CS0028"
  }){
    _id
    lastLogin
    createdAt
  }
}

  mutation{
  createCourse(courseInput:{
    name: "Test",
    code:"test",
    section: "test"
  })
  {
    creator{
      firstName

    }
    code
    name
  }
}

  mutation{
  deleteCourse(courseID:"5ee1de0f270b0f8774f94094")
 {
  name
  creator{
    firstName
    createdCourses{
      name
    }
  }
}
}




  */
