import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { typeDefs } from './schema/typeDefs';
import { resolvers } from './schema/resolvers';
import dbConnect from '../../../lib/mongodb';
import { verifyToken } from '../../../middleware/auth';

let apolloServerHandler;

const getApolloServerHandler = async () => {
  if (!apolloServerHandler) {
    await dbConnect();

    const server = new ApolloServer({
      typeDefs,
      resolvers,
      context: async ({ req }) => {
        const token = req.headers.authorization || '';
        const user = verifyToken(token);
        return { user };
      },
    });

    // This line ensures the server is started only once
    apolloServerHandler = startServerAndCreateNextHandler(server);
  }
  return apolloServerHandler;
};

export const GET = async (req, res) => {
  const handler = await getApolloServerHandler();
  return handler(req, res);
};

export const POST = async (req, res) => {
  const handler = await getApolloServerHandler();
  return handler(req, res);
};