# Gatsby Plugin AppSync

A Gatsby plugin that makes working with AWS AppSync Client and React Apollo a breeze.

## Quick Start

This plugin comes in two modes for Offline support and Apollo Hooks compatiblity respectively.

Install plugin

```bash
npm i gatsby-plugin-appsync
```

## Configuration

Rename **.env.example** created by this plugin inside your root folder to your environment name. e.g **.env.development** if NODE_ENV is set to development. Also change the settings there

```GATSBY_GRAPHQL_ENDPOINT=http://localhost:20002/graphql
GATSBY_REGION=eu-west-2
GATSBY_COGNITO_USER_POOL_ID=
GATSBY_COGNITO_IDENTITY_POOL_ID=
GATSBY_COGNITO_APP_CLIENT_ID=
GATSBY_S3_BUCKET
GATSBY_S3_REGION
GATSBY_AUTH_API_KEY=da2-fakeApiId123456
GATSBY_AUTH_TYPE=API_KEY | AMAZON_COGNITO_USER_POOLS | AWS_IAM
GATSBY_APOLLO_CLIENT_VERSION=WITH_HOOKS | LEGACY
```

## Plugin default options in node-config.js

```js
module.exports = {
  plugins: [
    resolve: {
      "gatsby-plugin-appsync",
      options: {
        mandatorySignIn: false // true | false
        oauth: {}, // optional for cognito hosted UI
        cookieStorage: {} // optional if you intend to use cookies. Default is localstorage for aws amplify Auth
        clientMetadata: {} // optional for aws amplify Auth
      }
    }
    ...
  ]
};
```

Refer to https://aws-amplify.github.io/docs/js/authentication#manual-setup for setting oauth, cookieStorage and clientMetadata options.

## Usage

**GATSBY_APOLLO_CLIENT_VERSION = WITH_HOOKS**

This version uses React Apollo ( v 3+), with hooks. No offline support.

For example, your imports will be,

```js
import { useQuery, useLazyQuery } from "@apollo/react-hooks";
```

You can also use

```js
import { Query, graphql } from "react-apollo";
```

**GATSBY_APOLLO_CLIENT_VERSION = LEGACY**

This version uses React Apollo ( v 2.6), without hooks. With offline support.

Since NPM drop in replacement was used to alias both apollo-client@2.6.4 and react-apollo@2.5.6 for offline support and cold install, Queries, Mutations or Subscriptions can then be imported using the hint below

For example, your imports will be

```js
import { Query, Mutation, Subscription, graphql } from "react-apollo-legacy";
```

## Next Steps

**AppSync Client**

This plugin exposes an AppSync client to be used anywhere based on the version set in environment variables

```js
import { client } from "gatsby-plugin-appsync";
```

**Custom Rehydrate component**

This is only useful for offline support, legacy mode.

```js
// Shadow copy ./src/gatsby-plugin-appsync/Rehydrate.js

import React from "react";
import { Rehydrated } from "aws-appsync-react";

export default function Rehydrate({ children }) {
  return <Rehydrated loading="loading...">{children}</Rehydrated>;
}
```

## Features

- React Apollo with Hooks
- Offline support in legacy version of React Apollo client
- SSR ready
- One point configuration without additional npm installs
- Provides Amplify Auth and Storage configs out of the box
- Available everywhere on your component tree

## TODO

- Offline support in React Hooks in React Apollo v3+
