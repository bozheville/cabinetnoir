import { gql, ApolloServer } from "apollo-server-micro";
import userList from '../../fixtures/users';
import { parseText } from '@math/parser';
import { encryptCaesar } from '@scytale/caesar';

const typeDefs = gql`
  type User {
    id: Int
    name: String
    email: String
  }

  type CaesarOutput {
    output: String
  }

  type Query {
    user(id: Int): User
    users: [User]
    caesar(input: String, key: Int): CaesarOutput
  }
`;

const caesar = (parent, {
  input,
  key,
}) => {
  return {
    output: encryptCaesar(input, key),
  };
}

const resolvers = {
  Query: {
    user: (parent, { id }) => userList.find((user) => user.id === id),
    users: () => userList,
    caesar,
  },
};

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
});

const startServer = apolloServer.start();

export default async (req, res) => {
  await startServer;
  await apolloServer.createHandler({ path: "/api/crypt" })(req, res);
}

export const config = {
  api: {
    bodyParser: false,
  },
};


// export default (req, res) => {
//   res.status(200).json(
//     parseText()
//   );
// }
