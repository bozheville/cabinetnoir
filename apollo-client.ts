
import { ApolloClient, InMemoryCache } from "@apollo/client";
const port = process.env.PORT || 3000;


const client = new ApolloClient({
    uri: `http://localhost:${port}/api/graphql`,
    cache: new InMemoryCache(),
});

export default client;
