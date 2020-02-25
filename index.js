import React from "react";
import Auth from "@aws-amplify/auth";
import Storage from "@aws-amplify/storage";
import AWSAppSyncClient from "aws-appsync";
import ApolloClient from "apollo-client";
import { createSubscriptionHandshakeLink } from "aws-appsync-subscription-link";
import { createHttpLink } from "apollo-link-http";
import { createAuthLink } from "aws-appsync-auth-link";
import { InMemoryCache } from "apollo-cache-inmemory";
import { onError } from "apollo-link-error";
import { ApolloLink } from "aws-appsync/node_modules/apollo-client/node_modules/apollo-link";

const url = process.env.GATSBY_GRAPHQL_ENDPOINT;
const region = process.env.GATSBY_REGION;
const clientVersion = process.env.GATSBY_APOLLO_CLIENT_VERSION;

const config = {
  mandatorySignIn: false,
  region,
  userPoolId: process.env.GATSBY_COGNITO_USER_POOL_ID,
  identityPoolId: process.env.GATSBY_COGNITO_IDENTITY_POOL_ID,
  userPoolWebClientId: process.env.GATSBY_COGNITO_APP_CLIENT_ID
};

Auth.configure({
  ...config
  // opinionated options
  // cookieStorage: options.cookieStorage || null,
  // oauth: options.oauth || null,
  // clientMetadata: options.clientMetadata || null
});

Storage.configure({
  AWSS3: {
    bucket: process.env.GATSBY_S3_BUCKET,
    region: process.env.GATSBY_S3_REGION
  }
});

const authTypes = {
  API_KEY: {
    type: "API_KEY",
    apiKey: process.env.GATSBY_AUTH_API_KEY
  },
  AMAZON_COGNITO_USER_POOLS: {
    type: process.env.GATSBY_AUTH_TYPE,
    jwtToken: async () =>
      (await Auth.currentSession()).getIdToken().getJwtToken()
  },
  AWS_IAM: {
    type: process.env.GATSBY_AUTH_TYPE,
    credentials: () => Auth.currentCredentials()
  }
};

const auth = authTypes[process.env.GATSBY_AUTH_TYPE] || authTypes["API_KEY"];

const clientTypes = {
  LEGACY: new AWSAppSyncClient({
    url,
    region,
    auth,
    complexObjectsCredentials: () => Auth.currentCredentials(),
    disableOffline: false
  }),

  WITH_HOOKS: new ApolloClient({
    link: ApolloLink.from([
      onError(({ graphQLErrors, networkError }) => {
        if (graphQLErrors)
          graphQLErrors.map(({ message, locations, path }) =>
            console.error(
              `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
            )
          );

        if (networkError) {
          console.error(`[Network error]: ${networkError}`);
        }
      }),
      createAuthLink({
        url,
        region,
        auth,
        complexObjectsCredentials: Auth.currentCredentials
      }),
      createSubscriptionHandshakeLink(
        process.env.GATSBY_GRAPHQL_ENDPOINT,
        createHttpLink({ uri: process.env.GATSBY_GRAPHQL_ENDPOINT })
      )
    ]),
    cache: new InMemoryCache()
  })
};

export const client = clientTypes[clientVersion] || clientTypes["LEGACY"];

// HOC
export const withAppSync = WrappedComponent => {
  if (clientVersion === "LEGACY") {
    const { ApolloProvider } = require("react-apollo-legacy");
    const Rehydrated = require("./src/rehydrate").default;
    return class extends React.Component {
      render() {
        return (
          <ApolloProvider client={client}>
            <Rehydrated>
              <WrappedComponent {...this.props} />
            </Rehydrated>
          </ApolloProvider>
        );
      }
    };
  }

  const { ApolloProvider } = require("react-apollo");
  return class extends React.Component {
    render() {
      return (
        <ApolloProvider client={client}>
          <WrappedComponent {...this.props} />
        </ApolloProvider>
      );
    }
  };
};

// Provider
export const AppSyncProvider = ({ options, ...props }) => {
  // pass optional params from plugin options
  Auth.configure({
    ...config,
    mandatorySignIn: options.mandatorySignIn || false,
    cookieStorage: options.cookieStorage || null,
    oauth: options.oauth || null,
    clientMetadata: options.clientMetadata || null
  });

  if (clientVersion === "LEGACY") {
    const { ApolloProvider } = require("react-apollo-legacy");
    const Rehydrated = require("./src/rehydrate").default;
    return (
      <ApolloProvider client={client}>
        <Rehydrated>{props.children}</Rehydrated>
      </ApolloProvider>
    );
  }

  const { ApolloProvider } = require("react-apollo");
  return <ApolloProvider client={client}>{props.children}</ApolloProvider>;
};
