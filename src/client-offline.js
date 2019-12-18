import React from "react";
import { ApolloProvider } from "react-apollo-legacy";
import AWSAppSyncClient from "aws-appsync";
import Rehydrated from "./rehydrate";

import Auth from "@aws-amplify/auth";

Auth.configure({
  region: process.env.AWS_REGION,
  userPoolId: process.env.COGNITO_USER_POOL_ID,
  identityPoolId: process.env.COGNITO_IDENTITY_POOL_ID,
  userPoolWebClientId: process.env.COGNITO_APP_CLIENT_ID
});

const url = process.env.GRAPHQL_ENDPOINT;
const region = process.env.AWS_REGION;

const auth =
  process.env.AUTH_TYPE === "API_KEY"
    ? {
        type: process.env.AUTH_TYPE,
        apiKey: process.env.AUTH_API_KEY
      }
    : {
        type: process.env.AUTH_TYPE,
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
