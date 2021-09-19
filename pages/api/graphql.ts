import { gql, ApolloServer } from "apollo-server-micro";
import userList from '../../fixtures/users';

const typeDefs = gql`
  type User {
    id: Int
    name: String
    email: String
  }

  type Query {
    user(id: Int): User
    users: [User]
  }
`;

const resolvers = {
  Query: {
    user: (parent, { id }) => userList.find((user) => user.id === id),
    users: () => userList,
  },
};

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
});

const startServer = apolloServer.start();

export default async (req, res) => {
  await startServer;
  await apolloServer.createHandler({ path: "/api/graphql" })(req, res);
}

export const config = {
  api: {
    bodyParser: false,
  },
};
