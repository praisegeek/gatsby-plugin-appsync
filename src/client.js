import React from "react";
import { ApolloProvider } from "react-apollo";
import { createAuthLink } from "aws-appsync-auth-link";
import { createSubscriptionHandshakeLink } from "aws-appsync-subscription-link";

import { ApolloLink } from "apollo-link";
import { onError } from "apollo-link-error";
import { createHttpLink } from "apollo-link-http";
import ApolloClient from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";

import Auth from "@aws-amplify/auth";

Auth.configure({
  region: process.env.GATSBY_AWS_REGION,
  userPoolId: process.env.GATSBY_COGNITO_USER_POOL_ID,
  identityPoolId: process.env.GATSBY_COGNITO_IDENTITY_POOL_ID,
  userPoolWebClientId: process.env.GATSBY_COGNITO_APP_CLIENT_ID
});

const url = process.env.GATSBY_GRAPHQL_ENDPOINT;
const region = process.env.GATSBY_AWS_REGION;

const onErrorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.map(({ message, locations, path }) =>
      console.error(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
    );

  if (networkError) {
    console.error(`[Network error]: ${networkError}`);
  }
});

const auth =
  process.env.AUTH_TYPE === "API_KEY"
    ? {
        type: process.env.GATSBY_AUTH_TYPE,
        apiKey: process.env.GATSBY_AUTH_API_KEY
      }
    : {
        type: process.env.GATSBY_AUTH_TYPE,
        credentials: () => Auth.currentCredentials()
      };

const httpLink = createHttpLink({ uri: url });

const link = ApolloLink.from([
  onErrorLink,
  createAuthLink({
    url,
    region,
    auth,
    complexObjectsCredentials: Auth.currentCredentials
  }),
  createSubscriptionHandshakeLink(url, httpLink)
]);

const client = new ApolloClient({
  link,
  cache: new InMemoryCache()
});

export default ({ children }) => (
  <ApolloProvider client={client}>{children}</ApolloProvider>
);
