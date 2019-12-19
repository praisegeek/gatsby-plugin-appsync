import React from "react";
import { ApolloProvider } from "react-apollo-legacy";
import AWSAppSyncClient from "aws-appsync";
import Auth from "@aws-amplify/auth";

import Rehydrated from "./rehydrate";

Auth.configure({
  region: process.env.GATSBY_AWS_REGION,
  userPoolId: process.env.GATSBY_COGNITO_USER_POOL_ID,
  identityPoolId: process.env.GATSBY_COGNITO_IDENTITY_POOL_ID,
  userPoolWebClientId: process.env.GATSBY_COGNITO_APP_CLIENT_ID
});

const url = process.env.GATSBY_GRAPHQL_ENDPOINT;
const region = process.env.GATSBY_AWS_REGION;

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

const client = new AWSAppSyncClient(
  {
    url,
    region,
    auth,
    complexObjectsCredentials: Auth.currentCredentials,
    disableOffline: false
  }
  // {
  //   ssrMode:
  // }
);

export default ({ children }) => {
  return (
    <ApolloProvider client={client}>
      <Rehydrated>{children}</Rehydrated>
    </ApolloProvider>
  );
};
