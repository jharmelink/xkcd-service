import cors from 'cors';
import dotenv from 'dotenv';
import express, {Request, Response} from 'express';
import mongoose from "mongoose";
import {graphqlHTTP} from 'express-graphql';
import {buildSchema} from 'graphql';
import xkcdService from "./services/xkcd-service";
import imageService from "./services/image-service";

dotenv.config();

// Construct a schema, using GraphQL schema language
const schema = buildSchema(`
  type Xkcd {
    number: Int,
    url: String,
    filename: String,
    title: String,
    description: String,
    year: Int,
    month: Int,
    day: Int
  }
  type Query {
    xkcd(number: Int): Xkcd
  }
`);

// The root provides a resolver function for each API endpoint
const root = {
    xkcd: (query: { number?: number }) => xkcdService.getXkcd(query)
};

const app = express();
app.use(cors({
    origin: [process.env.ORIGIN]
}))
app.use('/api/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,

}));
app.get('/api/images/:filename', (request: Request, response: Response) => imageService.getImage(request.params.filename, response));
app.listen(4000);

// Set up default mongoose connection
mongoose.connect(`mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/xkcd`, {useNewUrlParser: true, useUnifiedTopology: true});
// Bind connection to error event (to get notification of connection errors)
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));

console.debug('Running a GraphQL API server at http://localhost:4000/api/graphql');
